import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { FiBox } from 'react-icons/fi'

import Widget from '../widget'

import { numberFormat, getName } from '../../lib/utils'

export default function HealthCheck({ data, health }) {
  const numBlocksBeforeProxyRegistered = data && 'tss_illegibility_info' in data && health ? health.broadcaster_registration ? typeof data?.start_proxy_height === 'number' && typeof data?.start_height === 'number' ? data.start_proxy_height >= data.start_height ? data.start_proxy_height - data.start_height : 0 : '-' : 'No Proxy' : null

  return (
    <Widget
      title={<span className="text-lg font-medium">Health Check</span>}
    >
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${health ? 'mt-3 mb-0.5' : 'mt-4 mb-1'}`}>
        <div className={`flex flex-col space-y-${data && 'tss_illegibility_info' in data && health ? 1 : 2}`}>
          <span className="font-semibold">Broadcaster Registration</span>
          {data && 'tss_illegibility_info' in data && health ?
            typeof health.broadcaster_registration === 'boolean' ?
              <span className={`max-w-min ${health.broadcaster_registration ? 'bg-green-400 dark:bg-green-600' : 'bg-red-400 dark:bg-red-600'} rounded-xl flex items-center text-white text-xs font-semibold space-x-1.5 px-2 py-1`}>
                {health.broadcaster_registration ?
                  <FaCheckCircle size={16} />
                  :
                  <FaTimesCircle size={16} />
                }
                <span className="whitespace-nowrap capitalize">{getName(health.broadcaster_registration ? 'proxy_registered' : 'no_proxy_registered')}</span>
              </span>
              :
              <span className="text-gray-500 dark:text-gray-400">-</span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${numBlocksBeforeProxyRegistered || typeof numBlocksBeforeProxyRegistered === 'number' ? 1 : 2}`}>
          <span className="flex items-center font-semibold">
            <span className="mr-1">#</span>
            <FiBox size={18} className="stroke-current mb-0.5 mr-1.5" />
            <span>Before Registered</span>
          </span>
          {numBlocksBeforeProxyRegistered || typeof numBlocksBeforeProxyRegistered === 'number' ?
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{typeof numBlocksBeforeProxyRegistered === 'number' ? numberFormat(numBlocksBeforeProxyRegistered, '0,0') : numBlocksBeforeProxyRegistered}</span>
              {typeof numBlocksBeforeProxyRegistered === 'number' && (
                <span>(Block: {numberFormat(data.start_proxy_height, '0,0')})</span>
              )}
            </span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${health ? 1 : 2}`}>
          <span className="font-semibold">Heartbeats Uptime</span>
          {health ?
            <div className="flex items-center space-x-1">
              <span className="text-gray-500 dark:text-gray-400">
                {typeof health.uptime === 'number' ? `${numberFormat(health.uptime, '0,0.00')}%` : '-'}
              </span>
              <span className="text-gray-500 text-sm font-light italic">(Mock Data)</span>
            </div>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${health ? 1 : 2}`}>
          <span className="font-semibold"># Missed Heartbeats</span>
          {health ?
            <div className="flex items-center space-x-1">
              <span className="text-gray-500 dark:text-gray-400">
                {typeof health.missed_heartbeats === 'number' ? numberFormat(health.missed_heartbeats, '0,0') : '-'}
              </span>
              <span className="text-gray-500 text-sm font-light italic">(Mock Data)</span>
            </div>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
      </div>
    </Widget>
  )
}