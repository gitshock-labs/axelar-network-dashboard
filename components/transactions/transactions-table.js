import Link from 'next/link'
import { useState, useEffect } from 'react'

import moment from 'moment'
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'

import Datatable from '../datatable'
import Copy from '../copy'

import { transactions as getTransactions } from '../../lib/api/opensearch'
import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function TransactionsTable({ data, noLoad, page }) {
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getTransactions({ size: 250, sort: [{ timestamp: 'desc' }] })

      if (response) {
        setTransactions({ data: response.data || [] })
      }
    }

    if (data) {
      setTransactions(data)
    }
    else if (!noLoad) {
      getData()
    }

    if (!noLoad) {
      const interval = setInterval(() => getData(), 1 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [data])

  return (
    <Datatable
      columns={[
        {
          Header: 'Tx Hash',
          accessor: 'txhash',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="flex items-center space-x-1 mb-4">
                <Link href={`/tx/${props.value}`}>
                  <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                    {ellipseAddress(props.value)}
                  </a>
                </Link>
                <Copy text={props.value} />
              </div>
              :
              <div className="skeleton w-48 h-4 mb-4" />
          ),
        },
        {
          Header: 'Height',
          accessor: 'height',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <Link href={`/blocks/${props.value}`}>
                <a className="text-blue-600 dark:text-blue-400">
                  {props.value}
                </a>
              </Link>
              :
              <div className="skeleton w-16 h-4" />
          ),
        },
        {
          Header: 'Action',
          accessor: 'type',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              props.value ?
                <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-2 py-1">
                  {getName(props.value)}
                </span>
                :
                '-'
              :
              <div className="skeleton w-12 h-4" />
          ),
        },
        {
          Header: 'Status',
          accessor: 'status',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="flex items-center space-x-1">
                {props.value === 'success' ?
                  <FaCheckCircle size={16} className="text-green-500" />
                  :
                  props.value === 'pending' ?
                    <FaClock size={16} className="text-gray-500" />
                    :
                    <FaTimesCircle size={16} className="text-red-500" />
                }
                <span className="capitalize">{props.value}</span>
              </div>
              :
              <div className="skeleton w-16 h-4" />
          ),
        },
        // {
        //   Header: 'Value',
        //   accessor: 'value',
        //   disableSortBy: true,
        //   Cell: props => (
        //     !props.row.original.skeleton ?
        //       <div className="text-right">
        //         {typeof props.value === 'number' ?
        //           <span className="flex items-center justify-end space-x-1">
        //             <span>{numberFormat(props.value, '0,0.00000000')}</span>
        //             <span className="uppercase font-medium">{props.row.original.symbol}</span>
        //           </span>
        //           :
        //           '-'
        //         }
        //       </div>
        //       :
        //       <div className="skeleton w-16 h-4 ml-auto" />
        //   ),
        //   headerClassName: 'justify-end text-right',
        // },
        {
          Header: 'Fee',
          accessor: 'fee',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="text-right">
                {typeof props.value === 'number' ?
                  <span className="flex items-center justify-end space-x-1">
                    <span>{props.value ? numberFormat(props.value, '0,0.00000000') : 'No Fee'}</span>
                    {props.value > 0 && (
                      <span className="uppercase font-medium">{props.row.original.symbol}</span>
                    )}
                  </span>
                  :
                  '-'
                }
              </div>
              :
              <div className="skeleton w-16 h-4 ml-auto" />
          ),
          headerClassName: 'justify-end text-right',
        },
        {
          Header: 'Vote',
          accessor: 'vote',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <span className={`${props.value === 'approved' ? 'bg-green-500' : 'bg-red-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                {props.value}
              </span>
              :
              <div className="skeleton w-12 h-4" />
          ),
        },
        {
          Header: 'Time',
          accessor: 'timestamp',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="text-right">
                <span className="text-gray-400 dark:text-gray-600">
                  {Number(moment().diff(moment(props.value), 'second')) > 59 ?
                    moment(props.value).fromNow()
                    :
                    <>{moment().diff(moment(props.value), 'second')}s ago</>
                  }
                </span>
              </div>
              :
              <div className="skeleton w-32 h-4 ml-auto" />
          ),
          headerClassName: 'justify-end text-right',
        },
      ].filter(column => ['blocks'].includes(page) ? !(['height', 'vote'].includes(column.accessor)) : ['index'].includes(page) ? !(['height', 'fee', 'vote'].includes(column.accessor)) : ['validator'].includes(page) ? !(['type', 'status', 'value', 'fee'].includes(column.accessor)) : !(['vote'].includes(column.accessor)))}
      data={transactions ?
        transactions.data.map((transaction, i) => { return { ...transaction, i } })
        :
        [...Array(!page ? 25 : 10).keys()].map(i => { return { i, skeleton: true } })
      }
      defaultPageSize={!page ? 50 : 10}
    />
  )
}