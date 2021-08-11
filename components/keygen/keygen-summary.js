import PropTypes from 'prop-types'

import Widget from '../widget'

import { numberFormat } from '../../lib/utils'

const KeygenSummary = ({ data }) => {
  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2 md:my-4">
      <Widget
        title="Keygen Participation Threshold"
        description={<span className="text-2xl">
          {data ?
            numberFormat(data.keygen_participation_threshold, '0,0.00')
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </span>}
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      />
      <Widget
        title="Active Keygen Threshold"
        description={<span className="text-2xl">
          {data ?
            numberFormat(data.active_keygen_threshold, '0,0.00')
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </span>}
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      />
      <Widget
        title="Signing Participation Threshold"
        description={<span className="text-2xl">
          {data ?
            numberFormat(data.signing_participation_threshold, '0,0.00')
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </span>}
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      />
      <Widget
        title="Corruption Signing Threshold"
        description={<span className="text-2xl">
          {data ?
            numberFormat(data.corruption_signing_threshold, '0,0.00')
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </span>}
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      />
    </div>
  )
}

KeygenSummary.propTypes = {
  coinData: PropTypes.any,
}

export default KeygenSummary