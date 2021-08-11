import { useState, useEffect } from 'react'

import Datatable from '../datatable'
import Copy from '../copy'

import { getBridgeAccounts } from '../../lib/api/query'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function BridgeTable() {
  const [bridgeAccounts, setBridgeAccounts] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getBridgeAccounts()

      if (response) {
        setBridgeAccounts({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getBridgeAccounts(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                numberFormat(props.value + 1, '0,0')
                :
                <div className="skeleton w-4 h-3" />
            ),
          },
          {
            Header: 'Chain',
            accessor: 'chain',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max flex items-center space-x-2">
                  <img
                    src={props.row.original.image}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{props.value}</span>
                </div>
                :
                <div className="flex items-center space-x-2">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="skeleton w-24 h-4" />
                </div>
            ),
          },
          {
            Header: 'Address',
            accessor: 'address',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <span className="flex items-center space-x-1">
                  <span>{ellipseAddress(props.value)}</span>
                  <Copy text={props.value} />
                </span>
                :
                <div className="skeleton w-48 h-4" />
            ),
          },
          /*{
            Header: 'No. Txs',
            accessor: 'txs',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > -1 ?
                    <span>{numberFormat(props.value, '0,0.00')}</span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-8 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Time',
            accessor: 'time',
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
                <div className="skeleton w-12 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },*/
        ]}
        data={bridgeAccounts ?
          bridgeAccounts.data.map((bridgeAccount, i) => { return { ...bridgeAccount, i } })
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        defaultPageSize={10}
      />
    </div>
  )
}