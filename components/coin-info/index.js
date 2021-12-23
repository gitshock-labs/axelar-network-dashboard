import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { status as getStatus } from '../../lib/api/rpc'
import { stakingParams, stakingPool, bankSupply, communityPool, mintInflation, distributionParams } from '../../lib/api/cosmos'
import { simplePrice } from '../../lib/api/coingecko'
import { denomSymbol, denomAmount } from '../../lib/object/denom'
import { numberFormat, ellipseAddress } from '../../lib/utils'

import { STATUS_DATA, CHAIN_DATA } from '../../reducers/types'

const CURRENCY = 'usd'
const CURRENCY_SYMBOL = '$'

export default function CoinInfo() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data } = { ...data }

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

    return () => {
      controller?.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data) {
        let chainData, response

        if (!controller.signal.aborted) {
          response = await stakingParams()

          if (response?.params) {
            chainData = { ...chainData, staking_params: response.params }
          }
        }

        if (!controller.signal.aborted) {
          response = await stakingPool()

          if (response?.pool) {
            chainData = { ...chainData, staking_pool: Object.fromEntries(Object.entries(response.pool).map(([key, value]) => [key, isNaN(value) ? value : Number(value) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)])) }
          }
        }

        if (!controller.signal.aborted) {
          if (chainData?.staking_params?.bond_denom) {
            response = await bankSupply(chainData.staking_params.bond_denom)

            if (response?.amount) {
              chainData = { ...chainData, bank_supply: Object.fromEntries(Object.entries(response.amount).map(([key, value]) => [key, key === 'denom' ? denomSymbol(value, denoms_data) : denomAmount(value, response.amount.denom, denoms_data)])) }
            }
          }
        }

        if (!controller.signal.aborted) {
          response = await communityPool()

          if (response?.pool) {
            chainData = { ...chainData, community_pool: response.pool.map(pool => Object.fromEntries(Object.entries(pool).map(([key, value]) => [key, key === 'denom' ? denomSymbol(value, denoms_data) : denomAmount(value, pool.denom, denoms_data)]))) }
          }
        }

        if (!controller.signal.aborted) {
          response = await mintInflation()

          if (response?.inflation) {
            chainData = { ...chainData, inflation: Number(response.inflation) }
          }
        }

        if (!controller.signal.aborted) {
          response = await distributionParams()

          if (response?.params) {
            chainData = { ...chainData, distribution_params: response.params }
          }
        }

        if (!controller.signal.aborted) {
          response = await simplePrice({ ids: process.env.NEXT_PUBLIC_COINGECKO_ID, vs_currencies: CURRENCY, include_market_cap: true, include_24hr_vol: true, include_24hr_change: true, include_last_updated_at: true })

          if (response?.[process.env.NEXT_PUBLIC_COINGECKO_ID]) {
            chainData = { ...chainData, coin: response[process.env.NEXT_PUBLIC_COINGECKO_ID] }
          }
        }

        if (chainData) {
          dispatch({
            type: CHAIN_DATA,
            value: chainData,
          })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  return (
    <div className="w-full bg-gray-100 dark:bg-black rounded grid grid-flow-row grid-cols-2 sm:flex items-start text-2xs lg:text-xs gap-3 sm:gap-4 lg:gap-6 mt-0 sm:mt-auto mb-4 sm:mb-auto ml-0 sm:ml-2 py-3 px-4">
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Price</span>
        <span className="text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            chain_data.coin ?
              <>{CURRENCY_SYMBOL}{numberFormat(chain_data.coin[CURRENCY], '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Market Cap</span>
        <span className="uppoercase text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            chain_data.coin ?
              <>{CURRENCY_SYMBOL}{numberFormat(chain_data.coin[`${CURRENCY}_market_cap`], '0,0.00a')}</>
              :
              '-'
            :
            <div className="skeleton w-20 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Inflation</span>
        <span className="text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            typeof chain_data.inflation === 'number' ?
              <>{numberFormat(chain_data.inflation * 100, '0,0.00')}%</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Proposer Reward</span>
        <span className="text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            !isNaN(chain_data.distribution_params?.base_proposer_reward) ?
              <div className="whitespace-nowrap">
                <span className="mr-1">
                  {numberFormat(Number(chain_data.distribution_params.base_proposer_reward) * 100, '0,0.00')}%
                </span>
                {!isNaN(chain_data.distribution_params?.bonus_proposer_reward) && (
                  <span>
                    (+{numberFormat(Number(chain_data.distribution_params.bonus_proposer_reward) * 100, '0,0.00')}% Bonus)
                  </span>
                )}
              </div>
              :
              '-'
            :
            <div className="skeleton w-16 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Community Tax</span>
        <span className="text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            !isNaN(chain_data.distribution_params?.community_tax) ?
              <>{numberFormat(Number(chain_data.distribution_params.community_tax) * 100, '0,0.00')}%</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Community Pool</span>
        <span className="text-gray-900 dark:text-gray-100 font-light">
          {chain_data ?
            chain_data.community_pool ?
              <div className="space-x-2">
                {chain_data.community_pool.map((pool, i) => (
                  <span key={i} className="space-x-1">
                    <span>{numberFormat(pool.amount, '0,0.00000000')}</span>
                    <span className="uppercase font-medium">{ellipseAddress(pool.denom)}</span>
                  </span>
                ))}
              </div>
              :
              '-'
            :
            <div className="skeleton w-20 h-4" />
          }
        </span>
      </div>
    </div>
  )
}