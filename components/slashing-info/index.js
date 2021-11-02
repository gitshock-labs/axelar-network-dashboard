import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { slashingParams } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

import { SLASHING_DATA } from '../../reducers/types'

export default function SlashingInfo() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { slashing_data } = { ...data }

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let slashingData, response

      if (!controller.signal.aborted) {
        response = await slashingParams()

        if (response?.params) {
          slashingData = { ...slashingData, ...response.params }
        }
      }

      if (slashingData) {
        dispatch({
          type: SLASHING_DATA,
          value: slashingData,
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded grid grid-flow-row grid-cols-2 sm:flex items-start text-2xs lg:text-xs gap-3 sm:gap-4 lg:gap-6 mt-0 sm:mt-auto mb-4 sm:mb-auto ml-0 sm:ml-2 py-3 px-4">
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Signed Blocks Window</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data.signed_blocks_window ?
              <>{numberFormat(slashing_data.signed_blocks_window, '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Min Signed / Window</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data.min_signed_per_window ?
              <>{numberFormat(slashing_data.min_signed_per_window, '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Slash Fraction Double Sign</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data.slash_fraction_double_sign ?
              <>{numberFormat(slashing_data.slash_fraction_double_sign, '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Slash Fraction Downtime</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data.slash_fraction_downtime ?
              <>{numberFormat(slashing_data.slash_fraction_downtime, '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
      <div className="flex flex-col space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Downtime Jail Duration</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data.downtime_jail_duration ?
              <>{slashing_data.downtime_jail_duration}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4" />
          }
        </span>
      </div>
    </div>
  )
}