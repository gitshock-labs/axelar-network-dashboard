import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'
import _ from 'lodash'
import Linkify from 'react-linkify'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function Information({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

  return (
    <Widget
      title={data ?
        <div className="flex items-center space-x-3 mr-2">
          {data.description?.image ?
            <img
              src={data.description.image}
              alt=""
              className="w-8 md:w-12 h-8 md:h-12 rounded-full"
            />
            :
            <div className="skeleton w-8 md:w-12 h-8 md:h-12 rounded-full" />
          }
          <span className="break-all text-gray-900 dark:text-gray-100 text-base sm:text-lg font-semibold">{data.description?.moniker || ellipseAddress(data.operator_address, 16)}</span>
        </div>
        :
        <div className="flex items-center space-x-3">
          <div className="skeleton w-8 md:w-12 h-8 md:h-12 rounded-full" />
          <div className="skeleton w-32 h-6" />
        </div>
      }
      right={data ?
        <div className="flex flex-col space-y-1.5 lg:space-y-1">
          <div className="flex items-center sm:justify-end space-x-2">
            {data.status && (
              <span className={`bg-${data.status.includes('UN') ? data.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                {data.status.replace('BOND_STATUS_', '')}
              </span>
            )}
            {data.deregistering && (
              <span className="bg-blue-400 rounded whitespace-nowrap capitalize text-white font-semibold px-2 py-1">
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
          {data.illegible && data.tss_illegibility_info && (
            <div className="flex flex-wrap sm:justify-end">
              {Object.entries(data.tss_illegibility_info).filter(([key, value]) => value).map(([key, value]) => (
                <span key={key} className="max-w-min bg-gray-100 dark:bg-gray-700 rounded whitespace-nowrap capitalize text-gray-800 dark:text-gray-200 text-xs font-semibold px-1.5 py-0.5 my-1 ml-0 sm:ml-2 mr-2 sm:mr-0">
                  {getName(key)}
                </span>
              ))}
            </div>
          )}
        </div>
        :
        <div className="skeleton w-24 h-7" />
      }
      contentClassName={`flex-col sm:flex-row ${data?.illegible ? 'items-start' : 'items-start sm:items-center'} space-y-2 sm:space-y-0`}
      className="min-h-full"
    >
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4 text-sm lg:text-base mt-3">
        {data ?
          data.operator_address && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Operator Address:</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1">
                <span className="lg:hidden">{ellipseAddress(data.operator_address, 16)}</span>
                <span className="hidden lg:block lg:pr-1">{ellipseAddress(data.operator_address, 32)}</span>
                <Copy size={20} text={data.operator_address} />
              </span>
            </div>
          )
          :
          <div className="skeleton w-60 sm:w-72 lg:w-96 h-6" />
        }
        {data ?
          data.delegator_address && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Delegator Address:</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1">
                <Link href={`/account/${data.delegator_address}`}>
                  <a className="lg:hidden text-blue-600 dark:text-blue-500">
                    {ellipseAddress(data.delegator_address, 16)}
                  </a>
                </Link>
                <Link href={`/account/${data.delegator_address}`}>
                  <a className="hidden lg:block text-blue-600 dark:text-blue-500 lg:pr-1">
                    {ellipseAddress(data.delegator_address, 24)}
                  </a>
                </Link>
                <Copy size={20} text={data.delegator_address} />
              </span>
            </div>
          )
          :
          <div className="skeleton w-60 sm:w-72 lg:w-96 h-6" />
        }
        {data ?
          data.description?.details && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Description:</span>
              <span className="linkify text-gray-600 dark:text-gray-400">
                <Linkify>{data.description.details}</Linkify>
              </span>
            </div>
          )
          :
          <div className="skeleton w-full sm:w-72 lg:w-96 h-6" />
        }
        {data ?
          data.description?.website && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Website:</span>
              <a href={data.description.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500">
                {data.description.website}
              </a>
            </div>
          )
          :
          <div className="skeleton w-60 h-6" />
        }
        {data ?
          data.commission && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Commission:</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
                <span>{!isNaN(data.commission.commission_rates?.rate) ? numberFormat(data.commission.commission_rates.rate * 100, '0,0.00') : '-'}%</span>
                {!isNaN(data.commission.commission_rates?.max_rate) && (
                  <span>(Max: {numberFormat(data.commission.commission_rates.max_rate * 100, '0,0.00')}%)</span>
                )}
              </span>
            </div>
          )
          :
          <div className="skeleton w-60 h-6" />
        }
        {data ?
          typeof data.start_height === 'number' && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Validator Since Block:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {numberFormat(data.start_height, '0,0')}
              </span>
            </div>
          )
          :
          <div className="skeleton w-60 h-6" />
        }
        {data ?
          typeof data.jailed_until === 'number' && (
            <div className="flex flex-col xl:flex-row items-start space-x-0 xl:space-x-2">
              <span className="font-semibold">Latest Jailed Until:</span>
              <span className="flex flex-wrap items-start text-gray-600 dark:text-gray-400">
                {data.jailed_until > 0 ?
                  <>
                    <span className="text-gray-400 dark:text-gray-600 mr-1.5">{moment(data.jailed_until).fromNow()}</span>
                    <span>({moment(data.jailed_until).format('MMM D, YYYY h:mm:ss A')})</span>
                  </>
                  :
                  <span>Never Jailed</span>
                }
              </span>
            </div>
          )
          :
          <div className="skeleton w-60 h-6" />
        }
      </div>
    </Widget>
  )
}