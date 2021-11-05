import Widget from '../widget'
import Copy from '../copy'

import { numberFormat } from '../../lib/utils'

export default function AxelarSpecific({ data, keygens, signs, chainsSupported, rewards }) {
  return (
    <Widget
      title={<span className="text-lg font-medium">Axelar Specific</span>}
      className="min-h-full"
    >
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${data ? 'my-3' : 'my-4'}`}>
        {keygens ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Keygen Participated</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(keygens.filter(_keygen => _keygen?.participated).length, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {keygens ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Keygen Not Participated</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(keygens.filter(_keygen => _keygen?.not_participated).length, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {signs ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Sign Participated</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(signs.filter(_sign => _sign?.participated).length, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {signs ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Sign Not Participated</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(signs.filter(_sign => _sign?.not_participated).length, '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {chainsSupported ?
          <div className="sm:col-span-2 flex flex-col space-y-1">
            <span className="font-semibold">Chains Supported</span>
            <span className="text-gray-600 dark:text-gray-400">
              {chainsSupported.length > 0 ? chainsSupported : '-'}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {rewards ?
          <div className="sm:col-span-2 flex flex-col space-y-1">
            <span className="font-semibold">Rewards / Stake</span>
            <span className="text-gray-600 dark:text-gray-400">
              {rewards.length > 0 ? rewards : '-'}
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