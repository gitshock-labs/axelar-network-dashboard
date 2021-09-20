import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function ValidatorDetail({ data, delegations, keygens }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

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
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-semibold">{(data.description && data.description.moniker) || data.operator_address}</span>
              {data.status && (
                <span className={`bg-${data.status.includes('UN') ? data.status.endsWith('ED') ? 'gray-400 dark:bg-gray-600' : 'yellow-400 dark:bg-yellow-600' : 'green-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                  {data.status.replace('BOND_STATUS_', '')}
                </span>
              )}
              {data.jailed && (
                <span className="bg-red-600 rounded capitalize text-white font-semibold px-2 py-1">
                  Jailed
                </span>
              )}
            </div>
            {data.operator_address && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">Operator Address:</span>
                <span className="flex items-center space-x-1">
                  <span className="font-light">{ellipseAddress(data.operator_address)}</span>
                  <Copy text={data.operator_address} />
                </span>
              </div>
            )}
            {data.delegator_address && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">Self-Delegate Address:</span>
                <span className="flex items-center space-x-1">
                  <Link href={`/account/${data.delegator_address}`}>
                    <a className="text-blue-600 dark:text-blue-400 font-light">{ellipseAddress(data.delegator_address)}</a>
                  </Link>
                  <Copy text={data.delegator_address} />
                </span>
              </div>
            )}
            {data.description && data.description.website && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">Website:</span>
                <a href={data.description.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-light">{data.description.website}</a>
              </div>
            )}
            {data.description && data.description.details && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">Details:</span>
                <span className="font-light">{data.description.details}</span>
              </div>
            )}
            {data.started_at && (
              <div className="flex items-start space-x-2">
                <span className="font-medium">First Seen:</span>
                <div className="flex flex-wrap items-start">
                  <span className="text-gray-400 dark:text-gray-400 mr-2">{moment(data.started_at).fromNow()}</span>
                  <span className="text-gray-500 dark:text-gray-300 font-medium">({moment(data.started_at).format('MMM D, YYYY h:mm:ss A')})</span>
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className="flex items-start space-x-2 mb-7">
          <div className="skeleton w-6 md:w-10 h-6 md:h-10 rounded-full" />
          <div className="flex flex-col space-y-2.5">
            <div className="skeleton w-32 h-6 mb-1.5" />
            <div className="skeleton w-60 h-4" />
            <div className="skeleton w-40 h-4" />
            <div className="skeleton w-48 h-4" />
          </div>
        </div>
      }
      description={<span className="text-gray-900 dark:text-white text-lg font-semibold">Service Quality</span>}
      className="min-h-full"
    >
      {data ?
        <>
          <div className="flex flex-col space-y-1 text-base mt-2">
            <div className="flex items-start space-x-2">
              <span className="font-medium">Commission:</span>
              <span className="font-light">{data.commission && data.commission.commission_rates && !isNaN(data.commission.commission_rates.rate) ? numberFormat(data.commission.commission_rates.rate * 100, '0,0.00') : '-'}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Max Commission:</span>
              <span className="font-light">{data.commission && data.commission.commission_rates && !isNaN(data.commission.commission_rates.max_rate) ? numberFormat(data.commission.commission_rates.max_rate * 100, '0,0.00') : '-'}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Success rate:</span>
              <span className="font-light">{numberFormat(data.uptime, '0,0.00')}%</span>
              <span className="font-light">({numberFormat(100 - data.uptime, '0,0.00')}% missed)</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1 text-base mt-4">
            <div className="flex items-start space-x-2">
              <span className="font-medium">Validator pool share:</span>
              <span className="font-light">{chain_data && chain_data.staking_pool && chain_data.staking_pool.bonded_tokens ? numberFormat(Math.floor(data.delegator_shares / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)) * 100 / Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00') : ''}%</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Delegations:</span>
              <span className="font-light">{delegations ? numberFormat(delegations.length, '0,0') : '-'}</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-medium">Keygens:</span>
              <span className="font-light">{keygens ? numberFormat(keygens.length, '0,0') : '-'}</span>
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