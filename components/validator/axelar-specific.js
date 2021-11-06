import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function AxelarSpecific({ data, keygens, signs, chainsSupported, rewards }) {
  const keygenParticipated = keygens && keygens.filter(_keygen => _keygen?.participated).length
  const keygenNotParticipated = keygens && keygens.filter(_keygen => _keygen?.not_participated).length
  const totalKeygen = keygenParticipated + keygenNotParticipated

  const signParticipated = signs && signs.filter(_sign => _sign?.participated).length
  const signNotParticipated = signs && signs.filter(_sign => _sign?.not_participated).length
  const totalSign = signParticipated + signNotParticipated

  return (
    <Widget
      title={<span className="text-lg font-medium">Axelar Specific</span>}
      className="min-h-full"
    >
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${data ? 'my-3' : 'my-4'}`}>
        {keygens ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Keygen Participated</span>
            <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(keygenParticipated, '0,0')}</span>
              <span>({numberFormat((totalKeygen > 0 ? keygenParticipated / totalKeygen : 0) * 100, '0,0.00')}%)</span>
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
            <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(keygenNotParticipated, '0,0')}</span>
              <span>({numberFormat((totalKeygen > 0 ? keygenNotParticipated / totalKeygen : 0) * 100, '0,0.00')}%)</span>
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
            <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(signParticipated, '0,0')}</span>
              <span>({numberFormat((totalSign > 0 ? signParticipated / totalSign : 0) * 100, '0,0.00')}%)</span>
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
            <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(signNotParticipated, '0,0')}</span>
              <span>({numberFormat((totalSign > 0 ? signNotParticipated / totalSign : 0) * 100, '0,0.00')}%)</span>
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
          <div className="sm:col-span-2 flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-full h-6" />
          </div>
        }
        {rewards ?
          <div className="sm:col-span-2 flex flex-col space-y-1">
            <span className="font-semibold">Rewards / Stake</span>
            <span className="text-gray-600 dark:text-gray-400">
              {rewards.length > 0 ?
                <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                  {rewards.map((reward, i) => (
                    <div key={i} className={`${reward?.rewards_per_stake?.length > 1 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''} space-y-0.5`}>
                      <div className="text-sm font-light">{reward?.name}</div>
                      <div className="flex items-center">
                        {reward?.rewards_per_stake?.map((_reward, j) => (
                          <span key={j} className="bg-gray-100 dark:bg-gray-800 rounded flex items-center font-medium space-x-1 px-2 py-1 mr-2">
                            <span>{numberFormat(_reward.amount_per_stake, '0,0.000')}</span>
                            <span className="uppercase font-light">{ellipseAddress(_reward.denom, 16)}</span>
                            <span className="whitespace-nowrap text-xs font-light">({numberFormat(_reward.amount, '0,0.000')} / {numberFormat(_reward.stake, '0,0.000')})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                :
                '-'
              }
            </span>
          </div>
          :
          <div className="sm:col-span-2 flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-full h-6" />
          </div>
        }
      </div>
    </Widget>
  )
}