import Link from 'next/link'

import PropTypes from 'prop-types'

import Widget from '../widget'

import { numberFormat } from '../../lib/utils'

const Summary = ({ data, keygens, failedKeygens, signAttempts }) => {
  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      <Widget
        title="Keygen Min Participation Requirement"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          {data ?
            <span className="h-8 text-3xl font-semibold">{typeof data.active_keygen_threshold === 'number' ? numberFormat(data.active_keygen_threshold, '0,0.00') : '-'}%</span>
            :
            <div className="skeleton w-24 h-7 mt-1" />
          }
        </span>
      </Widget>
      <Widget
        title="Sign Safety Threshold"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          
        </span>
      </Widget>
      <Widget
        title="Keygen Participation"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          <div className="flex flex-row space-x-1">
            {keygens ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(keygens.length, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
            <span className="h-8 text-3xl">/</span>
            {typeof failedKeygens === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(failedKeygens, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
          </div>
          <span className="text-gray-400 dark:text-gray-600 text-sm font-normal">Success / Failed</span>
        </span>
      </Widget>
      <Widget
        title="Sign Attempts"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          {typeof signAttempts === 'number' ?
            <span className="h-8 text-3xl font-semibold">{numberFormat(signAttempts, '0,0')}</span>
            :
            <div className="skeleton w-24 h-7 mt-1" />
          }
        </span>
      </Widget>
    </div>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
  keygens: PropTypes.any,
  failedKeygens: PropTypes.any,
  signAttempts: PropTypes.any,
}

export default Summary