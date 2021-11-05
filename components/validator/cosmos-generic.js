import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { denomSymbol } from '../../lib/object/denom'
import { numberFormat } from '../../lib/utils'

export default function CosmosGeneric({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { denoms_data, chain_data, status_data } = { ..._data }

  const numMissedBlocks = typeof data?.uptime === 'number' && data?.start_height && status_data?.latest_block_height && (
    (Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) * (1 - data.uptime / 100))
    -
    (Number(status_data.latest_block_height) - data.start_height > Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) ?
      0
      :
      Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) - (Number(status_data.latest_block_height) - data.start_height)
    )
  )

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
            <span className="text-gray-600 dark:text-gray-400">
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
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(numMissedBlocks, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold"># Times Jailed</span>
            <span className="text-gray-600 dark:text-gray-400">
              {typeof data.times_jailed === 'number' ? numberFormat(data.times_jailed, '0,0') : '-'}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Avg. Jail Response Time</span>
            <span className="text-gray-600 dark:text-gray-400">
              {typeof data.avg_jail_response_time === 'number' ? numberFormat(data.times_jailed, '0,0') : '-'}
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