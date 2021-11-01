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
import { denomName, denomAmount, denomSymbol, denomImage } from '../../lib/object/denom'
import { numberFormat, randImage } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA } from '../../reducers/types'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { chain_data, status_data, validators_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)
  const [crosschainSummaryData, setCrosschainSummaryData] = useState(null)
  const [avgTransfersTimeRange, setAvgTransfersTimeRange] = useState(null)
  const [crosschainTVLData, setCrosschainTVLData] = useState(null)
  const [contractSelect, setContractSelect] = useState(null)
  const [crosschainChartData, setCrosschainChartData] = useState(null)
  const [consensusStateData, setConsensusStateData] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const response = await getStatus()

      if (response) {
        dispatch({
          type: STATUS_DATA,
          value: response
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getData = async isInterval => {
      let response

      if (isInterval || !avgTransfersTimeRange) {
        response = await transfers({
          aggs: {
            transfers: {
              terms: { field: 'contract.name.keyword', size: 10000 },
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

      const total_transfers = !(isInterval || !avgTransfersTimeRange) ? crosschainSummaryData?.total_transfers : _.orderBy(response?.data?.map(transfer => {
        return {
          ...transfer,
          symbol: denomSymbol(transfer.contract_name),
          image: denomImage(transfer.contract_name),
          denom: denomName(transfer.contract_name),
          amount: denomAmount(transfer.amount, transfer.contract_name),
        }
      }), ['tx'], ['desc'])

      response = await transfers({
        aggs: {
          transfers: {
            terms: { field: 'contract.name.keyword', size: 10000 },
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

      const avg_transfers = _.orderBy(response?.data?.map(transfer => {
        return {
          ...transfer,
          symbol: denomSymbol(transfer.contract_name),
          image: denomImage(transfer.contract_name),
          denom: denomName(transfer.contract_name),
          amount: denomAmount(transfer.amount, transfer.contract_name),
        }
      }), ['tx'], ['desc'])

      if (isInterval || !avgTransfersTimeRange) {
        response = await transfers({
          aggs: {
            transfers: {
              terms: { field: 'contract.name.keyword', size: 10000 },
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

      const highest_transfer_24h = !(isInterval || !avgTransfersTimeRange) ? crosschainSummaryData?.highest_transfer_24h : _.orderBy(response?.data?.map(transfer => {
        return {
          ...transfer,
          symbol: denomSymbol(transfer.contract_name),
          image: denomImage(transfer.contract_name),
          denom: denomName(transfer.contract_name),
          amount: denomAmount(transfer.amount, transfer.contract_name),
        }
      }), ['tx'], ['desc'])

      setCrosschainSummaryData({
        total_transfers,
        avg_transfers,
        highest_transfer_24h,
      })

      if (!isInterval) {
        setContractSelect(total_transfers?.[0]?.contract_name)
      }
    }

    getData()

    const interval = setInterval(() => getData(true), 30 * 1000)
    return () => clearInterval(interval)
  }, [avgTransfersTimeRange])

  useEffect(() => {
    const getData = async () => {
      if (contractSelect) {
        const today = moment().utc().startOf('day')
        const daily_time_range = 30
        const day_ms = 24 * 60 * 60 * 1000

        let response

        response = await transfers({
          aggs: {
            transfers: {
              terms: { field: 'contract.name.keyword', size: 10000 },
              aggs: {
                times: {
                  terms: {
                    field: 'created_at.day',
                  },
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

        const total_transfers = _.orderBy(response?.data?.map(transfer => {
          const times = []

          for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
            times.push(transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 })
          }

          return {
            ...transfer,
            symbol: denomSymbol(transfer.contract_name),
            image: denomImage(transfer.contract_name),
            denom: denomName(transfer.contract_name),
            times: times.map(time => {
              return {
                ...time,
                amount: denomAmount(time.amount, transfer.contract_name),
              }
            }),
          }
        }), ['tx'], ['desc'])

        response = await transfers({
          aggs: {
            transfers: {
              terms: { field: 'contract.name.keyword', size: 10000 },
              aggs: {
                times: {
                  terms: {
                    field: 'created_at.day',
                  },
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

        const highest_transfer_24h = _.orderBy(response?.data?.map(transfer => {
          const times = []

          for (let time = moment(today).subtract(daily_time_range, 'days').valueOf(); time <= today.valueOf(); time += day_ms) {
            times.push(transfer.times?.find(_time => _time.time === time) || { time, tx: 0, amount: 0 })
          }

          return {
            ...transfer,
            symbol: denomSymbol(transfer.contract_name),
            image: denomImage(transfer.contract_name),
            denom: denomName(transfer.contract_name),
            times: times.map(time => {
              return {
                ...time,
                amount: denomAmount(time.amount, transfer.contract_name),
              }
            }),
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
    return () => clearInterval(interval)
  }, [contractSelect])

  useEffect(() => {
    const getData = async isInterval => {
      if (validators_data && (!loadValsProfile || isInterval)) {
        let tvls
        const tvls_updated_at = moment().valueOf()

        const _validators_data = validators_data.filter(validator_data => ['BOND_STATUS_BONDED'].includes(validator_data?.status))
        const total_active_validators = _validators_data.length

        for (let i = 0; i < _validators_data.length; i++) {
          const validator_data = _validators_data[i]
          const address = validator_data?.operator_address

          const response = await allDelegations(address)

          tvls = _.concat(tvls || [], Object.values(_.groupBy(response?.data?.map(delegation => {
            return {
              delegator_address: delegation?.delegation?.delegator_address,
              symbol: denomSymbol(delegation?.balance?.denom),
              image: denomImage(delegation?.balance?.denom),
              denom: denomName(delegation?.balance?.denom),
              amount: denomAmount(delegation?.balance?.amount, delegation?.balance?.denom),
            }
          }) || [], 'denom')).map(value => {
            return {
              ...value?.[0],
              delegator_addresses: _.uniqBy(value, 'delegator_address'),
              amount: _.sumBy(value, 'amount'),
            }
          }))

          if (!isInterval && (i % 3 === 0 || i === _validators_data.length - 1)) {
            setCrosschainTVLData({
              tvls: _.orderBy(Object.values(_.groupBy(tvls, 'denom')).map(value => {
                return {
                  ...value?.[0],
                  amount: _.sumBy(value, 'amount'),
                  num_delegators: _.uniq(value?.flatMap(delegate => delegate.delegator_addresses) || []).length,
                }
              }), ['num_delegators'], ['desc']),
              tvls_updated_at,
              total_loaded_validators: tvls.length,
              total_active_validators,
            })
          }
        }

        if (isInterval) {
          setCrosschainTVLData({
            tvls: (tvls && Object.values(_.groupBy(tvls, 'denom')).map(value => {
              return {
                ...value?.[0],
                amount: _.sumBy(value, 'amount'),
              }
            })) || [],
            tvls_updated_at,
            total_loaded_validators: tvls?.length || 0,
            total_active_validators,
          })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(true), 60 * 1000)
    return () => clearInterval(interval)
  }, [validators_data, loadValsProfile])

  useEffect(() => {
    const getConsensusState = async () => {
      const response = await consensusState()

      if (response) {
        setConsensusStateData(response)
      }
    }

    getConsensusState()

    const interval = setInterval(() => getConsensusState(), 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getValidators = async () => {
      const response = await allValidators({}, validators_data)

      if (response) {
        dispatch({
          type: VALIDATORS_DATA,
          value: response.data
        })

        setLoadValsProfile(true)
      }
    }

    getValidators()

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getValidatorsProfile = async () => {
      if (loadValsProfile && validators_data?.findIndex(validator_data => validator_data?.description && !validator_data.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
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

        dispatch({
          type: VALIDATORS_DATA,
          value: data
        })
      }
    }

    getValidatorsProfile()
  }, [loadValsProfile])

  useEffect(() => {
    const getData = async () => {
      if (consensusStateData?.validators?.proposer?.address) {
        const validator_data = validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.consensus_address === hexToBech32(consensusStateData.validators.proposer.address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS))]

        if (validator_data) {
          consensusStateData.operator_address = validator_data.operator_address
          
          if (validator_data.description) {
            consensusStateData.proposer_name = validator_data.description.moniker
            consensusStateData.proposer_image = validator_data.description.image
          }
        }

        consensusStateData.voting_power = consensusStateData.validators.proposer.voting_power

        if (chain_data && chain_data.staking_pool) {
          consensusStateData.voting_power_percentage = consensusStateData.voting_power * 100 / Math.floor(chain_data.staking_pool.bonded_tokens)
        }

        setSummaryData({
          latest_block: { ...consensusStateData },
          block_height: status_data && Number(status_data.latest_block_height),
          block_height_at: status_data && moment(status_data.latest_block_time).valueOf(),
          avg_block_time: status_data && moment(status_data.latest_block_time).diff(moment(status_data.earliest_block_time), 'seconds') / Number(status_data.latest_block_height),
          active_validators: validators_data && validators_data.filter(validator_data => ['BOND_STATUS_BONDED'].includes(validator_data.status)).length,
          total_validators: validators_data && validators_data.length,
          denom: chain_data && chain_data.staking_params && denomName(chain_data.staking_params.bond_denom),
          online_voting_power_now: chain_data && chain_data.staking_pool && numberFormat(Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00a'),
          online_voting_power_now_percentage: chain_data && chain_data.staking_pool && chain_data.bank_supply && (Math.floor(chain_data.staking_pool.bonded_tokens) * 100 / chain_data.bank_supply.amount),
          total_voting_power: chain_data && chain_data.bank_supply && numberFormat(chain_data.bank_supply.amount, '0,0.00a'),
        })
      }
    }

    getData()
  }, [chain_data, status_data, validators_data, consensusStateData])

  return (
    <div className="my-4 mx-auto pb-2">
      <Summary
        data={summaryData}
        crosschainData={crosschainSummaryData}
        avgTransfersTimeRange={avgTransfersTimeRange || 'all-time'}
        setAvgTransfersTimeRange={timeRange => setAvgTransfersTimeRange(timeRange)}
        tvlData={crosschainTVLData}
        contractSelect={contractSelect || crosschainSummaryData?.total_transfers?.[0]?.contract_name}
        setContractSelect={contract => setContractSelect(contract)}
        chartData={crosschainChartData}
      />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 my-4">
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
            <TransactionsTable page="index" className="bg-white dark:bg-gray-900" />
          </Widget>
        </div>
      </div>
    </div>
  )
}