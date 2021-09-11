import Link from 'next/link'

import moment from 'moment'
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function TransactionDetail({ data }) {
  return (
    <Widget className="p-2 md:p-8">
      <div className="w-full flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Tx Hash:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              <span className="break-all uppercase">{data.txhash}</span>
              {data.txhash && (<Copy text={data.txhash} />)}
            </div>
            :
            <div className="skeleton w-60 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Status:</span>
          {data ?
            data.status && (
              <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                {data.status === 'success' ?
                  <FaCheckCircle size={18} className="text-green-500" />
                  :
                  data.status === 'pending' ?
                    <FaClock size={18} className="text-gray-500" />
                    :
                    <FaTimesCircle size={18} className="text-red-500" />
                }
                <span className="capitalize">{data.status}</span>
              </div>
            )
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Block:</span>
          {data ?
            <div className="text-xs lg:text-base">
              <Link href={`/blocks/${data.height}`}>
                <a className="text-blue-600 dark:text-blue-400">
                  {data.height}
                </a>
              </Link>
            </div>
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Time:</span>
          {data ?
            data.timestamp && (
              <div className="flex flex-wrap text-xs lg:text-base space-x-1">
                <span className="text-gray-500 dark:text-gray-400">{moment(data.timestamp).fromNow()}</span>
                <span>({moment(data.timestamp).format('MMM D, YYYY h:mm:ss A')})</span>
              </div>
            )
            :
            <div className="skeleton w-60 h-6 mt-1" />
          }
        </div>
        {(!data || data.type) && (
          <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
            <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Action:</span>
            {data ?
              <div className="text-xs lg:text-base">
                {data.type ?
                  <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-2 py-1">
                    {getName(data.type)}
                  </span>
                  :
                  '-'
                }
              </div>
              :
              <div className="skeleton w-24 h-6 mt-1" />
            }
          </div>
        )}
        {/*<div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">From:</span>
          {data ?
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                <Link href={`/${data.from.type === 'validator' ? 'validator' : 'account'}/${data.from.key}`}>
                  <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                    {ellipseAddress(data.from.key)}
                  </a>
                </Link>
                <Copy text={data.from.key} />
              </div>
              {data.from.name && (
                <span className="text-xs">{data.from.name}</span>
              )}
            </div>
            :
            <div className="skeleton w-60 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">To:</span>
          {data ?
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                <Link href={`/${data.from.type === 'validator' ? 'validator' : 'account'}/${data.to.key}`}>
                  <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                    {ellipseAddress(data.to.key)}
                  </a>
                </Link>
                <Copy text={data.to.key} />
              </div>
              {data.to.name && (
                <span className="text-xs">{data.to.name}</span>
              )}
            </div>
            :
            <div className="skeleton w-60 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Value:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              {typeof data.value === 'number' ?
                <span className="flex items-center justify-end space-x-1">
                  <span>{numberFormat(data.value, '0,0.00000000')}</span>
                  <span className="uppercase font-medium">{data.symbol}</span>
                </span>
                :
                '-'
              }
            </div>
            :
            <div className="skeleton w-32 h-6 mt-1" />
          }
        </div>*/}
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Transaction Fee:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              {typeof data.fee === 'number' ?
                <span className="flex items-center justify-end space-x-1">
                  <span>{data.fee ? numberFormat(data.fee, '0,0.00000000') : 'No Fee'}</span>
                  {data.fee > 0 && (
                    <span className="uppercase font-medium">{data.symbol}</span>
                  )}
                </span>
                :
                '-'
              }
            </div>
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </div>
        {/*<div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Gas Price:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              {typeof data.gas_price === 'number' ?
                <span className="flex items-center justify-end space-x-1">
                  <span>{numberFormat(data.gas_price, '0,0.00000000')}</span>
                  <span className="uppercase font-medium">{data.symbol}</span>
                </span>
                :
                '-'
              }
            </div>
            :
            <div className="skeleton w-32 h-6 mt-1" />
          }
        </div>*/}
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Gas Used:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              {typeof data.gas_used === 'number' ?
                <span>{numberFormat(data.gas_used, '0,0.00000000')}</span>
                :
                '-'
              }
            </div>
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
          <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Gas Limit:</span>
          {data ?
            <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
              {typeof data.gas_limit === 'number' ?
                <span>{numberFormat(data.gas_limit, '0,0.00000000')}</span>
                :
                '-'
              }
            </div>
            :
            <div className="skeleton w-24 h-6 mt-1" />
          }
        </div>
        {data && data.memo && (
          <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 space-x-0 md:space-x-2">
            <span className="w-40 lg:w-64 text-xs lg:text-base font-semibold">Memo:</span>
            {data ?
              <span className="break-all text-xs lg:text-base">{data.memo}</span>
              :
              <div className="skeleton w-60 h-6 mt-1" />
            }
          </div>
        )}
      </div>
    </Widget>
  )
}