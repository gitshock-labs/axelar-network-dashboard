import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

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

      if (!controller.signal.aborted) {
        const res = await fetch(process.env.NEXT_PUBLIC_NETWORK_RELEASES_URL)
        response = await res.text()

        if (response?.includes('`axelar-core` version')) {
          response = response.split('\n').filter(line => line?.includes('`axelar-core` version'))

          slashingData = { ...slashingData, ...Object.fromEntries([_.head(response).split('|').map(s => s?.trim().split('`').join('').split(' ').join('_'))]) }
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
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Max Missed</span>
        <span className="text-gray-900 dark:text-gray-300 text-xs font-light">
          {slashing_data ?
            slashing_data.signed_blocks_window && slashing_data.min_signed_per_window ?
              <div className="space-x-1">
                <span className="whitespace-nowrap">{numberFormat(slashing_data.signed_blocks_window, '0,0.00000000')} - ({numberFormat(slashing_data.min_signed_per_window, '0,0.00000000')} * {numberFormat(slashing_data.signed_blocks_window, '0,0.00000000')})</span>
                <span>=</span>
                <span>{numberFormat(Number(slashing_data.signed_blocks_window) - (Number(slashing_data.min_signed_per_window) * Number(slashing_data.signed_blocks_window)), '0,0.00000000')}</span>
              </div>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Slash Fraction Downtime / Double Sign</span>
        <span className="text-gray-900 dark:text-gray-300 text-xs font-light">
          {slashing_data ?
            slashing_data.slash_fraction_downtime ?
              <>{numberFormat(slashing_data.slash_fraction_downtime, '0,0.00000000')} / {numberFormat(slashing_data.slash_fraction_double_sign, '0,0.00000000')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Downtime Jail Duration</span>
        <span className="text-gray-900 dark:text-gray-300 text-xs font-light">
          {slashing_data ?
            slashing_data.downtime_jail_duration ?
              <>{slashing_data.downtime_jail_duration}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Axelar Core Version</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {slashing_data ?
            slashing_data[`axelar-core_version`] ?
              <>{slashing_data[`axelar-core_version`]}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
    </div>
  )
}