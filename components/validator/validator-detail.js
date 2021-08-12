import moment from 'moment'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function ValidatorDetail({ data }) {
  return (
    <Widget
      title={data ?
        <div className="flex items-start text-gray-900 dark:text-gray-100 space-x-2 mb-6">
          <img
            src={data.image}
            alt=""
            className="w-6 md:w-10 h-6 md:h-10 rounded-full"
          />
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-semibold">{data.name || data.key}</span>
              <span className={`${data.status === 'active' ? 'bg-green-600 text-white' : data.status === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} rounded capitalize font-semibold px-2 py-1`}>
                {data.status}
              </span>
              {data.deregistering_state && (
                <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-2 py-1">
                  {data.deregistering_state}
                </span>
              )}
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Validator Key:</span>
              <span className="flex items-center space-x-1">
                <span className="font-light">{ellipseAddress(data.key)}</span>
                <Copy text={data.key} />
              </span>
            </div>
            {data.website && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">Website:</span>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-light">{data.website}</a>
              </div>
            )}
            {data.start_at && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">First Seen:</span>
                <div className="flex flex-wrap items-start">
                  <span className="text-gray-400 dark:text-gray-400 mr-2">{moment(data.start_at).fromNow()}</span>
                  <span className="text-gray-500 dark:text-gray-300 font-medium">({moment(data.start_at).format('MMM D, YYYY h:mm:ss A')})</span>
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className="flex items-start space-x-2 mb-7">
          <div className="skeleton w-6 md:w-10 h-6 md:h-10 rounded-full" />
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-32 h-5 my-2" />
            <div className="skeleton w-60 h-4" />
            <div className="skeleton w-40 h-4" />
            <div className="skeleton w-48 h-4" />
          </div>
        </div>
      }
      description={<span className="text-gray-900 dark:text-white text-lg font-semibold">Service Quality</span>}
    >
      {data ?
        <>
          <div className="flex flex-col space-y-1 text-base mt-2">
            <div className="flex items-start space-x-2">
              <span className="font-medium">Commission:</span>
              <span className="font-light">{numberFormat(data.commission_percenteage, '0,0.00')}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Success rate:</span>
              <span className="font-light">{numberFormat(data.success_rate_percentage, '0,0.00')}%</span>
              <span className="font-light">({numberFormat(100 - data.success_rate_percentage, '0,0.00')}% missed)</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1 text-base mt-4">
            <div className="flex items-start space-x-2">
              <span className="font-medium">Validator pool share:</span>
              <span className="font-light">{numberFormat(data.validator_pool_share_percentage, '0,0.00')}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Network share:</span>
              <span className="font-light">{numberFormat(data.network_share_percentage, '0,0.00')}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Delegations:</span>
              <span className="font-light">{numberFormat(data.delegations, '0,0')}</span>
            </div>
          </div>
        </>
        :
        <>
          <div className="flex flex-col space-y-3 mt-4">
            <div className="skeleton w-48 h-4" />
            <div className="skeleton w-60 h-4" />
          </div>
          <div className="flex flex-col space-y-3 mt-7">
            <div className="skeleton w-60 h-4" />
            <div className="skeleton w-48 h-4" />
            <div className="skeleton w-40 h-4" />
          </div>
        </>
      }
    </Widget>
  )
}