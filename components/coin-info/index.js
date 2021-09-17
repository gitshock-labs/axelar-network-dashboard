import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { stakingParams, stakingPool, bankSupply, communityPool, mintInflation } from '../../lib/api/cosmos'
import { simplePrice } from '../../lib/api/coingecko'
import { numberFormat } from '../../lib/utils'

import { CHAIN_DATA } from '../../reducers/types'

const CURRENCY = 'usd'
const CURRENCY_SYMBOL = '$'

export default function CoinInfo() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { chain_data } = { ...data }

  useEffect(() => {
    const getData = async () => {
      let chainData

      let response = await stakingParams()

      if (response && response.params) {
        chainData = { ...chainData, staking_params: response.params }
      }

      response = await stakingPool()

      if (response && response.pool) {
        chainData = { ...chainData, staking_pool: Object.fromEntries(Object.entries(response.pool).map(([key, value]) => [key, isNaN(value) ? value : Number(value) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)])) }
      }

      if (chainData && chainData.staking_params && chainData.staking_params.bond_denom) {
        response = await bankSupply(chainData.staking_params.bond_denom)

        if (response && response.amount) {
          chainData = { ...chainData, bank_supply: Object.fromEntries(Object.entries(response.amount).map(([key, value]) => [key, isNaN(value) ? key === 'denom' && value.startsWith('u') ? value.substring(1) : value : Number(value) / Math.pow(10, response.amount.denom && response.amount.denom.startsWith('u') ? 6 : 0)])) }
        }
      }

      response = await communityPool()

      if (response && response.pool) {
        chainData = { ...chainData, community_pool: response.pool.map(pool => Object.fromEntries(Object.entries(pool).map(([key, value]) => [key, isNaN(value) ? key === 'denom' && value.startsWith('u') ? value.substring(1) : value : Number(value) / Math.pow(10, pool.denom && pool.denom.startsWith('u') ? 6 : 0)]))) }
      }

      response = await mintInflation()

      if (response && response.inflation) {
        chainData = { ...chainData, inflation: Number(response.inflation) }
      }

      response = await simplePrice({ ids: process.env.NEXT_PUBLIC_COINGECKO_ID, vs_currencies: CURRENCY, include_market_cap: true, include_24hr_vol: true, include_24hr_change: true, include_last_updated_at: true })

      if (response && response[process.env.NEXT_PUBLIC_COINGECKO_ID]) {
        chainData = { ...chainData, coin: response[process.env.NEXT_PUBLIC_COINGECKO_ID] }
      }

      if (chainData) {
        dispatch({
          type: CHAIN_DATA,
          value: chainData
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 rounded grid grid-flow-row grid-cols-2 sm:flex items-center gap-2 sm:gap-8 lg:gap-6 mt-2 sm:mt-auto py-3 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Price:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {chain_data ?
            chain_data.coin ?
              <>{CURRENCY_SYMBOL}{numberFormat(chain_data.coin[CURRENCY], '0,0.00000000')}</>
              :
              'N/A'
            :
            <div className="skeleton w-8 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Market Cap:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {chain_data ?
            chain_data.coin ?
              <>{CURRENCY_SYMBOL}{numberFormat(chain_data.coin[`${CURRENCY}_market_cap`], '0,0')}</>
              :
              'N/A'
            :
            <div className="skeleton w-20 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Inflation:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {chain_data ?
            typeof chain_data.inflation === 'number' ?
              <>{numberFormat(chain_data.inflation * 100, '0,0.00')}%</>
              :
              'N/A'
            :
            <div className="skeleton w-8 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Community Pool:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {chain_data ?
            chain_data.community_pool ?
              <div className="space-x-2">
                {chain_data.community_pool.map((pool, i) => (
                  <span key={i} className="space-x-1">
                    <span>{numberFormat(pool.amount, '0,0.00')}</span>
                    <span className="uppercase font-medium">{pool.denom}</span>
                  </span>
                ))}
              </div>
              :
              '-'
            :
            <div className="skeleton w-20 h-3" />
          }
        </span>
      </div>
    </div>
  )
}