import Link from 'next/link'

import PropTypes from 'prop-types'

import Widget from '../widget'

import { numberFormat } from '../../lib/utils'

const Summary = ({ data }) => {
  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      <div className="hidden lg:block" />
      <Widget
        title="Active Keygen Threshold"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          {data ?
            <span className="h-8 text-3xl font-semibold">{typeof data.active_keygen_threshold === 'number' && numberFormat(data.active_keygen_threshold, '0,0.00')}%</span>
            :
            <div className="skeleton w-24 h-7 mt-1" />
          }
          <span className="text-gray-400 dark:text-gray-600 text-sm font-light italic">(Mock Data)</span>
        </span>
      </Widget>
      <Widget
        title="Corruption Signing Threshold"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col item mt-1 space-y-1">
          {data ?
            <span className="h-8 text-3xl font-semibold">{typeof data.corruption_signing_threshold === 'number' && numberFormat(data.corruption_signing_threshold, '0,0.00')}%</span>
            :
            <div className="skeleton w-24 h-7 mt-1" />
          }
          <span className="text-gray-400 dark:text-gray-600 text-sm font-light italic">(Mock Data)</span>
        </span>
      </Widget>
    </div>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
}

export default Summary