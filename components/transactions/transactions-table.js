import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'

import Datatable from '../datatable'
import Copy from '../copy'

import { transactions as getTransactions } from '../../lib/api/opensearch'
import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

const LATEST_SIZE = 100
const MAX_PAGE = 10

export default function TransactionsTable({ data, noLoad, hasVote, location, className = '' }) {
  const { _data, preferences } = useSelector(state => ({ _data: state.data, preferences: state.preferences }), shallowEqual)
  const { denoms_data } = { ..._data }
  const { theme } = { ...preferences }

  const [page, setPage] = useState(0)
  const [moreLoading, setMoreLoading] = useState(false)
  const [transactions, setTransactions] = useState(null)
  const [actions, setActions] = useState({})
  const [filterActions, setFilterActions] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async isInterval => {
      if (denoms_data) {
        if (!controller.signal.aborted) {
          if (!location && page && !isInterval) {
            setMoreLoading(true)
          }

          let _data, _page = 0

          while (_page <= page) {
            if (!controller.signal.aborted) {
              const response = await getTransactions({ size: location === 'index' ? 10 : LATEST_SIZE, from: _page * (location === 'index' ? 10 : LATEST_SIZE), sort: [{ timestamp: 'desc' }] }, denoms_data)

              _data = _.uniqBy(_.concat(_data || [], response?.data || []), 'txhash')
            }

            _page++
          }

          setTransactions({ data: _data || [] })

          if (!location && page && !isInterval) {
            setMoreLoading(false)
          }
        }
      }
    }

    if (data) {
      setTransactions(data)
    }
    else if (!noLoad) {
      getData()
    }

    if (!noLoad) {
      const interval = setInterval(() => getData(true), (location === 'index' ? 5 : 10) * 1000)
      return () => {
        controller?.abort()
        clearInterval(interval)
      }
    }
  }, [data, page, denoms_data])

  useEffect(() => {
    if (!noLoad && !location && transactions?.data) {
      setActions(_.countBy(_.uniqBy(transactions.data, 'txhash').map(tx => tx.type)))
    }
  }, [transactions])

  return (
    <>
      {!noLoad && !location && (
        <div className="block sm:flex items-center justify-end overflow-x-auto space-x-1 mb-2">
          {Object.entries(actions).map(([key, value]) => (
            <div
              key={key}
              onClick={() => setFilterActions(_.uniq(filterActions.includes(key) ? filterActions.filter(_action => _action !== key) : _.concat(filterActions, key)))}
              className={`max-w-min btn btn-rounded cursor-pointer whitespace-nowrap flex items-center space-x-1.5 bg-trasparent ${filterActions.includes(key) ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100'} ml-1 mb-1 px-2`}
              style={{ textTransform: 'none', fontSize: '.7rem' }}
            >
              <span>{key?.endsWith('Request') ? key.replace('Request', '') : key}</span>
              <span className="text-2xs text-indigo-600 dark:text-indigo-400 font-bold"> {numberFormat(value, '0,0')}</span>
            </div>
          ))}
        </div>
      )}
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
                    <a className="uppercase text-blue-600 dark:text-blue-500 font-medium">
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
                <Link href={`/block/${props.value}`}>
                  <a className="text-blue-600 dark:text-blue-500 font-medium">
                    {numberFormat(props.value, '0,0')}
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
                <div className="skeleton w-28 h-4" />
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
                <div className="skeleton w-20 h-4" />
            ),
          },
          {
            Header: 'Amount',
            accessor: 'value',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {typeof props.value === 'number' ?
                    <span className="flex items-center justify-end space-x-1">
                      <span>{numberFormat(props.value, '0,0.00000000')}</span>
                      <span className="uppercase font-medium">{props.row.original.symbol}</span>
                    </span>
                    :
                    props.row.original.activities?.findIndex(activity => activity.amount/* && activity.symbol*/) > -1 ?
                      props.row.original.activities.filter(activity => activity.amount).map((activity, i) => (
                        <div key={i} className="flex items-center justify-end space-x-1">
                          <span>{numberFormat(activity.amount, '0,0.00000000')}</span>
                          <span className="uppercase font-medium">{ellipseAddress(activity.symbol || activity.denom, 6)}</span>
                        </div>
                      ))
                      :
                      '-'
                  }
                </div>
                :
                <div className="skeleton w-20 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
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
                props.value ?
                  <span className={`${props.value === 'approved' ? 'bg-green-500' : 'bg-red-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                    {props.value}
                  </span>
                  :
                  '-'
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
                <div className="skeleton w-24 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ].filter(column => ['blocks'].includes(location) ? !(['height', 'vote'].includes(column.accessor)) : ['index'].includes(location) ? !(['height', 'value', 'fee', 'vote'].includes(column.accessor)) : ['validator'].includes(location) ? !((hasVote ? ['value', 'fee'] : ['value', 'fee', 'vote']).includes(column.accessor)) : !(['vote'].includes(column.accessor)))}
        data={transactions ?
          transactions.data?.filter(tx => !(!noLoad && !location) || !(filterActions?.length > 0) || filterActions.includes(tx.type)).map((transaction, i) => { return { ...transaction, i } })
          :
          [...Array(!location ? 25 : 10).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={(!location && !noLoad) || ['index'].includes(location)}
        defaultPageSize={!location ? LATEST_SIZE > 100 ? 50 : 50 : 10}
        className={`${(!location && !noLoad) || ['index'].includes(location) ? 'min-h-full' : ''} ${className}`}
      />
      {transactions && !(transactions.data?.length > 0) && (
        <div className={`bg-${!location ? 'white' : 'gray-50'} dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2`}>
          No Transactions
        </div>
      )}
      {!location && !noLoad && transactions?.data?.length >= LATEST_SIZE * (page + 1) && page < MAX_PAGE && (
        <div
          onClick={() => setPage(page + 1)}
          className="btn btn-default btn-rounded max-w-max bg-trasparent bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-white font-semibold mt-4 mx-auto"
        >
          Load More
        </div>
      )}
      {moreLoading && (
        <div className="flex justify-center mt-4">
          <Loader type="ThreeDots" color={theme === 'dark' ? 'white' : '#D1D5DB'} width="32" height="32" />
        </div>
      )}
    </>
  )
}