import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

import Widget from '../widget'

import { getName, numberFormat } from '../../lib/utils'

export default function CosmosGeneric({ data, health, jailed }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { status_data } = { ..._data }

  const numMissedBlocks = typeof data?.uptime === 'number' && data?.start_height && status_data?.latest_block_height && (
    (Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) * (1 - data.uptime / 100))
    -
    (Number(status_data.latest_block_height) - data.start_height > Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) ?
      0
      :
      Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) - (Number(status_data.latest_block_height) - data.start_height)
    )
  )

  const numBlocksBeforeProxyRegistered = data && 'tss_illegibility_info' in data && health ? health.broadcaster_registration ? typeof data?.start_proxy_height === 'number' && typeof data?.start_height === 'number' ? data.start_proxy_height >= data.start_height ? data.start_proxy_height - data.start_height : 0 : '-' : 'No Proxy' : null

  return (
    <Widget
      title={<span className="text-lg font-medium">Cosmos Generic</span>}
      right={<span className="whitespace-nowrap text-gray-400 dark:text-gray-600">Last {numberFormat(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS, '0,0')} Blocks</span>}
      className="min-h-full"
    >
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${data ? 'my-3' : 'my-4'}`}>
        {typeof data?.uptime === 'number' ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Uptime</span>
            <span className="text-gray-500 dark:text-gray-400">
              {numberFormat(data.uptime, '0,0.00')}%
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {typeof numMissedBlocks === 'number' ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold"># Missed Blocks</span>
            <span className="text-gray-500 dark:text-gray-400">
              {numberFormat(numMissedBlocks, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {jailed ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold"># Times Jailed</span>
            <span className="text-gray-500 dark:text-gray-400">
              {typeof jailed.times_jailed === 'number' ?
                jailed.times_jailed > 0 ?
                  numberFormat(jailed.times_jailed, '0,0')
                  :
                  jailed.times_jailed < 0 ?
                    'Long Time Jailed'
                    :
                    'Never Jailed'
                :
                '-'
              }
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {jailed ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Avg. Jail Response Time</span>
            <span className="capitalize text-gray-500 dark:text-gray-400">
              {typeof jailed.avg_jail_response_time === 'number' ?
                jailed.times_jailed > 0 ?
                  jailed.avg_jail_response_time < 0 ?
                    'Never Unjailed'
                    :
                    moment(jailed.avg_jail_response_time).diff(moment(0), 'seconds') < 60 ?
                      `${moment(jailed.avg_jail_response_time).diff(moment(0), 'seconds')} sec`
                      :
                      moment(jailed.avg_jail_response_time).diff(moment(0), 'minutes') < 60 ?
                        `${moment(jailed.avg_jail_response_time).diff(moment(0), 'minutes')} min`
                        :
                        `${moment(jailed.avg_jail_response_time).diff(moment(0), 'hours')} hrs`
                  :
                  'Never Jailed'
                :
                '-'
              }
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {numBlocksBeforeProxyRegistered || typeof numBlocksBeforeProxyRegistered === 'number' ?
          <div className="sm:col-span-2 flex flex-col space-y-1">
            <span className="font-semibold"># Blocks Before Proxy Registered</span>
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{typeof numBlocksBeforeProxyRegistered === 'number' ? numberFormat(numBlocksBeforeProxyRegistered, '0,0') : numBlocksBeforeProxyRegistered}</span>
              {typeof numBlocksBeforeProxyRegistered === 'number' && (
                <span>(Register-proxy Block: {numberFormat(data.start_proxy_height, '0,0')})</span>
              )}
            </span>
          </div>
          :
          <div className="sm:col-span-2 flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
      </div>
      <div className="text-gray-500 text-lg font-medium">Health Check</div>
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${health ? 'my-3' : 'my-4'}`}>
        {data && 'tss_illegibility_info' in data && health ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Broadcaster Registration</span>
            <span className="text-gray-500 dark:text-gray-400">
              {typeof health.broadcaster_registration === 'boolean' ?
                <div className="flex items-center space-x-1.5">
                  {health.broadcaster_registration ?
                    <FaCheckCircle size={18} className="text-green-500" />
                    :
                    <FaTimesCircle size={18} className="text-red-500" />
                  }
                  <span className="capitalize">{getName(health.broadcaster_registration ? 'proxy_registered' : 'no_proxy_registered')}</span>
                </div>
                :
                '-'
              }
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {health ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Broadcaster Funded</span>
            <span className="text-gray-500 dark:text-gray-400">
              {health.broadcaster_funded ? health.broadcaster_funded : '-'}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {health ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold"># Missed Heartbeats</span>
            <span className="text-gray-500 dark:text-gray-400">
              {typeof health.missed_heartbeats === 'number' ? numberFormat(health.missed_heartbeats, '0,0') : '-'}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
      </div>
    </Widget>
  )
}