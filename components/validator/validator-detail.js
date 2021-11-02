import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'
import _ from 'lodash'
import Linkify from 'react-linkify'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function ValidatorDetail({ data, delegations, keygens, all_keygens, sign_events }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

  all_keygens = all_keygens && _.uniqBy(all_keygens, key_id => key_id.split('-').length > 2 ? _.slice(key_id.split('-'), 0, 2).map((key_attr, i) => i === 0 ? getName(key_attr) : key_attr).join('-').toLowerCase() : key_id)

  return (
    <Widget
      title={data ?
        <div className="flex items-start text-gray-900 dark:text-gray-100 space-x-2 mb-6">
          {data.description && (
            <img
              src={data.description.image}
              alt=""
              className="w-6 md:w-10 h-6 md:h-10 rounded-full"
            />
          )}
          <div className="flex flex-col space-y-1.5 lg:space-y-1">
            <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-2">
              <span className="text-lg font-semibold">{(data.description && data.description.moniker) || data.operator_address}</span>
              <div className="flex flex-row space-x-1.5">
                {data.status && (
                  <span className={`bg-${data.status.includes('UN') ? data.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                    {data.status.replace('BOND_STATUS_', '')}
                  </span>
                )}
                {data.deregistering && (
                  <span className="bg-blue-400 rounded capitalize text-white font-semibold px-2 py-1">
                    De-registering
                  </span>
                )}
                {data.jailed && (
                  <span className="bg-red-600 rounded capitalize text-white font-semibold px-2 py-1">
                    Jailed
                  </span>
                )}
                {data.tombstoned && (
                  <span className="bg-red-600 rounded capitalize text-white font-semibold px-2 py-1">
                    Tombstoned
                  </span>
                )}
              </div>
            </div>
            {data.illegible && data.tss_illegibility_info && (
              <div className="space-x-1.5 pt-1">
                {Object.entries(data.tss_illegibility_info).filter(([key, value]) => value).map(([key, value]) => (
                  <span key={key} className="max-w-min bg-gray-100 dark:bg-gray-700 rounded capitalize text-gray-800 dark:text-gray-200 text-xs font-semibold px-1.5 py-0.5">
                    {getName(key)}
                  </span>
                ))}
              </div>
            )}
            <div className="h-0.5" />
            {data.operator_address && (
              <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
                <span className="font-medium">Operator Address:</span>
                <span className="flex items-center space-x-1 lg:space-x-0">
                  <span className="lg:hidden font-light">{ellipseAddress(data.operator_address, 16)}</span>
                  <span className="hidden lg:block font-light lg:pr-1">{ellipseAddress(data.operator_address, 32)}</span>
                  <Copy text={data.operator_address} />
                </span>
              </div>
            )}
            {data.delegator_address && (
              <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
                <span className="font-medium">Self-Delegate Address:</span>
                <span className="flex items-center space-x-1 lg:space-x-0">
                  <Link href={`/account/${data.delegator_address}`}>
                    <a className="lg:hidden text-blue-600 dark:text-blue-500 font-normal">{ellipseAddress(data.delegator_address, 16)}</a>
                  </Link>
                  <Link href={`/account/${data.delegator_address}`}>
                    <a className="hidden lg:block text-blue-600 dark:text-blue-500 font-normal lg:pr-1">{ellipseAddress(data.delegator_address, 24)}</a>
                  </Link>
                  <Copy text={data.delegator_address} />
                </span>
              </div>
            )}
            {data.description?.website && (
              <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
                <span className="font-medium">Website:</span>
                <a href={data.description.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 font-normal">{data.description.website}</a>
              </div>
            )}
            {data.description?.details && (
              <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
                <span className="font-medium">Details:</span>
                <span className="linkify font-light"><Linkify>{data.description.details}</Linkify></span>
              </div>
            )}
            {typeof data.start_height === 'number' && (
              <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
                <span className="font-medium">Validator Since Block:</span>
                <span className="text-gray-600 dark:text-gray-400 font-semibold">{numberFormat(data.start_height, '0,0')}</span>
              </div>
            )}
            {typeof data.jailed_until === 'number' && (
              <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
                <span className="font-medium">Latest Unjailed:</span>
                <div className="flex flex-wrap items-start">
                  {data.jailed_until > 0 ?
                    <>
                      <span className="text-gray-400 dark:text-gray-400 mr-2">{moment(data.jailed_until).fromNow()}</span>
                      <span className="text-gray-500 dark:text-gray-300 font-medium">({moment(data.jailed_until).format('MMM D, YYYY h:mm:ss A')})</span>
                    </>
                    :
                    <span className="text-gray-400 dark:text-gray-400">Never Jailed</span>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className="flex items-start space-x-2 mb-7">
          <div className="skeleton w-6 md:w-10 h-6 md:h-10 rounded-full" />
          <div className="flex flex-col space-y-2.5 mt-1.5">
            <div className="skeleton w-32 h-6 mb-1.5" />
            <div className="skeleton w-60 h-4" />
            <div className="skeleton w-40 h-4" />
            <div className="skeleton w-48 h-4" />
          </div>
        </div>
      }
      description={<span className="text-gray-900 dark:text-white text-lg font-semibold">Validator Infomation</span>}
      className="min-h-full"
    >
      {data ?
        <>
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-base sm:text-xs lg:text-base mt-3">
            <div className="flex items-start space-x-2">
              <span className="font-medium">Commission:</span>
              <span className="font-light">{data.commission && data.commission.commission_rates && !isNaN(data.commission.commission_rates.rate) ? numberFormat(data.commission.commission_rates.rate * 100, '0,0.00') : '-'}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Max Commission:</span>
              <span className="font-light">{data.commission && data.commission.commission_rates && !isNaN(data.commission.commission_rates.max_rate) ? numberFormat(data.commission.commission_rates.max_rate * 100, '0,0.00') : '-'}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Uptime:</span>
              {typeof data.uptime === 'number' ?
                <>
                  <span className="font-light">{numberFormat(data.uptime, '0,0.00')}%</span>
                  <span className="block sm:hidden lg:block font-light">({numberFormat(100 - data.uptime, '0,0.00')}% missed)</span>
                </>
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Voting Power:</span>
              <span className="font-light">{chain_data && chain_data.staking_pool && chain_data.staking_pool.bonded_tokens ? numberFormat(Math.floor(data.delegator_shares / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)) * 100 / Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00') : ''}%</span>
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-base sm:text-xs lg:text-base mt-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Delegations:</span>
              {delegations ?
                <span className="font-light">{numberFormat(delegations.length, '0,0')}</span>
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Keygen Participation:</span>
              {keygens ?
                <span className="font-light">{numberFormat(keygens.length, '0,0')}</span>
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex items-center space-x-2">
              <span className="max-w-max sm:max-w-min lg:max-w-max font-medium">Signing Participation:</span>
              {sign_events ?
                <div className="flex space-x-1">
                  <span className="font-light">{numberFormat(sign_events.filter(event => event.participated).length, '0,0')}/{numberFormat(sign_events.length, '0,0')}</span>
                  <span className="block sm:hidden lg:block font-light">({numberFormat(sign_events.length > 0 ? sign_events.filter(event => event.participated).length * 100 / sign_events.length : sign_events.filter(event => event.participated).length < 1 ? 0 : 100, '0,0.00')}%)</span>
                </div>
                :
                <div className="skeleton w-6 lg:w-12 h-4" />
              }
            </div>
            {/*<div className="flex items-center space-x-2">
              <span className="max-w-max sm:max-w-min lg:max-w-max font-medium">Keygen Participation:</span>
              {keygens && all_keygens ?
                <div className="flex space-x-1">
                  <span className="font-light">{numberFormat(keygens.length, '0,0')}/{numberFormat(all_keygens.length, '0,0')}</span>
                  <span className="block sm:hidden lg:block font-light">({numberFormat(all_keygens.length > 0 ? keygens.length * 100 / all_keygens.length : keygens.length < 1 ? 0 : 100, '0,0.00')}%)</span>
                </div>
                :
                <div className="skeleton w-6 lg:w-12 h-4" />
              }
            </div>*/}
          </div>
        </>
        :
        <>
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-base mt-3">
            <div className="skeleton w-48 md:w-28 lg:w-48 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-48 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-56 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-56 h-5" />
          </div>
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-base mt-4">
            <div className="skeleton w-48 md:w-28 lg:w-48 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-48 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-56 h-5" />
            <div className="skeleton w-48 md:w-28 lg:w-56 h-5" />
          </div>
        </>
      }
    </Widget>
  )
}