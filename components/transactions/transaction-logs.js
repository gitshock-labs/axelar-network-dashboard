import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSelector, shallowEqual } from 'react-redux'

import { BsArrowRight } from 'react-icons/bs'

import Copy from '../copy'

import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function TransactionLogs({ data }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const ReactJson = typeof window !== 'undefined' && dynamic(import('react-json-view'))

  return (
    <div className="flex flex-col space-y-4 mt-3">
      {(data ?
        (data.activities || []).map((activity, i) => { return { ...activity, i } })
        :
        [...Array(1).keys()].map(i => { return { i, skeleton: true } })
      ).map((activity, i) => (
        <div key={i} className="max-w-2xl bg-white dark:bg-gray-800 rounded shadow-lg flex items-center space-x-4 p-4">
          {activity.skeleton || activity.type !== 'update_client' ?
            <>
              {(activity.skeleton || (activity.sender && !activity.depositor)) && (
                <div className="flex flex-col">
                  {!activity.skeleton ?
                    <>
                      <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                        <Link href={`/account/${activity.sender}`}>
                          <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                            {ellipseAddress(activity.sender)}
                          </a>
                        </Link>
                        <Copy text={activity.sender} />
                      </div>
                      <span className="text-xs">{activity.sender_name || 'Sender'}</span>
                    </>
                    :
                    <>
                      <div className="skeleton w-60 h-6" />
                      <div className="skeleton w-24 h-4 mt-2" />
                    </>
                  }
                </div>
              )}
              {activity.depositor && (
                <div className="flex flex-col">
                  {!activity.skeleton ?
                    <>
                      <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                        <Link href={`/account/${activity.depositor}`}>
                          <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                            {ellipseAddress(activity.depositor)}
                          </a>
                        </Link>
                        <Copy text={activity.depositor} />
                      </div>
                      <span className="text-xs">{activity.depositor_name || 'Depositor'}</span>
                    </>
                    :
                    <>
                      <div className="skeleton w-60 h-6" />
                      <div className="skeleton w-24 h-4 mt-2" />
                    </>
                  }
                </div>
              )}
              {activity.module && (
                <div className="flex flex-col">
                  {!activity.skeleton ?
                    <>
                      <span className="h-6 text-xs pt-1 mt-0.5">Module</span>
                      <span className="uppercase font-semibold mt-1.5">{activity.module}</span>
                    </>
                    :
                    <>
                      <div className="skeleton w-16 h-4" />
                      <div className="skeleton w-18 h-6 mt-2" />
                    </>
                  }
                </div>
              )}
              {(activity.skeleton || activity.action) && (
                <div className="flex flex-col items-center space-y-1">
                  {!activity.skeleton ?
                    <>
                      {activity.action ?
                        <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-2 py-1">
                          {getName(activity.action)}
                        </span>
                        :
                        <BsArrowRight size={24} />
                      }
                      {activity.market_id && activity.market_price ?
                        <>
                          <span className="uppercase">{activity.market_id}</span>
                          <span>{numberFormat(activity.market_price, '0,0.00000000')}</span>
                        </>
                        :
                        activity.value ?
                          <span className="capitalize">{activity.value}</span>
                          :
                          typeof activity.amount === 'number' ?
                            <span className="flex items-center justify-end space-x-1">
                              <span>{numberFormat(activity.amount, '0,0.00000000')}</span>
                              <span className="uppercase font-medium">{activity.symbol || activity.denom}</span>
                            </span>
                            :
                            null
                      }
                    </>
                    :
                    <>
                      <div className="skeleton w-12 h-6" />
                      <div />
                      <div className="skeleton w-12 h-4" />
                    </>
                  }
                </div>
              )}
              {(activity.skeleton || (activity.recipient && !activity.validator)) && (
                <div className="flex flex-col">
                  {!activity.skeleton ?
                    <>
                      <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                        <Link href={`/account/${activity.recipient}`}>
                          <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                            {ellipseAddress(activity.recipient)}
                          </a>
                        </Link>
                        <Copy text={activity.recipient} />
                      </div>
                      <span className="text-xs">{activity.recipient_name || 'Recipient'}</span>
                    </>
                    :
                    <>
                      <div className="skeleton w-60 h-6" />
                      <div className="skeleton w-24 h-4 mt-2" />
                    </>
                  }
                </div>
              )}
              {activity.validator && (
                <div className="flex flex-col">
                  {!activity.skeleton ?
                    <>
                      <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                        <Link href={`/validator/${activity.validator}`}>
                          <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                            {ellipseAddress(activity.validator)}
                          </a>
                        </Link>
                        <Copy text={activity.validator} />
                      </div>
                      <span className="text-xs">{activity.validator_name || 'Validator'}</span>
                    </>
                    :
                    <>
                      <div className="skeleton w-60 h-6" />
                      <div className="skeleton w-24 h-4 mt-2" />
                    </>
                  }
                </div>
              )}
            </>
            :
            data && data.tx ?
              <ReactJson src={data.tx} theme={theme === 'dark' ? 'harmonic' : 'rjv-default'} />
              :
              <></>
          }
        </div>
      ))}
    </div>
  )
}