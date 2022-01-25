import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { consensusState } from '../../lib/api/rpc'
import { crosschainTxs } from '../../lib/api/opensearch'
import { hexToBech32 } from '../../lib/object/key'
import { denomer } from '../../lib/object/denom'
import { chain_manager } from '../../lib/object/chain'
import { numberFormat } from '../../lib/utils'

export default function Dashboard() {
  const { chains, cosmos_chains, denoms, status, env, validators } = useSelector(state => ({ chains: state.chains, cosmos_chains: state.cosmos_chains, denoms: state.denoms, status: state.status, env: state.env, validators: state.validators }), shallowEqual)
  const { chains_data } = { ...chains }
  const { cosmos_chains_data } = { ...cosmos_chains }
  const { denoms_data } = { ...denoms }
  const { status_data } = { ...status }
  const { env_data } = { ...env }
  const { validators_data } = { ...validators }

  const [consensusStateData, setConsensusStateData] = useState(null)
  const [summaryData, setSummaryData] = useState(null)

  const [crosschainSummaryData, setCrosschainSummaryData] = useState(null)
  const [crosschainTVLData, setCrosschainTVLData] = useState(null)
  const [avgTransfersTimeRange, setAvgTransfersTimeRange] = useState(null)
  const [chainAssetSelect, setChainAssetSelect] = useState(null)
  const [crosschainChartData, setCrosschainChartData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await consensusState()

        setConsensusStateData(response)
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const getData = async () => {
      if (denoms_data && consensusStateData?.validators?.proposer?.address) {
        const validator_data = validators_data?.find(v => v.consensus_address === hexToBech32(consensusStateData.validators.proposer.address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS))

        if (validator_data) {
          consensusStateData.operator_address = validator_data.operator_address
          
          if (validator_data.description) {
            consensusStateData.proposer_name = validator_data.description.moniker
            consensusStateData.proposer_image = validator_data.description.image
          }
        }
        consensusStateData.voting_power = consensusStateData.validators.proposer.voting_power
        if (env_data?.staking_pool) {
          consensusStateData.voting_power_percentage = env_data.voting_power * 100 / Math.floor(env_data.staking_pool.bonded_tokens)
        }

        setSummaryData({
          latest_block: { ...consensusStateData },
          block_height: status_data && Number(status_data.latest_block_height),
          block_height_at: status_data && moment(status_data.latest_block_time).valueOf(),
          avg_block_time: status_data && moment(status_data.latest_block_time).diff(moment(status_data.earliest_block_time), 'seconds') / (Number(status_data.latest_block_height) - Number(status_data.earliest_block_height_for_cal || status_data.earliest_block_height)),
          active_validators: validators_data?.filter(v => ['BOND_STATUS_BONDED'].includes(v.status)).length,
          total_validators: validators_data?.length,
          denom: denomer.symbol(env_data?.staking_params?.bond_denom, denoms_data),
          online_voting_power_now: env_data?.staking_pool && numberFormat(Math.floor(env_data.staking_pool.bonded_tokens), '0,0.00a'),
          online_voting_power_now_percentage: env_data?.staking_pool && env_data.bank_supply && (Math.floor(env_data.staking_pool.bonded_tokens) * 100 / env_data.bank_supply.amount),
          total_voting_power: env_data?.bank_supply && numberFormat(env_data.bank_supply.amount, '0,0.00a'),
        })
      }
    }

    getData()
  }, [denoms_data, status_data, env_data, validators_data, consensusStateData])




  // useEffect(() => {
  //   const controller = new AbortController()

  //   const getData = async is_interval => {
  //     if (denoms_data) {
  //       let response

  //       if (!controller.signal.aborted) {
  //         if (is_interval || !avgTransfersTimeRange) {
  //           response = await crosschainTxs({
  //             aggs: {
  //               transfers: {
  //                 terms: { field: 'chain.keyword', size: 10000 },
  //                 aggs: {
  //                   assets: {
  //                     terms: { field: 'contract.name.keyword', size: 10000 },
  //                     aggs: {
  //                       amounts: {
  //                         sum: {
  //                           field: 'amount',
  //                         },
  //                       },
  //                       since: {
  //                         min: {
  //                           field: 'created_at.ms',
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           })
  //         }
  //       }

  //       const total_transfers = !(is_interval || !avgTransfersTimeRange) ? crosschainSummaryData?.total_transfers : _.orderBy(response?.data?.map(transfer => {
  //         return {
  //           ...transfer,
  //           chain_name: chainName(idFromMaintainerId(transfer.chain)),
  //           chain_image: chainImage(idFromMaintainerId(transfer.chain)),
  //           asset_name: denomName(transfer.asset, denoms_data),
  //           asset_image: denomImage(transfer.asset, denoms_data),
  //           asset_symbol: denomSymbol(transfer.asset, denoms_data),
  //           amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
  //         }
  //       }), ['tx'], ['desc'])

  //       if (!controller.signal.aborted) {
  //         response = await transfers({
  //           aggs: {
  //             transfers: {
  //               terms: { field: 'chain.keyword', size: 10000 },
  //               aggs: {
  //                 assets: {
  //                   terms: { field: 'contract.name.keyword', size: 10000 },
  //                   aggs: {
  //                     amounts: {
  //                       avg: {
  //                         field: 'amount',
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //           query: avgTransfersTimeRange?.split('').findIndex(c => !isNaN(c)) > -1 ? { range: { 'created_at.ms': { gt: moment().subtract(avgTransfersTimeRange.substring(0, avgTransfersTimeRange.split('').findIndex(c => isNaN(c))), [avgTransfersTimeRange.split('').find(c => isNaN(c))].map(timeRange => timeRange === 'y' ? 'year' : timeRange === 'm' ? 'month' : timeRange === 'h' ? 'hour' : 'day')).valueOf() } } } : undefined,
  //         })
  //       }

  //       const avg_transfers = _.orderBy(response?.data?.map(transfer => {
  //         return {
  //           ...transfer,
  //           chain_name: chainName(idFromMaintainerId(transfer.chain)),
  //           chain_image: chainImage(idFromMaintainerId(transfer.chain)),
  //           asset_name: denomName(transfer.asset, denoms_data),
  //           asset_image: denomImage(transfer.asset, denoms_data),
  //           asset_symbol: denomSymbol(transfer.asset, denoms_data),
  //           amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
  //         }
  //       }), ['tx'], ['desc'])

  //       if (!controller.signal.aborted) {
  //         if (is_interval || !avgTransfersTimeRange) {
  //           response = await transfers({
  //             aggs: {
  //               transfers: {
  //                 terms: { field: 'chain.keyword', size: 10000 },
  //                 aggs: {
  //                   assets: {
  //                     terms: { field: 'contract.name.keyword', size: 10000 },
  //                     aggs: {
  //                       amounts: {
  //                         max: {
  //                           field: 'amount',
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //             query: { range: { 'created_at.ms': { gt: moment().subtract(24, 'hours').valueOf() } } },
  //           })
  //         }
  //       }

  //       const highest_transfer_24h = !(is_interval || !avgTransfersTimeRange) ? crosschainSummaryData?.highest_transfer_24h : _.orderBy(response?.data?.map(transfer => {
  //         return {
  //           ...transfer,
  //           chain_name: chainName(idFromMaintainerId(transfer.chain)),
  //           chain_image: chainImage(idFromMaintainerId(transfer.chain)),
  //           asset_name: denomName(transfer.asset, denoms_data),
  //           asset_image: denomImage(transfer.asset, denoms_data),
  //           asset_symbol: denomSymbol(transfer.asset, denoms_data),
  //           amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
  //         }
  //       }), ['tx'], ['desc'])

  //       setCrosschainSummaryData({
  //         total_transfers,
  //         avg_transfers,
  //         highest_transfer_24h,
  //       })
  //     }
  //   }

  //   getData()

  //   const interval = setInterval(() => getData(true), 30 * 1000)
  //   return () => {
  //     controller?.abort()
  //     clearInterval(interval)
  //   }
  // }, [denoms_data, avgTransfersTimeRange])

  // useEffect(() => {
  //   const controller = new AbortController()

  //   const getData = async isInterval => {
  //     if (denoms_data) {
  //       let tvls
  //       const tvls_updated_at = moment().valueOf()

  //       if (!controller.signal.aborted) {
  //         if (isInterval || !avgTransfersTimeRange) {
  //           const responseIn = (await crosschainTxs({
  //             aggs: {
  //               assets: {
  //                 terms: { field: 'contract.name.keyword', size: 10000 },
  //                 aggs: {
  //                   amounts: {
  //                     sum: {
  //                       field: 'amount',
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //             query: { match: { 'logs.events.attributes.value': 'ConfirmDeposit' } },
  //           }))?.data || []

  //           const responseOut = (await crosschainTxs({
  //             aggs: {
  //               assets: {
  //                 terms: { field: 'contract.name.keyword', size: 10000 },
  //                 aggs: {
  //                   amounts: {
  //                     sum: {
  //                       field: 'amount',
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //             query: { match: { 'logs.events.attributes.value': 'ConfirmERC20Deposit' } },
  //           }))?.data || []

  //           const allAssets = _.uniq(_.concat(responseIn, responseOut).map(transfer => transfer.asset)).filter(asset => asset)

  //           tvls = _.orderBy(allAssets.map(asset => {
  //             return {
  //               asset_name: denomName(asset, denoms_data),
  //               asset_image: denomImage(asset, denoms_data),
  //               asset_symbol: denomSymbol(asset, denoms_data),
  //               amount: _.sum(_.concat(
  //                 responseIn.filter(transfer => transfer.asset === asset).map(transfer => denomAmount(transfer.amount, asset, denoms_data)),
  //                 responseOut.filter(transfer => transfer.asset === asset).map(transfer => -1 * denomAmount(transfer.amount, asset, denoms_data)),
  //               )),
  //             }
  //           }), ['amount'], ['desc'])
  //         }
  //       }

  //       setCrosschainTVLData({
  //         tvls,
  //         tvls_updated_at,
  //       })
  //     }
  //   }

  //   getData()

  //   const interval = setInterval(() => getData(true), 30 * 1000)
  //   return () => {
  //     controller?.abort()
  //     clearInterval(interval)
  //   }
  // }, [denoms_data, avgTransfersTimeRange])

  // useEffect(() => {
  //   if (!chainAssetSelect && crosschainSummaryData?.total_transfers?.[0]?.id) {
  //     setChainAssetSelect(crosschainSummaryData.total_transfers[0].id)
  //   }
  // }, [crosschainSummaryData, chainAssetSelect])

  // useEffect(() => {
  //   const controller = new AbortController()

  //   const getData = async () => {
  //     if (denoms_data && chainAssetSelect) {
  //       const today = moment().utc().startOf('day')
  //       const daily_time_range = 30
  //       const day_ms = 24 * 60 * 60 * 1000

  //       let response

  //       if (!controller.signal.aborted) {
  //         response = await crosschainTxs({
  //           aggs: {
  //             transfers: {
  //               terms: { field: 'chain.keyword', size: 10000 },
  //               aggs: {
  //                 assets: {
  //                   terms: { field: 'contract.name.keyword', size: 10000 },
  //                   aggs: {
  //                     times: {
  //                       terms: { field: 'created_at.day', size: 10000 },
  //                       aggs: {
  //                         amounts: {
  //                           sum: {
  //                             field: 'amount',
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         })
  //       }

  //       const total_transfers = _.orderBy(response?.data?.map(transfer => {
  //         const times = []

  //         for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
  //           let timeData = transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 }

  //           timeData = {
  //             ...timeData,
  //             amount: denomAmount(timeData.amount, transfer.asset, denoms_data),
  //           }

  //           times.push(timeData)
  //         }

  //         return {
  //           ...transfer,
  //           times,
  //           chain_name: chainName(idFromMaintainerId(transfer.chain)),
  //           chain_image: chainImage(idFromMaintainerId(transfer.chain)),
  //           asset_name: denomName(transfer.asset, denoms_data),
  //           asset_image: denomImage(transfer.asset, denoms_data),
  //           asset_symbol: denomSymbol(transfer.asset, denoms_data),
  //           amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
  //         }
  //       }), ['tx'], ['desc'])

  //       if (!controller.signal.aborted) {
  //         response = await transfers({
  //           aggs: {
  //             transfers: {
  //               terms: { field: 'chain.keyword', size: 10000 },
  //               aggs: {
  //                 assets: {
  //                   terms: { field: 'contract.name.keyword', size: 10000 },
  //                   aggs: {
  //                     times: {
  //                       terms: { field: 'created_at.day', size: 10000 },
  //                       aggs: {
  //                         amounts: {
  //                           max: {
  //                             field: 'amount',
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         })
  //       }

  //       const highest_transfer_24h = _.orderBy(response?.data?.map(transfer => {
  //         const times = []

  //         for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
  //           let timeData = transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 }

  //           timeData = {
  //             ...timeData,
  //             amount: denomAmount(timeData.amount, transfer.asset, denoms_data),
  //           }

  //           times.push(timeData)
  //         }

  //         return {
  //           ...transfer,
  //           times,
  //           chain_name: chainName(idFromMaintainerId(transfer.chain)),
  //           chain_image: chainImage(idFromMaintainerId(transfer.chain)),
  //           asset_name: denomName(transfer.asset, denoms_data),
  //           asset_image: denomImage(transfer.asset, denoms_data),
  //           asset_symbol: denomSymbol(transfer.asset, denoms_data),
  //           amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
  //         }
  //       }), ['tx'], ['desc'])

  //       setCrosschainChartData({
  //         total_transfers,
  //         highest_transfer_24h,
  //       })
  //     }
  //   }

  //   getData()

  //   const interval = setInterval(() => getData(), 30 * 1000)
  //   return () => {
  //     controller?.abort()
  //     clearInterval(interval)
  //   }
  // }, [denoms_data, chainAssetSelect])

  return (
    <div className="mb-4 mx-auto pb-2">
      <Summary
        data={summaryData}
        crosschainData={crosschainSummaryData}
        tvlData={crosschainTVLData}
        avgTransfersTimeRange={avgTransfersTimeRange || 'all-time'}
        setAvgTransfersTimeRange={timeRange => setAvgTransfersTimeRange(timeRange)}
        chainAssetSelect={chainAssetSelect || crosschainSummaryData?.total_transfers?.[0]?.chain}
        setChainAssetSelect={chain => setChainAssetSelect(chain)}
        chartData={crosschainChartData}
      />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 mt-6 mb-4">
        <div className="mt-3">
          <Link href="/blocks">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Blocks</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <BlocksTable
              n={10}
              className="bg-white dark:bg-black no-border"
            />
          </Widget>
        </div>
        <div className="mt-8 md:mt-3">
          <Link href="/transactions">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Transactions</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <TransactionsTable
              location="index"
              className="bg-white dark:bg-black no-border"
            />
          </Widget>
        </div>
      </div>
    </div>
  )
}