import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import { providers, constants, Contract } from 'ethers'
import BigNumber from 'bignumber.js'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { consensusState } from '../../lib/api/rpc'
import { crosschainTxs } from '../../lib/api/opensearch'
import { hexToBech32 } from '../../lib/object/key'
import { getDenom, denomer } from '../../lib/object/denom'
import { getChain } from '../../lib/object/chain'
import { currency } from '../../lib/object/currency'
import { numberFormat } from '../../lib/utils'

import { TVL_DATA } from '../../reducers/types'

BigNumber.config({ DECIMAL_PLACES: Number(process.env.NEXT_PUBLIC_MAX_BIGNUMBER_EXPONENTIAL_AT), EXPONENTIAL_AT: [-7, Number(process.env.NEXT_PUBLIC_MAX_BIGNUMBER_EXPONENTIAL_AT)] })

export default function Dashboard() {
  const dispatch = useDispatch()
  const { chains, cosmos_chains, assets, denoms, tvl, status, env, validators } = useSelector(state => ({ chains: state.chains, cosmos_chains: state.cosmos_chains, assets: state.assets, denoms: state.denoms, tvl: state.tvl, status: state.status, env: state.env, validators: state.validators }), shallowEqual)
  const { chains_data } = { ...chains }
  const { cosmos_chains_data } = { ...cosmos_chains }
  const { assets_data } = { ...assets }
  const { denoms_data } = { ...denoms }
  const { tvl_data } = { ...tvl }
  const { status_data } = { ...status }
  const { env_data } = { ...env }
  const { validators_data } = { ...validators }

  const [consensusStateData, setConsensusStateData] = useState(null)
  const [summaryData, setSummaryData] = useState(null)

  const [crosschainSummaryData, setCrosschainSummaryData] = useState(null)
  const [crosschainTVLData, setCrosschainTVLData] = useState(null)

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

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (chains_data && cosmos_chains_data && denoms_data) {
        let response

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

        const total_transfers = _.orderBy(response?.data?.map(t => {
          const asset = getDenom(t?.asset, denoms_data)

          return {
            ...t,
            from_chain: getChain(t?.from_chain, chains_data) || getChain(t?.from_chain, cosmos_chains_data),
            to_chain: getChain(t?.to_chain, chains_data) || getChain(t?.to_chain, cosmos_chains_data),
            asset,
            amount: denomer.amount(t?.amount, asset?.id, denoms_data),
            avg_amount: denomer.amount(t?.avg_amount, asset?.id, denoms_data),
          }
        }).map(t => {
          const price = t?.asset?.token_data?.[currency] || 0

          return {
            ...t,
            value: (price * t.amount) || 0,
            avg_value: (price * t.avg_amount) || 0,
          }
        }), ['tx'], ['desc'])

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
                          max_amounts: {
                            max: {
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
            query: { range: { 'send.created_at.ms': { gt: moment().subtract(24, 'hours').valueOf() } } },
          })
        }

        const highest_transfer_24h = _.orderBy(response?.data?.map(t => {
          const asset = getDenom(t?.asset, denoms_data)

          return {
            ...t,
            from_chain: getChain(t?.from_chain, chains_data) || getChain(t?.from_chain, cosmos_chains_data),
            to_chain: getChain(t?.to_chain, chains_data) || getChain(t?.to_chain, cosmos_chains_data),
            asset,
            max_amount: denomer.amount(t?.max_amount, asset?.id, denoms_data),
          }
        }).map(t => {
          const price = t?.asset?.token_data?.[currency] || 0

          return {
            ...t,
            max_value: (price * t.max_amount) || 0,
          }
        }), ['max_value', 'max_amount'], ['desc', 'desc'])

        setCrosschainSummaryData({
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
  }, [chains_data, cosmos_chains_data, denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getContractSupply = async (chain, contract) => {
      let supply

      if (chain && contract) {
        const provider_urls = chain.provider_params?.[0]?.rpcUrls?.filter(rpc => rpc && !rpc.startsWith('wss://') && !rpc.startsWith('ws://')).map(rpc => new providers.JsonRpcProvider(rpc)) || []
        const provider = new providers.FallbackProvider(provider_urls)

        const _contract = new Contract(contract.contract_address, ['function totalSupply() view returns (uint256)'], provider)
        supply = await _contract.totalSupply()
      }

      return supply && BigNumber(supply.toString()).shiftedBy(-contract.contract_decimals).toNumber()
    }

    const getData = async (chain, assets) => {
      if (!controller.signal.aborted) {
        if (assets) {
          for (let i = 0; i < assets.length; i++) {

            const contract = assets[i]?.contracts?.find(contract => contract?.chain_id === chain.chain_id)

            if (contract) {
              const supply = await getContractSupply(chain, contract)

              dispatch({
                type: TVL_DATA,
                value: { [`${chain.id}_${contract.contract_address}`]: supply },
              })
            }
          }
        }
      }
    }

    const getTVLData = () => {
      if (chains_data && assets_data) {
        chains_data.forEach(c => getData(c, assets_data))
      }
    }

    getTVLData()

    const interval = setInterval(() => getTVLData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [chains_data, assets_data])

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
    <div className="sm:mb-4 mx-auto pb-2">
      <Summary
        data={summaryData}
        crosschainData={crosschainSummaryData}
        tvlData={crosschainTVLData}
      />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 my-0 md:my-4">
        <div className="mt-8 md:mt-4">
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
        <div className="mt-8 md:mt-4">
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