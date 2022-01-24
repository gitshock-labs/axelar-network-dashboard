import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import { FiMoon, FiSun } from 'react-icons/fi'

import Logo from './logo'
import DropdownNavigation from './navigation/dropdown'
import Navigation from './navigation'
import Search from './search'
import Network from './network'
import SubNavbar from './sub-navbar'
import PageTitle from './page-title'

import { chains, cosmosChains, assets } from '../../lib/api/crosschain_config'
import { denoms as getDenoms } from '../../lib/api/query'
import { status } from '../../lib/api/rpc'
import { stakingParams, stakingPool, bankSupply, slashingParams, distributionParams, mintInflation, communityPool, allValidators, validatorProfile } from '../../lib/api/cosmos'
import { simplePrice } from '../../lib/api/coingecko'
import { currency } from '../../lib/object/currency'
import { denomer } from '../../lib/object/denom'

import { THEME, CHAINS_DATA, COSMOS_CHAINS_DATA, ASSETS_DATA, DENOMS_DATA, STATUS_DATA, ENV_DATA, VALIDATORS_DATA } from '../../reducers/types'

export default function Navbar() {
  const dispatch = useDispatch()
  const { preferences, denoms, validators } = useSelector(state => ({ preferences: state.preferences, denoms: state.denoms, validators: state.validators }), shallowEqual)
  const { theme } = { ...preferences }
  const { denoms_data } = { ...denoms }
  const { validators_data } = { ...validators }

  const router = useRouter()
  const { pathname, query } = { ...router }

  const [loadProfileTrigger, setLoadProfileTrigger] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await chains()

      dispatch({
        type: CHAINS_DATA,
        value: response || [],
      })
    }

    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await cosmosChains()

      dispatch({
        type: COSMOS_CHAINS_DATA,
        value: response || [],
      })
    }

    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await assets()

      dispatch({
        type: ASSETS_DATA,
        value: response || [],
      })
    }

    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await getDenoms()

      dispatch({
        type: DENOMS_DATA,
        value: response || [],
      })

      if (response) {
        for (let i = 0; i < response.length; i++) {
          const denom = response[i]

          const resPrice = await simplePrice({
            ids: denom.coingecko_id,
            vs_currencies: currency,
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
            include_last_updated_at: true,
          })

          if (resPrice?.[denom.coingecko_id]) {
            denom.token_data = resPrice[denom.coingecko_id]
          }

          response[i] = denom

          if (denom.id === 'uaxl') {
            dispatch({
              type: ENV_DATA,
              value: { token_data: { ...denom.token_data } },
            })
          }
        }

        dispatch({
          type: DENOMS_DATA,
          value: response,
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await status()

      dispatch({
        type: STATUS_DATA,
        value: response,
      })
    }

    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      if (denoms_data) {
        let response

        response = await stakingParams()

        dispatch({
          type: ENV_DATA,
          value: { staking_params: response?.params || {} },
        })

        if (response?.params?.bond_denom) {
          response = await bankSupply(response.params.bond_denom)

          dispatch({
            type: ENV_DATA,
            value: {
              bank_supply: Object.fromEntries(Object.entries(response?.amount || {}).map(([key, value]) => {
                return [key, key === 'denom' ? denomer.symbol(value, denoms_data) : denomer.amount(value, response.amount.denom, denoms_data)]
              })),
            },
          })
        }

        response = await stakingPool()

        dispatch({
          type: ENV_DATA,
          value: {
            staking_pool: Object.fromEntries(Object.entries(response?.pool || {}).map(([key, value]) => {
              return [denomer.symbol(key, denoms_data), denomer.amount(key, value, denoms_data)]
            })),
          },
        })

        const res = await fetch(process.env.NEXT_PUBLIC_NETWORK_RELEASES_URL)
        response = await res.text()

        if (response?.includes('`axelar-core` version')) {
          response = response.split('\n').filter(line => line?.includes('`axelar-core` version'))

          dispatch({
            type: ENV_DATA,
            value: { ...Object.fromEntries([_.head(response).split('|').map(s => s?.trim().split('`').join('').split(' ').join('_'))]) },
          })
        }
        else {
          dispatch({
            type: ENV_DATA,
            value: { 'axelar-core_version': '-' },
          })
        }

        response = await slashingParams()

        dispatch({
          type: ENV_DATA,
          value: { slashing_params: response?.params || {} },
        })

        response = await distributionParams()

        dispatch({
          type: ENV_DATA,
          value: { distribution_params: response?.params || {} },
        })

        response = await mintInflation()

        dispatch({
          type: ENV_DATA,
          value: { inflation: Number(response?.inflation || 0) },
        })

        response = await communityPool()

        dispatch({
          type: ENV_DATA,
          value: {
            community_pool: response?.pool?.map(_pool => {
              return Object.fromEntries(Object.entries(_pool || {}).map(([key, value]) => {
                return [key, key === 'denom' ? denomer.symbol(value, denoms_data) : denomer.amount(value, _pool.denom, denoms_data)]
              }))
            }) || [],
          },
        })
      }
    }

    getData()
  }, [denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data) {
        if (!controller.signal.aborted) {
          const response = await allValidators(null, validators_data, null, null, null, denoms_data)

          dispatch({
            type: VALIDATORS_DATA,
            value: response?.data || [],
          })

          setLoadProfileTrigger(moment().valueOf())
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data, pathname])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (loadProfileTrigger && validators_data?.findIndex(v => v?.description && !v.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const v = data[i]

            let updated = false

            if (v?.description) {
              if (v.description.identity && !v.description.image) {
                const responseProfile = await validatorProfile({ key_suffix: v.description.identity })

                if (responseProfile?.them?.[0]?.pictures?.primary?.url) {
                  v.description.image = responseProfile.them[0].pictures.primary?.url

                  updated = true
                }
              }

              v.description.image = v.description.image || randImage(i)

              data[i] = v
            
              if (updated) {
                dispatch({
                  type: VALIDATORS_DATA,
                  value: data,
                })
              }
            }
          }
        }
      }
    }

    getData()

    return () => {
      controller?.abort()
    }
  }, [loadProfileTrigger])

  return (
    <>
      <div className="navbar border-b">
        <div className="navbar-inner w-full flex items-center">
          <Logo />
          <DropdownNavigation />
          <Navigation />
          <div className="flex items-center ml-auto">
            <Search />
            <Network />
            <button
              onClick={() => {
                dispatch({
                  type: THEME,
                  value: theme === 'light' ? 'dark' : 'light',
                })
              }}
              className="w-10 sm:w-12 h-16 btn-transparent flex items-center justify-center"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {theme === 'light' ? (
                  <FiMoon size={16} />
                ) : (
                  <FiSun size={16} />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      <SubNavbar />
      <PageTitle />
    </>
  )
}