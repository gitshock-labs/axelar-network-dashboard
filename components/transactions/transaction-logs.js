import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSelector, shallowEqual } from 'react-redux'

import { BsArrowRight } from 'react-icons/bs'

import Copy from '../copy'

import { type } from '../../lib/object/id'
import { numberFormat, getName, ellipseAddress, convertToJson } from '../../lib/utils'

export default function TransactionLogs({ data }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const ReactJson = typeof window !== 'undefined' && dynamic(import('react-json-view'))

  return (
    <div className="flex flex-col space-y-4 mt-3">
      {(data ?
        (data.activities || []).map((activity, i) => { return { ...activity, i, outPointInfo: convertToJson(activity.outPointInfo) } })
        :
        [...Array(1).keys()].map(i => { return { i, skeleton: true } })
      ).map((activity, i) => {
        const body = !activity.skeleton && data?.tx && (
          <div className="max-w-3xl">
            <ReactJson src={data.tx.body?.messages || data.tx} theme={theme === 'dark' ? 'harmonic' : 'rjv-default'} />
          </div>
        )

        const hasActivities = !activity.failed && !(['update_client'].includes(activity.type)) && !(['KeygenTraffic', 'SignPendingTransfers', 'ExecutePendingTransfers', 'VoteConfirmDeposit', 'VoteSig'].includes(activity.action))

        return (
          <div key={i}>
            <div className="md:min-w-max max-w-3xl bg-white dark:bg-gray-900 overflow-x-auto rounded-xl shadow-lg flex items-center space-x-4 p-4">
              {activity.skeleton || hasActivities ?
                <>
                  {(activity.skeleton || (activity.sender && !activity.depositor)) && (
                    <div className="flex flex-col">
                      {!activity.skeleton ?
                        <>
                          <div className="flex items-center text-2xs lg:text-base space-x-1">
                            <Link href={`/${type(activity.sender)}/${activity.sender}`}>
                              <a className="uppercase text-blue-600 dark:text-white font-medium">
                                {ellipseAddress(activity.sender, 16)}
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
                          <div className="flex items-center text-2xs lg:text-base space-x-1">
                            <Link href={`/${type(activity.depositor)}/${activity.depositor}`}>
                              <a className="uppercase text-blue-600 dark:text-white font-medium">
                                {ellipseAddress(activity.depositor, 16)}
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
                          <span className="h-6 text-xs mt-0.5 pt-1">Module</span>
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
                    <div className="flex flex-col items-start space-y-1">
                      {!activity.skeleton ?
                        <>
                          {activity.action ?
                            <span className="bg-gray-100 dark:bg-gray-800 rounded-lg capitalize text-gray-900 dark:text-gray-100 font-semibold px-2 py-1">
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
                              /*typeof activity.amount === 'number'*/activity.amount > 0 ?
                                <span className="w-full max-w-sm break-all flex items-start justify-end space-x-1">
                                  <span className="whitespace-nowrap">{numberFormat(activity.amount, '0,0.00000000')}</span>
                                  <span className="uppercase font-medium">{activity.symbol || ellipseAddress(activity.denom)}</span>
                                </span>
                                :
                                activity.log ?
                                  <span className="max-w-md text-gray-400 dark:text-gray-600 text-xs">{activity.log}</span>
                                  :
                                  <span className="h-3" />
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
                  {activity.chain && (
                    <div className="flex flex-col">
                      {!activity.skeleton ?
                        <>
                          <span className="h-6 text-xs mt-0.5 pt-1">Chain</span>
                          <span className="uppercase font-semibold mt-1.5">{activity.chain}</span>
                        </>
                        :
                        <>
                          <div className="skeleton w-16 h-4" />
                          <div className="skeleton w-18 h-6 mt-2" />
                        </>
                      }
                    </div>
                  )}
                  {activity.outPointInfo && (
                    <div className="flex flex-col space-y-1">
                      {!activity.skeleton ?
                        <>
                          {activity.outPointInfo.out_point && (
                            <div className="flex items-center text-xs space-x-1">
                              <span className="font-semibold">Out Point:</span>
                              <span className="text-gray-400 dark:text-gray-600">{ellipseAddress(activity.outPointInfo.out_point)}</span>
                              <Copy text={activity.outPointInfo.out_point} />
                            </div>
                          )}
                          {activity.outPointInfo.amount && (
                            <div className="flex items-center text-xs space-x-1">
                              <span className="font-semibold">Amount:</span>
                              <span className="text-gray-400 dark:text-gray-600">{activity.outPointInfo.amount}</span>
                            </div>
                          )}
                          {activity.outPointInfo.address && (
                            <div className="flex items-center text-xs space-x-1">
                              <span className="font-semibold">Address:</span>
                              <span className="text-gray-400 dark:text-gray-600">{ellipseAddress(activity.outPointInfo.address)}</span>
                              <Copy text={activity.outPointInfo.address} />
                            </div>
                          )}
                        </>
                        :
                        <>
                          <div className="skeleton w-60 h-6" />
                          <div className="skeleton w-24 h-4 mt-2" />
                        </>
                      }
                    </div>
                  )}
                  {(activity.skeleton || (activity.recipient?.length > 0 && !activity.validator)) && (
                    <div className="flex flex-col">
                      {!activity.skeleton ?
                        <>
                          {Array.isArray(activity.recipient) ?
                            activity.recipient.map((recipient, i) => (
                              <div key={i} className="flex items-center text-2xs lg:text-base space-x-1">
                                <Link href={`/${type(recipient)}/${recipient}`}>
                                  <a className="uppercase text-blue-600 dark:text-white font-medium">
                                    {ellipseAddress(recipient, 16)}
                                  </a>
                                </Link>
                                <Copy text={recipient} />
                              </div>
                            ))
                            :
                            <div className="flex items-center text-2xs lg:text-base space-x-1">
                              <Link href={`/${type(activity.recipient)}/${activity.recipient}`}>
                                <a className="uppercase text-blue-600 dark:text-white font-medium">
                                  {ellipseAddress(activity.recipient, 16)}
                                </a>
                              </Link>
                              <Copy text={activity.recipient} />
                            </div>
                          }
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
                          <div className="flex items-center text-2xs lg:text-base space-x-1">
                            <Link href={`/${type(activity.validator)}/${activity.validator}`}>
                              <a className="uppercase text-blue-600 dark:text-white font-medium">
                                {ellipseAddress(activity.validator, 16)}
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
                body
              }
            </div>
            {hasActivities && body && (
              <div className="mt-4">
                {body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}