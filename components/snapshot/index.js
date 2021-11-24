import Link from 'next/link'
import { useEffect, useState } from 'react'

import _ from 'lodash'
import moment from 'moment'
import { FiBox } from 'react-icons/fi'

import Datatable from '../datatable'
import { ProgressBarWithText } from '../progress-bars'
import Copy from '../copy'

import { historical } from '../../lib/api/opensearch'
import { chainName, chainImage } from '../../lib/object/chain'
import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function Snapshot({ height }) {
  const [snapshot, setSnapshot] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (height) {
        if (!controller.signal.aborted) {
          const response = await historical({
            query: {
              bool: {
                must: [
                  { match: { snapshot_block: height } },
                ],
              },
            },
            size: 10000,
          })

          setSnapshot({ data: Array.isArray(response?.data) ? response.data : [], height })
        }
      }
    }

    getData()

    return () => {
      controller?.abort()
    }
  }, [height])

  return (
    <div className="max-w-7xl my-4 xl:my-6 mx-auto">
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: (rowA, rowB) => rowA.original.i > rowB.original.i ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                numberFormat((props.flatRows?.indexOf(props.row) > -1 ? props.flatRows.indexOf(props.row) : props.value) + 1, '0,0')
                :
                <div className="skeleton w-4 h-3" />
            ),
          },
          // {
          //   Header: 'Validator',
          //   accessor: 'description.moniker',
          //   sortType: (rowA, rowB) => (rowA.original.description.moniker || rowA.original.i) > (rowB.original.description.moniker || rowB.original.i) ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <div className={`min-w-max flex items-${props.value ? 'start' : 'center'} space-x-2`}>
          //         <Link href={`/validator/${props.row.original.operator_address}`}>
          //           <a>
          //             {props.row.original.description.image ?
          //               <img
          //                 src={props.row.original.description.image}
          //                 alt=""
          //                 className="w-6 h-6 rounded-full"
          //               />
          //               :
          //               <div className="skeleton w-6 h-6 rounded-full" />
          //             }
          //           </a>
          //         </Link>
          //         <div className="flex flex-col">
          //           {props.value && (
          //             <Link href={`/validator/${props.row.original.operator_address}`}>
          //               <a className="text-blue-600 dark:text-blue-500 font-medium">
          //                 {props.value || props.row.original.operator_address}
          //               </a>
          //             </Link>
          //           )}
          //           <span className="flex items-center space-x-1">
          //             <Link href={`/validator/${props.row.original.operator_address}`}>
          //               <a className="text-gray-500 font-light">
          //                 {ellipseAddress(props.row.original.operator_address, 16)}
          //               </a>
          //             </Link>
          //             <Copy text={props.row.original.operator_address} />
          //           </span>
          //         </div>
          //       </div>
          //       :
          //       <div className="flex items-start space-x-2">
          //         <div className="skeleton w-6 h-6 rounded-full" />
          //         <div className="flex flex-col space-y-1.5">
          //           <div className="skeleton w-24 h-4" />
          //           <div className="skeleton w-32 h-3" />
          //         </div>
          //       </div>
          //   ),
          // },
          // {
          //   Header: ['active'].includes(status) ? 'Voting Power' : 'Bonded Tokens',
          //   accessor: 'tokens',
          //   sortType: (rowA, rowB) => rowA.original.tokens > rowB.original.tokens ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <div className="flex flex-col justify-center text-left sm:text-right">
          //         {props.value > 0 ?
          //           <>
          //             <span className="font-medium">{numberFormat(Math.floor(props.value / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0.00')}</span>
          //             <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.value * 100 / _.sumBy(validators_data.filter(validator => !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)), 'tokens'), '0,0.000')}%</span>
          //           </>
          //           :
          //           <span className="text-gray-400 dark:text-gray-600">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="flex flex-col justify-center space-y-1">
          //         <div className="skeleton w-16 h-4 ml-0 sm:ml-auto" />
          //         <div className="skeleton w-8 h-4 ml-0 sm:ml-auto" />
          //       </div>
          //   ),
          //   headerClassName: 'min-w-max justify-start sm:justify-end text-left sm:text-right',
          // },
          // {
          //   Header: 'Self Delegation',
          //   accessor: 'self_delegation',
          //   sortType: (rowA, rowB) => rowA.original.self_delegation / rowA.original.delegator_shares > rowB.original.self_delegation / rowB.original.delegator_shares ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton && typeof props.value === 'number' ?
          //       <div className="flex flex-col justify-center text-left sm:text-right">
          //         {props.value > 0 ?
          //           <>
          //             {/*<span className="font-medium">{numberFormat(Math.floor(props.value / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0.00')}</span>*/}
          //             <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.value * 100 / props.row.original.delegator_shares, '0,0.000')}%</span>
          //           </>
          //           :
          //           <span className="text-gray-400 dark:text-gray-600">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="flex flex-col justify-center space-y-1">
          //         {/*<div className="skeleton w-16 h-4 ml-0 sm:ml-auto" />*/}
          //         <div className="skeleton w-8 h-4 ml-0 sm:ml-auto" />
          //       </div>
          //   ),
          //   headerClassName: 'min-w-max justify-start sm:justify-end text-left sm:text-right',
          // },
          // {
          //   Header: 'Commission',
          //   accessor: 'commission.commission_rates.rate',
          //   sortType: (rowA, rowB) => Number(rowA.original.commission.commission_rates.rate) > Number(rowB.original.commission.commission_rates.rate) ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <div className="text-right">
          //         {!isNaN(props.value) ?
          //           <span>{numberFormat(props.value * 100, '0,0.00')}%</span>
          //           :
          //           <span className="text-gray-400 dark:text-gray-600">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="skeleton w-8 h-4 ml-auto" />
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: (
          //     <span className="flex items-center space-x-1">
          //       <span>Uptime</span>
          //       <span>{numberFormat(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS), '0,0')}</span>
          //       <FiBox size={16} className="stroke-current" />
          //     </span>
          //   ),
          //   accessor: 'uptime',
          //   sortType: (rowA, rowB) => rowA.original.uptime > rowB.original.uptime ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton && typeof props.value === 'number' ?
          //       <>
          //         {props.value > 0 ?
          //           <div className="w-44 mt-0.5 ml-auto">
          //             <ProgressBarWithText
          //               width={props.value}
          //               text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
          //                 {numberFormat(props.value, '0,0.00')}%
          //               </div>}
          //               color="bg-green-500 dark:bg-green-600 rounded"
          //               backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
          //               className={`h-4 flex items-center justify-${props.value < 20 ? 'start' : 'end'}`}
          //             />
          //           </div>
          //           :
          //           <div className="w-44 text-gray-400 dark:text-gray-600 text-right ml-auto">No Uptime</div>
          //         }
          //         {typeof props.row.original.start_height === 'number' && (
          //           <div className="text-3xs text-right space-x-1 mt-1.5">
          //             <span className="text-gray-400 dark:text-gray-500 font-medium">Validator Since Block:</span>
          //             <span className="text-gray-600 dark:text-gray-400 font-semibold">{numberFormat(props.row.original.start_height, '0,0')}</span>
          //           </div>
          //         )}
          //       </>
          //       :
          //       <>
          //         <div className="skeleton w-44 h-4 mt-0.5 ml-auto" />
          //         <div className="skeleton w-24 h-3.5 mt-1.5 ml-auto" />
          //       </>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: (
          //     <span className="flex items-center space-x-1">
          //       <span>Heartbeat</span>
          //       <span>{numberFormat(Number(process.env.NEXT_PUBLIC_NUM_HEARTBEAT_BLOCKS), '0,0')}</span>
          //       <FiBox size={16} className="stroke-current" />
          //     </span>
          //   ),
          //   accessor: 'heartbeats_uptime',
          //   sortType: (rowA, rowB) => rowA.original.heartbeats_uptime > rowB.original.heartbeats_uptime ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton && typeof props.value === 'number' ?
          //       <>
          //         {props.value > 0 ?
          //           <div className="w-44 mt-0.5 ml-auto">
          //             <ProgressBarWithText
          //               width={props.value}
          //               text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
          //                 {numberFormat(props.value, '0,0.00')}%
          //               </div>}
          //               color="bg-green-500 dark:bg-green-600 rounded"
          //               backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
          //               className={`h-4 flex items-center justify-${props.value < 20 ? 'start' : 'end'}`}
          //             />
          //           </div>
          //           :
          //           <div className="w-44 text-gray-400 dark:text-gray-600 text-right ml-auto">No Heartbeat</div>
          //         }
          //         {typeof props.row.original.start_proxy_height === 'number' && (
          //           <div className="text-3xs text-right space-x-1 mt-1.5">
          //             <span className="text-gray-400 dark:text-gray-500 font-medium">Proxy Registered Block:</span>
          //             <span className="text-gray-600 dark:text-gray-400 font-semibold">{numberFormat(props.row.original.start_proxy_height, '0,0')}</span>
          //           </div>
          //         )}
          //       </>
          //       :
          //       <>
          //         <div className="skeleton w-44 h-4 mt-0.5 ml-auto" />
          //         <div className="skeleton w-24 h-3.5 mt-1.5 ml-auto" />
          //       </>
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: 'Supported',
          //   accessor: 'supported_chains',
          //   sortType: (rowA, rowB) => rowA.original.supported_chains?.length > rowB.original.supported_chains?.length ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton && props.value ?
          //       <div className="text-right">
          //         {props.value.length > 0 ?
          //           <div className="flex flex-wrap items-center justify-end">
          //             {props.value.map((_chain, i) => (
          //               chainImage(_chain) ?
          //                 <img
          //                   key={i}
          //                   alt={chainName(_chain)}
          //                   src={chainImage(_chain)}
          //                   className="w-6 h-6 rounded-full mb-1 ml-1"
          //                 />
          //                 :
          //                 <span key={i} className="max-w-min bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-gray-200 text-xs font-semibold mb-1 ml-1 px-1.5 py-0.5">
          //                   {chainName(_chain)}
          //                 </span>
          //             ))}
          //           </div>
          //           :
          //           <span className="text-gray-400 dark:text-gray-600 mr-2">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="flex flex-wrap items-center justify-end">
          //         {[...Array(3).keys()].map(i => (
          //           <div key={i} className="skeleton w-6 h-6 rounded-full mb-1 ml-1" />
          //         ))}
          //       </div>
          //   ),
          //   headerClassName: 'min-w-max justify-end text-right',
          // },
          // {
          //   Header: 'Status',
          //   accessor: 'status',
          //   sortType: (rowA, rowB) => rowA.original.status > rowB.original.status ? 1 : -1,
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <div className="text-right">
          //         {props.value ?
          //           <>
          //             <span className={`bg-${props.value.includes('UN') ? props.value.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded-xl capitalize text-white font-semibold px-2 py-1`}>
          //               {props.value.replace('BOND_STATUS_', '')}
          //             </span>
          //             {/*props.row.original.jailed_until > 0 && (
          //               <div className="text-3xs text-right space-y-1 mt-2">
          //                 <div className="text-gray-400 dark:text-gray-600 font-medium">Latest Jailed Until</div>
          //                 <div className="text-gray-600 dark:text-gray-400 font-semibold">{moment(props.row.original.jailed_until).format('MMM D, YYYY h:mm:ss A')}</div>
          //               </div>
          //             )*/}
          //             {props.row.original.illegible && props.row.original.tss_illegibility_info && (
          //               <div className="flex flex-col items-end space-y-1.5 mt-2">
          //                 {Object.entries(props.row.original.tss_illegibility_info).filter(([key, value]) => value).map(([key, value]) => (
          //                   <span key={key} className="max-w-min bg-gray-100 dark:bg-gray-700 rounded-xl capitalize text-gray-800 dark:text-gray-200 text-xs font-semibold px-1.5 py-0.5">
          //                     {getName(key)}
          //                   </span>
          //                 ))}
          //               </div>
          //             )}
          //             {props.row.original.deregistering && (
          //               <div className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-2">
          //                 (De-registering)
          //               </div>
          //             )}
          //           </>
          //           :
          //           <span className="text-gray-400 dark:text-gray-600">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="skeleton w-24 h-6 ml-auto" />
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
          // {
          //   Header: 'Jailed',
          //   accessor: 'jailed',
          //   disableSortBy: true,
          //   Cell: props => (
          //     !props.row.original.skeleton ?
          //       <div className="text-right">
          //         {props.row.original.tombstoned ?
          //           <span className="bg-red-600 rounded-xl capitalize text-white font-semibold px-2 py-1">
          //             Tombstoned
          //           </span>
          //           :
          //           props.value ?
          //             <span className="bg-red-600 rounded-xl capitalize text-white font-semibold px-2 py-1">
          //               Jailed
          //             </span>
          //             :
          //             <span className="text-gray-400 dark:text-gray-600">-</span>
          //         }
          //       </div>
          //       :
          //       <div className="skeleton w-16 h-6 ml-auto" />
          //   ),
          //   headerClassName: 'justify-end text-right',
          // },
        ]}
        data={height && snapshot?.height === height ?
          snapshot.data?.map((validator, i) => { return { ...validator, i } }) || []
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={snapshot?.data ? snapshot.data.length <= 10 : true}
        defaultPageSize={100}
      />
      {snapshot && snapshot?.data?.length < 1 && (
        <div className="bg-white dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2">
          No Validators
        </div>
      )}
    </div>
  )
}