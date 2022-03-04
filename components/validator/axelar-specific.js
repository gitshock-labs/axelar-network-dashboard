import { useSelector, shallowEqual } from 'react-redux'

import Widget from '../widget'
import Copy from '../copy'

import { chain_manager } from '../../lib/object/chain'
import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function AxelarSpecific({ data, keygens, signs, evmVotes, supportedChains, rewards }) {
  const { chains } = useSelector(state => ({ chains: state.chains }), shallowEqual)
  const { chains_data } = { ...chains }

  const keygenParticipated = keygens && keygens.filter(k => k?.participated).length
  const keygenNotParticipated = keygens && keygens.filter(k => k?.not_participated).length
  const totalKeygen = keygenParticipated + keygenNotParticipated

  const signParticipated = signs && (signs.total_participated_signs || signs.data?.filter(s => s?.participated).length)
  const signNotParticipated = signs && (signs.total_not_participated_signs || signs.data?.filter(s => s?.not_participated).length)
  const totalSign = signParticipated + signNotParticipated

  return (
    <Widget
      title={<span className="text-lg font-medium">Axelar Specific</span>}
      className="dark:border-gray-900"
    >
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${data ? 'mt-3 mb-0.5' : 'mt-4 mb-1'}`}>
        <div className={`flex flex-col space-y-${keygens ? 1 : 2}`}>
          <span className="font-semibold">Keygen Participated</span>
          {keygens ?
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(keygenParticipated, '0,0')}</span>
              <span>({numberFormat((totalKeygen > 0 ? keygenParticipated / totalKeygen : 0) * 100, '0,0.00')}%)</span>
            </span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${keygens ? 1 : 2}`}>
          <span className="font-semibold">Keygen Not Participated</span>
          {keygens ?
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(keygenNotParticipated, '0,0')}</span>
              <span>({numberFormat((totalKeygen > 0 ? keygenNotParticipated / totalKeygen : 0) * 100, '0,0.00')}%)</span>
            </span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${signs ? 1 : 2}`}>
          <span className="font-semibold">Sign Participated</span>
          {signs ?
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(signParticipated, '0,0')}</span>
              <span>({numberFormat((totalSign > 0 ? signParticipated / totalSign : 0) * 100, '0,0.00')}%)</span>
            </span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`flex flex-col space-y-${signs ? 1 : 2}`}>
          <span className="font-semibold">Sign Not Participated</span>
          {signs ?
            <span className="flex items-center text-gray-500 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(signNotParticipated, '0,0')}</span>
              <span>({numberFormat((totalSign > 0 ? signNotParticipated / totalSign : 0) * 100, '0,0.00')}%)</span>
            </span>
            :
            <div className="skeleton w-28 h-6" />
          }
        </div>
        <div className={`sm:col-span-2 flex flex-col space-y-${evmVotes ? 1 : 2}`}>
          <span className="font-semibold space-x-2">
            <span>EVM Votes</span>
          </span>
          {evmVotes ?
            <span className="flex flex-wrap items-center text-gray-500 dark:text-gray-400">
              {Object.keys(evmVotes.chains || {}).length > 0 ?
                <div className="w-full grid grid-flow-row grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                  {Object.entries(evmVotes.chains).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between space-x-2">
                      <img
                        src={chain_manager.image(key, chains_data)}
                        alt={chain_manager.title(key, chains_data)}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex flex-col items-end">
                        <span className="uppercase text-xs font-semibold">{numberFormat(value?.confirms?.true || 0, '0,0')} Yes</span>
                        <span className="uppercase text-xs font-semibold">{numberFormat(value?.confirms?.false || 0, '0,0')} No</span>
                      </div>
                    </div>
                  ))}
                </div>
                :
                '-'
              }
            </span>
            :
            <div className="skeleton w-full h-6" />
          }
        </div>
        <div className={`sm:col-span-2 flex flex-col space-y-${supportedChains ? 1 : 2}`}>
          <span className="font-semibold space-x-2">
            <span>Chains Supported</span>
          </span>
          {supportedChains ?
            <span className="flex flex-wrap items-center text-gray-500 dark:text-gray-400">
              {supportedChains.length > 0 ?
                supportedChains.map((id, i) => (
                  <span key={i} className="min-w-max max-w-min bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center text-gray-800 dark:text-gray-200 text-2xs font-semibold space-x-1 px-2 py-1 my-1 mr-2">
                    {chain_manager.image(id, chains_data) && (
                      <img
                        alt=""
                        src={chain_manager.image(id, chains_data)}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="whitespace-nowrap">{chain_manager.title(id, chains_data)}</span>
                  </span>
                ))
                :
                '-'
              }
            </span>
            :
            <div className="skeleton w-full h-6" />
          }
        </div>
        {/*<div className={`sm:col-span-2 flex flex-col space-y-${rewards ? 1 : 2}`}>
          <span className="font-semibold">Rewards / Stake</span>
          {rewards ?
            <span className="text-gray-500 dark:text-gray-400">
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
            :
            <>
              <div className="skeleton w-full h-6" />
              <div className="skeleton w-full h-6" />
            </>
          }
        </div>*/}
      </div>
    </Widget>
  )
}