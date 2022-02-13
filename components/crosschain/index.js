import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import AssetSelect from './asset-select'
import TimelyTransactions from './charts/timely-transactions'
import TimelyVolume from './charts/timely-volume'
import TransactionsByChain from './charts/transactions-by-chain'
import TVLByChain from './charts/tvl-by-chain'
import NetworkGraph from './network-graph'
import TransfersTable from './transfers-table'
import Widget from '../widget'

import { crosschainTxs } from '../../lib/api/opensearch'
import { getChain } from '../../lib/object/chain'
import { getDenom, denomer } from '../../lib/object/denom'
import { currency } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

export default function Crosschain() {
  const { chains, cosmos_chains, assets, denoms, tvl } = useSelector(state => ({ chains: state.chains, cosmos_chains: state.cosmos_chains, assets: state.assets, denoms: state.denoms, tvl: state.tvl }), shallowEqual)
  const { chains_data } = { ...chains }
  const { cosmos_chains_data } = { ...cosmos_chains }
  const { assets_data } = { ...assets }
  const { denoms_data } = { ...denoms }
  const { tvl_data } = { ...tvl }

  const [assetSelect, setAssetSelect] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [timeFocus, setTimeFocus] = useState(moment().utc().startOf('day').valueOf())
  const [transfersData, setTransfersData] = useState(null)
  const [crosschainTVLData, setCrosschainTVLData] = useState(null)

  const staging = process.env.NEXT_PUBLIC_SITE_URL?.includes('staging')
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
          const price = t?.asset?.token_data?.[currency] || 0

          return {
            ...t,
            value: (price * t.amount) || 0,
            avg_value: (price * t.avg_amount) || 0,
            max_value: (price * t.max_amount) || 0,
          }
        }), ['tx'], ['desc']).filter(t => assets_data?.findIndex(a => a?.id === t?.asset?.id && (!a.is_staging || staging)) > -1)

        let _data = []
        for (let i = 0; i < data.length; i++) {
          const transfer = data[i]
          if (transfer?.from_chain?.id !== axelarChain?.id && transfer?.to_chain?.id !== axelarChain?.id) {
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
        data = _.orderBy(_data, ['tx'], ['desc'])

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

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (chains_data && cosmos_chains_data && denoms_data) {
        const today = moment().utc().startOf('day')
        const daily_time_range = 30
        const day_ms = 24 * 60 * 60 * 1000

        let response, data

        if (!controller.signal.aborted) {
          response = await crosschainTxs({
            aggs: {
              assets: {
                terms: { field: 'send.denom.keyword', size: 10000 },
                aggs: {
                  to_chains: {
                    terms: { field: 'send.recipient_chain.keyword', size: 10000 },
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
            query: { range: { 'send.created_at.ms': { gte: moment(today).subtract(daily_time_range, 'days').valueOf() } } },
          })
        }

        data = _.orderBy(response?.data?.map(t => {
          const asset = getDenom(t?.asset, denoms_data)

          return {
            ...t,
            to_chain: getChain(t?.to_chain, chains_data) || getChain(t?.to_chain, cosmos_chains_data),
            asset,
            amount: denomer.amount(t?.amount, asset?.id, denoms_data),
            avg_amount: denomer.amount(t?.avg_amount, asset?.id, denoms_data),
            max_amount: denomer.amount(t?.max_amount, asset?.id, denoms_data),
            times: t?.times?.map(time => {
              return {
                ...time,
                amount: denomer.amount(time?.amount, asset?.id, denoms_data),
                avg_amount: denomer.amount(time?.avg_amount, asset?.id, denoms_data),
                max_amount: denomer.amount(time?.max_amount, asset?.id, denoms_data),
              }
            }),
          }
        }).map(t => {
          const price = t?.asset?.token_data?.[currency] || 0

          return {
            ...t,
            value: (price * t.amount) || 0,
            avg_value: (price * t.avg_amount) || 0,
            max_value: (price * t.max_amount) || 0,
            times: t?.times?.map(time => {
              return {
                ...time,
                value: (price * time.amount) || 0,
                avg_value: (price * time.avg_amount) || 0,
                max_value: (price * time.max_amount) || 0,
              }
            }),
          }
        }), ['tx'], ['desc']).filter(t => assets_data?.findIndex(a => a?.id === t?.asset?.id && (!a.is_staging || staging)) > -1)

        let _data = []
        for (let i = 0; i < data.length; i++) {
          const transfer = data[i]
          transfer.id = `${transfer.asset?.id}_${transfer.to_chain?.id}`
          _data.push(transfer)
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
            times: Object.entries(_.groupBy(value?.flatMap(v => v.times || []) || [], 'time')).map(([_key, _value]) => {
              return {
                time: Number(_key),
                tx: _.sumBy(_value, 'tx'),
                amount: _.sumBy(_value, 'amount'),
                value: _.sumBy(_value, 'value'),
                avg_amount: _.mean(_value.map(v => v.tx * v.avg_amount)),
                avg_value: _.mean(_value.map(v => v.tx * v.avg_value)),
                max_amount: _.maxBy(_value, 'max_amount')?.max_amount,
                max_value: _.maxBy(_value, 'max_value')?.max_value,
              }
            }),
          }
        })

        data = _data
        data = Object.entries(_.groupBy(_.orderBy(data.map(t => {
          const times = []

          for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
            const time_data = t.times?.find(_t => _t.time === time) || { time, tx: 0, amount: 0, value: 0, avg_amount: 0, avg_value: 0 }

            times.push(time_data)
          }

          return {
            ...t,
            times,
          }
        }), ['tx'], ['desc']), 'asset.id')).map(([key, value]) => {
          return {
            id: key,
            asset: _.head(value)?.asset,
            times: Object.entries(_.groupBy(value?.flatMap(v => v.times || []) || [], 'time')).map(([_key, _value]) => {
              return {
                time: Number(_key),
                tx: _.sumBy(_value, 'tx'),
                amount: _.sumBy(_value, 'amount'),
                value: _.sumBy(_value, 'value'),
                avg_amount: _.mean(_value.map(v => v.tx * v.avg_amount)),
                avg_value: _.mean(_value.map(v => v.tx * v.avg_value)),
                max_amount: _.maxBy(_value, 'max_amount')?.max_amount,
                max_value: _.maxBy(_value, 'max_value')?.max_value,
              }
            }),
            data: value,
          }
        })

        setChartData({ data })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [chains_data && cosmos_chains_data && denoms_data])

  useEffect(() => {
    if (!assetSelect && chartData?.data?.[0]?.id) {
      setAssetSelect(chartData.data[0].id)
    }
  }, [assetSelect, chartData])

  useEffect(() => {
    if (tvl_data) {
      const data = Object.entries(tvl_data).map(([key, value]) => {
        const chain = chains_data?.find(c => c?.id === _.head(key.split('_')))
        const asset = assets_data?.find(a => a?.contracts?.findIndex(c => c?.chain_id === chain?.chain_id && c.contract_address === _.last(key.split('_'))) > -1)
        const denom = denoms_data?.find(d => d?.id === asset?.id)
        const amount = value
        const price = denom?.token_data?.[currency] || 0
        const _value = (price * amount) || 0

        return {
          chain,
          asset,
          denom,
          amount,
          value: _value,
        }
      })

      setCrosschainTVLData({ data, updated_at: moment().valueOf() })
    }
  }, [denoms_data, tvl_data])

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-4">
        {assetSelect ?
          <div className="flex justify-start">
            <AssetSelect
              assets={chartData?.data}
              assetSelect={assetSelect}
              setAssetSelect={a => setAssetSelect(a)}
            />
          </div>
          :
          <div className="skeleton w-28 h-7 mb-3 ml-auto" />
        }
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Widget
            title={<span className="text-black dark:text-white text-base font-semibold">Transactions</span>}
            description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Number of transactions by day</span>}
            right={[assetSelect && chartData?.data?.find(t => t?.id === assetSelect)?.times?.find(t => t.time === timeFocus)].filter(t => t).map((t, i) => (
              <div key={i} className="min-w-max text-right space-y-1">
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="font-mono text-base font-semibold">
                    {typeof t.tx === 'number' ? numberFormat(t.tx, '0,0') : '- '}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-base">TXs</span>
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-2xs font-medium">{moment(t.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
              </div>
            ))}
            contentClassName="items-start"
            className="shadow border-0 pb-0 px-2 sm:px-4"
          >
            <TimelyTransactions
              txsData={chartData?.data?.find(t => t?.id === assetSelect)}
              setTimeFocus={t => setTimeFocus(t)}
            />
          </Widget>
          <Widget
            title={<span className="text-black dark:text-white text-base font-semibold">Volume</span>}
            description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Transfer volume by day</span>}
            right={[assetSelect && chartData?.data?.find(t => t?.id === assetSelect)?.times?.find(t => t.time === timeFocus)].filter(t => t).map((t, i) => (
              <div key={i} className="min-w-max text-right space-y-1">
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="font-mono text-base font-semibold">
                    {typeof t.amount === 'number' ? numberFormat(t.amount, '0,0.00000000') : '- '}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-base">{chartData.data.find(_t => _t?.id === assetSelect)?.asset?.symbol}</span>
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-2xs font-medium">{moment(t.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
              </div>
            ))}
            contentClassName="items-start"
            className="shadow border-0 pb-0 px-2 sm:px-4"
          >
            <TimelyVolume
              volumeData={chartData?.data?.find(t => t?.id === assetSelect)}
              setTimeFocus={t => setTimeFocus(t)}
            />
          </Widget>
          <Widget
            title={<span className="text-black dark:text-white text-base font-semibold">Transactions</span>}
            description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Number of transactions by destination chain</span>}
            right={[assetSelect && chartData?.data?.find(t => t?.id === assetSelect)].filter(t => t).map((t, i) => (
              <div key={i} className="min-w-max text-right space-y-0.5">
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="font-mono text-base font-semibold">
                    {typeof _.sumBy(t.data, 'tx') === 'number' ? numberFormat(_.sumBy(t.data, 'tx'), '0,0') : '- '}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-base">TXs</span>
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-xs font-medium">{t.data?.length || 0} Chains</div>
              </div>
            ))}
            className="shadow border-0 pb-0 px-2 sm:px-4"
          >
            <TransactionsByChain
              txsData={chartData?.data?.find(t => t?.id === assetSelect)}
            />
          </Widget>
          <Widget
            title={<span className="text-black dark:text-white text-base font-semibold">TVL</span>}
            description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Total Value Locked on Axelar Network</span>}
            right={assetSelect && crosschainTVLData?.updated_at && (
              <div className="min-w-max text-right space-y-1.5 -mt-0.5">
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="font-mono text-base font-semibold">
                    {typeof _.sumBy(crosschainTVLData.data?.filter(d => d?.asset?.id === assetSelect), 'amount') === 'number' ? numberFormat(_.sumBy(crosschainTVLData.data?.filter(d => d?.asset?.id === assetSelect), 'amount'), '0,0.00000000') : '- '}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 text-base">{crosschainTVLData.data?.find(_t => _t?.asset?.id === assetSelect)?.asset?.symbol}</span>
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-2xs font-medium">{moment(crosschainTVLData.updated_at).format('MMM, D YYYY h:mm:ss A')}</div>
              </div>
            )}
            className="shadow border-0 pb-0 px-2 sm:px-4"
          >
            <TVLByChain
              tvlData={crosschainTVLData?.data?.filter(d => d?.asset?.id === assetSelect)}
            />
          </Widget>
        </div>
      </div>
      <Widget
        title={<span className="text-black dark:text-white text-base font-semibold">Traffics</span>}
        description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Cross-chain on Axelar Network</span>}
        className="shadow border-0 my-6 px-4 sm:py-4"
      >
        <NetworkGraph data={transfersData?.data} />
      </Widget>
      <TransfersTable data={transfersData} />
    </div>
  )
}