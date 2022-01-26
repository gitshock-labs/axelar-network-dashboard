import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import NetworkGraph from './network-graph'
import TransfersTable from './transfers-table'
import AssetSelect from './asset-select'
import TimelyTransactions from './charts/timely-transactions'
import TimelyVolume from './charts/timely-volume'
import TimelyHighestTransfer from './charts/timely-highest-transfer'

import { crosschainTxs } from '../../lib/api/opensearch'
import { getChain } from '../../lib/object/chain'
import { getDenom, denomer } from '../../lib/object/denom'
import { currency } from '../../lib/object/currency'

export default function Crosschain() {
  const { chains, cosmos_chains, denoms } = useSelector(state => ({ chains: state.chains, cosmos_chains: state.cosmos_chains, denoms: state.denoms }), shallowEqual)
  const { chains_data } = { ...chains }
  const { cosmos_chains_data } = { ...cosmos_chains }
  const { denoms_data } = { ...denoms }

  const [transfersData, setTransfersData] = useState(null)
  const [assetSelect, setAssetSelect] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [timeFocus, setTimeFocus] = useState(moment().utc().startOf('day').valueOf())

  const is_cosmos = id => !!getChain(id, cosmos_chains_data)
  const axelarChain = getChain('axelarnet', cosmos_chains_data)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (chains_data && cosmos_chains_data && denoms_data) {
        let response, data

        if (!controller.signal.aborted) {
          response = await crosschainTxs({
            aggs: {
              from_chains: {
                terms: { field: 'send.sender_chain.keyword', size: 10000 },
                aggs: {
                  to_chains: {
                    terms: { field: 'send.recipient_chain.keyword', size: 10000 },
                    aggs: {
                      assets: {
                        terms: { field: 'send.denom.keyword', size: 10000 },
                        aggs: {
                          amounts: {
                            sum: {
                              field: 'send.amount',
                            },
                          },
                          avg_amounts: {
                            avg: {
                              field: 'send.amount',
                            },
                          },
                          max_amounts: {
                            max: {
                              field: 'send.amount',
                            },
                          },
                          since: {
                            min: {
                              field: 'send.created_at.ms',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        data = _.orderBy(response?.data?.map(t => {
          const asset = getDenom(t?.asset, denoms_data)

          return {
            ...t,
            from_chain: getChain(t?.from_chain, chains_data) || getChain(t?.from_chain, cosmos_chains_data),
            to_chain: getChain(t?.to_chain, chains_data) || getChain(t?.to_chain, cosmos_chains_data),
            asset,
            amount: denomer.amount(t?.amount, asset?.id, denoms_data),
            avg_amount: denomer.amount(t?.avg_amount, asset?.id, denoms_data),
            max_amount: denomer.amount(t?.max_amount, asset?.id, denoms_data),
          }
        }).map(t => {
          return {
            ...t,
            value: (t?.asset?.token_data?.[currency] && (t.asset.token_data[currency] * t.amount)) || 0,
            avg_value: (t?.asset?.token_data?.[currency] && (t.asset.token_data[currency] * t.avg_amount)) || 0,
            max_value: (t?.asset?.token_data?.[currency] && (t.asset.token_data[currency] * t.max_amount)) || 0,
          }
        }), ['tx'], ['desc'])

        let _data = []

        for (let i = 0; i < data.length; i++) {
          const transfer = data[i]

          if (!is_cosmos(transfer?.from_chain?.id) && !is_cosmos(transfer?.to_chain?.id)) {
            const from_transfer = _.cloneDeep(transfer)
            from_transfer.to_chain = axelarChain
            from_transfer.id = `${from_transfer.from_chain?.id}_${from_transfer.to_chain?.id}_${from_transfer.asset?.id}`
            _data.push(from_transfer)

            const to_transfer = _.cloneDeep(transfer)
            to_transfer.from_chain = axelarChain
            to_transfer.id = `${to_transfer.from_chain?.id}_${to_transfer.to_chain?.id}_${to_transfer.asset?.id}`
            _data.push(to_transfer)
          }
          else {
            transfer.id = `${transfer.from_chain?.id}_${transfer.to_chain?.id}_${transfer.asset?.id}`
            _data.push(transfer)
          }
        }

        _data = Object.entries(_.groupBy(_data, 'id')).map(([key, value]) => {
          return {
            id: key,
            ..._.head(value),
            tx: _.sumBy(value, 'tx'),
            amount: _.sumBy(value, 'amount'),
            value: _.sumBy(value, 'value'),
            avg_amount: _.mean(value.map(v => v.tx * v.avg_amount)),
            avg_value: _.mean(value.map(v => v.tx * v.avg_value)),
            max_amount: _.maxBy(value, 'max_amount')?.max_amount,
            max_value: _.maxBy(value, 'max_value')?.max_value,
            since: _.minBy(value, 'since')?.since,
          }
        })

        data = _data

        setTransfersData({ data })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [chains_data, cosmos_chains_data, denoms_data])

  // useEffect(() => {
  //   if (!chainAssetSelect && crosschainSummaryData?.total_transfers?.[0]?.id) {
  //     setChainAssetSelect(crosschainSummaryData.total_transfers[0].id)
  //   }
  // }, [crosschainSummaryData, chainAssetSelect])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (chains_data && cosmos_chains_data && denoms_data) {
        const today = moment().utc().startOf('day')
        const daily_time_range = 30
        const day_ms = 24 * 60 * 60 * 1000

        let response

        if (!controller.signal.aborted) {
          response = await crosschainTxs({
            aggs: {
              assets: {
                terms: { field: 'send.denom.keyword', size: 10000 },
                aggs: {
                  from_chains: {
                    terms: { field: 'send.sender_chain.keyword', size: 10000 },
                    aggs: {
                      to_chains: {
                        terms: { field: 'send.recipient_chain.keyword', size: 10000 },
                        aggs: {
                          times: {
                            terms: { field: 'send.created_at.day', size: 10000 },
                            aggs: {
                              amounts: {
                                sum: {
                                  field: 'send.amount',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }
console.log(response)
        // const total_transfers = _.orderBy(response?.data?.map(transfer => {
        //   const times = []

        //   for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
        //     let timeData = transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 }

        //     timeData = {
        //       ...timeData,
        //       amount: denomAmount(timeData.amount, transfer.asset, denoms_data),
        //     }

        //     times.push(timeData)
        //   }

        //   return {
        //     ...transfer,
        //     times,
        //     chain_name: chainName(idFromMaintainerId(transfer.chain)),
        //     chain_image: chainImage(idFromMaintainerId(transfer.chain)),
        //     asset_name: denomName(transfer.asset, denoms_data),
        //     asset_image: denomImage(transfer.asset, denoms_data),
        //     asset_symbol: denomSymbol(transfer.asset, denoms_data),
        //     amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
        //   }
        // }), ['tx'], ['desc'])

        // setCrosschainChartData({
        //   total_transfers,
        //   highest_transfer_24h,
        // })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [chains_data && cosmos_chains_data && denoms_data])

  return (
    <div className="max-w-full mx-auto">
      <NetworkGraph data={transfersData?.data} />
      {chartData && (
        <>
          <div className="text-gray-900 dark:text-gray-100 text-base font-semibold mt-8 sm:mt-4 sm:mx-2">
            {chainAssetSelect && chartData ?
              <div className="flex justify-start">
                <ChainAssetSelect
                  chainAssets={crosschainData?.total_transfers}
                  chainAssetSelect={chainAssetSelect}
                  setChainAssetSelect={chainAsset => setChainAssetSelect(chainAsset)}
                />
              </div>
              :
              <div className="skeleton w-20 h-6 mb-0.5" />
            }
          </div>
          <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 mb-4">
            <Widget
              title={<span className="text-black dark:text-white text-base font-semibold">Transactions</span>}
              description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Number of transactions by day</span>}
              right={[chainAssetSelect && chartData?.total_transfers?.find(transfer => transfer?.id === chainAssetSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
                <div key={i} className="min-w-max text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="font-mono text-base font-semibold">
                      {typeof _time.tx === 'number' ? numberFormat(_time.tx, '0,0') : '- '}
                    </span>
                    <span className="text-gray-400 dark:text-gray-600 text-xs">Txs</span>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
                </div>
              ))}
              contentClassName="items-start"
              className="dark:border-gray-900 pb-0 px-2 sm:px-4"
            >
              <div>
                <TimelyTransactions txsData={chartData && (chartData.total_transfers.find(transfer => transfer?.id === chainAssetSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
              </div>
            </Widget>
            <Widget
              title={<span className="text-black dark:text-white text-base font-semibold">Volume</span>}
              description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Transfer volume by day</span>}
              right={[chainAssetSelect && chartData?.total_transfers?.find(transfer => transfer?.id === chainAssetSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
                <div key={i} className="min-w-max text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="font-mono text-base font-semibold">
                      {typeof _time.amount === 'number' ? numberFormat(_time.amount, '0,0.00000000') : '- '}
                    </span>
                    <span className="uppercase text-gray-400 dark:text-gray-600 text-xs">{chartData.total_transfers.find(transfer => transfer?.id === chainAssetSelect)?.denom}</span>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
                </div>
              ))}
              contentClassName="items-start"
              className="dark:border-gray-900 pb-0 px-2 sm:px-4"
            >
              <div>
                <TimelyVolume volumeData={chartData && (chartData.total_transfers.find(transfer => transfer?.id === chainAssetSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
              </div>
            </Widget>
            <Widget
              title={<span className="text-black dark:text-white text-base font-semibold">Highest Transfer</span>}
              description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Highest transfer size by day</span>}
              right={[chainAssetSelect && chartData?.highest_transfer_24h?.find(transfer => transfer?.id === chainAssetSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
                <div key={i} className="min-w-max text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="font-mono text-base font-semibold">
                      {typeof _time.amount === 'number' ? numberFormat(_time.amount, '0,0.00000000') : '- '}
                    </span>
                    <span className="uppercase text-gray-400 dark:text-gray-600 text-xs">{chartData.highest_transfer_24h.find(transfer => transfer?.id === chainAssetSelect)?.denom}</span>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
                </div>
              ))}
              contentClassName="items-start"
              className="dark:border-gray-900 pb-0 px-2 sm:px-4"
            >
              <div>
                <TimelyHighestTransfer highestTransferData={chartData && (chartData.highest_transfer_24h.find(transfer => transfer?.id === chainAssetSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
              </div>
            </Widget>
          </div>
        </>
      )}
      <TransfersTable data={transfersData} />
    </div>
  )
}