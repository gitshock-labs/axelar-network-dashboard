import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { status as getStatus, consensusState } from '../../lib/api/rpc'
import { allValidators, validatorProfile, allDelegations } from '../../lib/api/cosmos'
import { transfers } from '../../lib/api/opensearch'
import { hexToBech32 } from '../../lib/object/key'
import { denomSymbol, denomName, denomAmount, denomImage } from '../../lib/object/denom'
import { chainName, chainImage, idFromMaintainerId, chainDenomDivider } from '../../lib/object/chain'
import { numberFormat, randImage } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA } from '../../reducers/types'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data, status_data, validators_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)
  const [crosschainSummaryData, setCrosschainSummaryData] = useState(null)
  const [crosschainTVLData, setCrosschainTVLData] = useState(null)
  const [avgTransfersTimeRange, setAvgTransfersTimeRange] = useState(null)
  const [chainSelect, setChainSelect] = useState(null)
  const [crosschainChartData, setCrosschainChartData] = useState(null)
  const [consensusStateData, setConsensusStateData] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getStatus()

        if (response) {
          dispatch({
            type: STATUS_DATA,
            value: response,
          })
        }
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
    const controller = new AbortController()

    const getData = async isInterval => {
      if (denoms_data) {
        let response

        if (!controller.signal.aborted) {
          if (isInterval || !avgTransfersTimeRange) {
            response = await transfers({
              aggs: {
                transfers: {
                  terms: { field: 'chain.keyword', size: 10000 },
                  aggs: {
                    amounts: {
                      sum: {
                        field: 'amount',
                      },
                    },
                    since: {
                      min: {
                        field: 'created_at.ms',
                      },
                    },
                  },
                },
              },
            })
          }
        }

        const total_transfers = !(isInterval || !avgTransfersTimeRange) ? crosschainSummaryData?.total_transfers : _.orderBy(response?.data?.map(transfer => {
          return {
            ...transfer,
            name: chainName(idFromMaintainerId(transfer.chain)),
            image: chainImage(idFromMaintainerId(transfer.chain)),
            amount: transfer.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)),
          }
        }), ['tx'], ['desc'])

        if (!controller.signal.aborted) {
          response = await transfers({
            aggs: {
              transfers: {
                terms: { field: 'chain.keyword', size: 10000 },
                aggs: {
                  amounts: {
                    avg: {
                      field: 'amount',
                    },
                  },
                },
              },
            },
            query: avgTransfersTimeRange?.split('').findIndex(c => !isNaN(c)) > -1 ? { range: { 'created_at.ms': { gt: moment().subtract(avgTransfersTimeRange.substring(0, avgTransfersTimeRange.split('').findIndex(c => isNaN(c))), [avgTransfersTimeRange.split('').find(c => isNaN(c))].map(timeRange => timeRange === 'y' ? 'year' : timeRange === 'm' ? 'month' : timeRange === 'h' ? 'hour' : 'day')).valueOf() } } } : undefined,
          })
        }

        const avg_transfers = _.orderBy(response?.data?.map(transfer => {
          return {
            ...transfer,
            name: chainName(idFromMaintainerId(transfer.chain)),
            image: chainImage(idFromMaintainerId(transfer.chain)),
            amount: transfer.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)),
          }
        }), ['tx'], ['desc'])

        if (!controller.signal.aborted) {
          if (isInterval || !avgTransfersTimeRange) {
            response = await transfers({
              aggs: {
                transfers: {
                  terms: { field: 'chain.keyword', size: 10000 },
                  aggs: {
                    amounts: {
                      max: {
                        field: 'amount',
                      },
                    },
                  },
                },
              },
              query: { range: { 'created_at.ms': { gt: moment().subtract(24, 'hour').valueOf() } } },
            })
          }
        }

        const highest_transfer_24h = !(isInterval || !avgTransfersTimeRange) ? crosschainSummaryData?.highest_transfer_24h : _.orderBy(response?.data?.map(transfer => {
          return {
            ...transfer,
            name: chainName(idFromMaintainerId(transfer.chain?.toLowerCase())),
            image: chainImage(idFromMaintainerId(transfer.chain?.toLowerCase())),
            amount: transfer.amount / chainDenomDivider(idFromMaintainerId(transfer.chain?.toLowerCase())),
          }
        }), ['tx'], ['desc'])

        setCrosschainSummaryData({
          total_transfers,
          avg_transfers,
          highest_transfer_24h,
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(true), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data, avgTransfersTimeRange])

  useEffect(() => {
    if (!chainSelect && crosschainSummaryData?.total_transfers?.[0]?.chain) {
      setChainSelect(crosschainSummaryData.total_transfers[0].chain)
    }
  }, [crosschainSummaryData, chainSelect])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data && chainSelect) {
        const today = moment().utc().startOf('day')
        const daily_time_range = 30
        const day_ms = 24 * 60 * 60 * 1000

        let response

        if (!controller.signal.aborted) {
          response = await transfers({
            aggs: {
              transfers: {
                terms: { field: 'chain.keyword', size: 10000 },
                aggs: {
                  times: {
                    terms: { field: 'created_at.day', size: 10000 },
                    aggs: {
                      amounts: {
                        sum: {
                          field: 'amount',
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        const total_transfers = _.orderBy(response?.data?.map(transfer => {
          const times = []

          for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
            let timeData = transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 }

            timeData = { ...timeData, amount: timeData.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)) }

            times.push(timeData)
          }

          return {
            ...transfer,
            times,
            name: chainName(idFromMaintainerId(transfer.chain)),
            image: chainImage(idFromMaintainerId(transfer.chain)),
            amount: transfer.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)),
          }
        }), ['tx'], ['desc'])

        if (!controller.signal.aborted) {
          response = await transfers({
            aggs: {
              transfers: {
                terms: { field: 'chain.keyword', size: 10000 },
                aggs: {
                  times: {
                    terms: { field: 'created_at.day', size: 10000 },
                    aggs: {
                      amounts: {
                        max: {
                          field: 'amount',
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        const highest_transfer_24h = _.orderBy(response?.data?.map(transfer => {
          const times = []

          for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
            let timeData = transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 }

            timeData = { ...timeData, amount: timeData.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)) }

            times.push(timeData)
          }

          return {
            ...transfer,
            times,
            name: chainName(idFromMaintainerId(transfer.chain)),
            image: chainImage(idFromMaintainerId(transfer.chain)),
            amount: transfer.amount / chainDenomDivider(idFromMaintainerId(transfer.chain)),
          }
        }), ['tx'], ['desc'])

        setCrosschainChartData({
          total_transfers,
          highest_transfer_24h,
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data, chainSelect])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data) {
        const tvls_updated_at = moment().valueOf()

        let response

        if (!controller.signal.aborted) {
          setCrosschainTVLData({
            tvls: [],
            tvls_updated_at,
          })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  // useEffect(() => {
  //   const getData = async isInterval => {
  //     if (denoms_data && validators_data && (!loadValsProfile || isInterval)) {
  //       let tvls
  //       const tvls_updated_at = moment().valueOf()

  //       const _validators_data = validators_data.filter(validator_data => ['BOND_STATUS_BONDED'].includes(validator_data?.status))
  //       const total_active_validators = _validators_data.length

  //       for (let i = 0; i < _validators_data.length; i++) {
  //         const validator_data = _validators_data[i]
  //         const address = validator_data?.operator_address

  //         const response = await allDelegations(address)

  //         tvls = _.concat(tvls || [], Object.values(_.groupBy(response?.data?.map(delegation => {
  //           return {
  //             delegator_address: delegation?.delegation?.delegator_address,
  //             denom: denomSymbol(delegation?.balance?.denom, denoms_data),
  //             name: denomName(delegation?.balance?.denom, denoms_data),
  //             image: denomImage(delegation?.balance?.denom, denoms_data),
  //             amount: denomAmount(delegation?.balance?.amount, delegation?.balance?.denom, denoms_data),
  //           }
  //         }) || [], 'denom')).map(value => {
  //           return {
  //             ...value?.[0],
  //             delegator_addresses: _.uniqBy(value, 'delegator_address'),
  //             amount: _.sumBy(value, 'amount'),
  //           }
  //         }))

  //         if (!isInterval && (i % 3 === 0 || i === _validators_data.length - 1)) {
  //           setCrosschainTVLData({
  //             tvls: _.orderBy(Object.values(_.groupBy(tvls, 'denom')).map(value => {
  //               return {
  //                 ...value?.[0],
  //                 amount: _.sumBy(value, 'amount'),
  //                 num_delegators: _.uniq(value?.flatMap(delegate => delegate.delegator_addresses) || []).length,
  //               }
  //             }), ['num_delegators'], ['desc']),
  //             tvls_updated_at,
  //             total_loaded_validators: tvls.length,
  //             total_active_validators,
  //           })
  //         }
  //       }

  //       if (isInterval) {
  //         setCrosschainTVLData({
  //           tvls: (tvls && Object.values(_.groupBy(tvls, 'denom')).map(value => {
  //             return {
  //               ...value?.[0],
  //               amount: _.sumBy(value, 'amount'),
  //             }
  //           })) || [],
  //           tvls_updated_at,
  //           total_loaded_validators: tvls?.length || 0,
  //           total_active_validators,
  //         })
  //       }
  //     }
  //   }

  //   getData()

  //   const interval = setInterval(() => getData(true), 60 * 1000)
  //   return () => clearInterval(interval)
  // }, [denoms_data, validators_data, loadValsProfile])

  useEffect(() => {
    const controller = new AbortController()

    const getConsensusState = async () => {
      if (!controller.signal.aborted) {
        const response = await consensusState()

        if (response) {
          setConsensusStateData(response)
        }
      }
    }

    getConsensusState()

    const interval = setInterval(() => getConsensusState(), 5 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, null, null, denoms_data)

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data,
          })

          setLoadValsProfile(true)
        }
      }
    }

    if (denoms_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getValidatorsProfile = async () => {
      if (loadValsProfile && validators_data?.findIndex(validator_data => validator_data?.description && !validator_data.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const validator_data = data[i]

            if (validator_data?.description) {
              if (validator_data.description.identity && !validator_data.description.image) {
                const responseProfile = await validatorProfile({ key_suffix: validator_data.description.identity })

                if (responseProfile?.them?.[0]?.pictures?.primary?.url) {
                  validator_data.description.image = responseProfile.them[0].pictures.primary.url
                }
              }

              validator_data.description.image = validator_data.description.image || randImage(i)

              data[i] = validator_data
            }
          }
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: VALIDATORS_DATA,
            value: data,
          })
        }
      }
    }

    getValidatorsProfile()

    return () => {
      controller?.abort()
    }
  }, [loadValsProfile])

  useEffect(() => {
    const getData = async () => {
      if (denoms_data && consensusStateData?.validators?.proposer?.address) {
        const validator_data = validators_data?.find(validator_data => validator_data.consensus_address === hexToBech32(consensusStateData.validators.proposer.address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS))

        if (validator_data) {
          consensusStateData.operator_address = validator_data.operator_address
          
          if (validator_data.description) {
            consensusStateData.proposer_name = validator_data.description.moniker
            consensusStateData.proposer_image = validator_data.description.image
          }
        }

        consensusStateData.voting_power = consensusStateData.validators.proposer.voting_power

        if (chain_data?.staking_pool) {
          consensusStateData.voting_power_percentage = consensusStateData.voting_power * 100 / Math.floor(chain_data.staking_pool.bonded_tokens)
        }

        setSummaryData({
          latest_block: { ...consensusStateData },
          block_height: status_data && Number(status_data.latest_block_height),
          block_height_at: status_data && moment(status_data.latest_block_time).valueOf(),
          avg_block_time: status_data && moment(status_data.latest_block_time).diff(moment(status_data.earliest_block_time), 'seconds') / Number(status_data.latest_block_height),
          active_validators: validators_data?.filter(validator_data => ['BOND_STATUS_BONDED'].includes(validator_data.status)).length,
          total_validators: validators_data?.length,
          denom: denomSymbol(chain_data?.staking_params?.bond_denom, denoms_data),
          online_voting_power_now: chain_data?.staking_pool && numberFormat(Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00a'),
          online_voting_power_now_percentage: chain_data?.staking_pool && chain_data.bank_supply && (Math.floor(chain_data.staking_pool.bonded_tokens) * 100 / chain_data.bank_supply.amount),
          total_voting_power: chain_data?.bank_supply && numberFormat(chain_data.bank_supply.amount, '0,0.00a'),
        })
      }
    }

    getData()
  }, [denoms_data, chain_data, status_data, validators_data, consensusStateData])

  return (
    <div className="my-4 mx-auto pb-2">
      <Summary
        data={summaryData}
        crosschainData={crosschainSummaryData}
        tvlData={crosschainTVLData}
        avgTransfersTimeRange={avgTransfersTimeRange || 'all-time'}
        setAvgTransfersTimeRange={timeRange => setAvgTransfersTimeRange(timeRange)}
        chainSelect={chainSelect || crosschainSummaryData?.total_transfers?.[0]?.chain}
        setChainSelect={chain => setChainSelect(chain)}
        chartData={crosschainChartData}
      />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 mt-6 mb-4">
        <div className="mt-3">
          <Link href="/blocks">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Blocks</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <BlocksTable n={10} className="bg-white dark:bg-gray-900" />
          </Widget>
        </div>
        <div className="mt-8 md:mt-3">
          <Link href="/transactions">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Transactions</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <TransactionsTable location="index" className="bg-white dark:bg-gray-900" />
          </Widget>
        </div>
      </div>
    </div>
  )
}