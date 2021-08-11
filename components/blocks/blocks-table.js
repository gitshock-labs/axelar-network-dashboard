import Link from 'next/link'
import { useState, useEffect } from 'react'

import moment from 'moment'

import Datatable from '../datatable'
import Copy from '../copy'

import { getBlocks } from '../../lib/api/query'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function BlocksTable({ n }) {
  const [blocks, setBlocks] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getBlocks()

      if (response) {
        setBlocks({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Datatable
      columns={[
        {
          Header: 'Height',
          accessor: 'height',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <Link href={`/blocks/${props.value}`}>
                <a className="text-blue-600 dark:text-blue-400 font-medium">
                  {props.value}
                </a>
              </Link>
              :
              <div className="skeleton w-16 h-4" />
          ),
        },
        {
          Header: 'Block Hash',
          accessor: 'hash',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <Link href={`/blocks/${props.row.original.height}`}>
                <a className="uppercase font-medium">
                  {ellipseAddress(props.value)}
                </a>
              </Link>
              :
              <div className="skeleton w-48 h-4" />
          ),
        },
        {
          Header: 'Proposer',
          accessor: 'proposer.name',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="min-w-max flex items-start space-x-2">
                <Link href={`/validator/${props.row.original.proposer.key}`}>
                  <a>
                    <img
                      src={props.row.original.proposer.image}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  </a>
                </Link>
                <div className="flex flex-col">
                  <Link href={`/validator/${props.row.original.proposer.key}`}>
                    <a className="text-blue-600 dark:text-blue-400 font-medium">
                      {props.value || props.row.original.proposer.key}
                    </a>
                  </Link>
                  <span className="flex items-center space-x-1">
                    <span className="font-light">{ellipseAddress(props.row.original.proposer.key)}</span>
                    <Copy text={props.row.original.proposer.key} />
                  </span>
                </div>
              </div>
              :
              <div className="flex items-start space-x-2">
                <div className="skeleton w-6 h-6 rounded-full" />
                <div className="flex flex-col space-y-1.5">
                  <div className="skeleton w-24 h-4" />
                  <div className="skeleton w-32 h-3" />
                </div>
              </div>
          ),
        },
        {
          Header: 'Txs',
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
        },
      ]}
      data={blocks ?
        blocks.data.filter((block, i) => !n || i < n).map((block, i) => { return { ...block, i } })
        :
        [...Array(n || 25).keys()].map(i => { return { i, skeleton: true } })
      }
      noPagination={true}
      defaultPageSize={100}
    />
  )
}