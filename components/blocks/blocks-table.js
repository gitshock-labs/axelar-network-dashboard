import Link from 'next/link'
import { useState, useEffect } from 'react'

import _ from 'lodash'

import Datatable from '../../components/datatable'
import { ProgressBarWithText } from '../../components/progress-bars'
import Copy from '../../components/copy'

import { getBlocks } from '../../lib/api/query'
import { generateUrl, numberFormat, ellipseAddress } from '../../lib/utils'

export default function BlocksTable() {
  const [blocks, setBlocks] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getBlocks()

      if (response) {
        setBlocks({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <Datatable
        columns={[
          {
            Header: 'Height',
            accessor: 'height',
            disableSortBy: true,
            Cell: props => (
              !!props.row.original.skeleton ?
                <Link href={`/blocks/${props.value}`}>
                  <a className="text-blue-600 dark:text-blue-400 font-medium">
                    {props.value}
                  </a>
                </Link>
                :
                <div className="skeleton w-16 h-3" />
            ),
          },
          {
            Header: 'Block Hash',
            accessor: 'hash',
            disableSortBy: true,
            Cell: props => (
              !!props.row.original.skeleton ?
                <Link href={`/blocks/${props.row.original.height}`}>
                  <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                    {ellipseAddress(props.value)}
                  </a>
                </Link>
                :
                <div className="skeleton w-48 h-3" />
            ),
          },
          {
            Header: 'Proposer',
            accessor: 'proposer.name',
            sortType: (rowA, rowB) => rowA.original.voting_power > rowB.original.voting_power ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex flex-col justify-center text-left sm:text-right">
                  {props.value > -1 ?
                    <>
                      <span className="font-medium">{numberFormat(props.value, '0,0')}</span>
                      <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.row.original.voting_power_percentage, `0,0.000${Math.abs(props.row.original.voting_power_percentage) < 0.001 ? '000' : ''}`)}%</span>
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="flex flex-col justify-center space-y-1">
                  <div className="skeleton w-20 h-4 ml-0 sm:ml-auto" />
                  <div className="skeleton w-8 h-3 ml-0 sm:ml-auto" />
                </div>
            ),
            headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
          },
          {
            Header: 'Commission',
            accessor: 'commission_percenteage',
            sortType: (rowA, rowB) => rowA.original.commission_percenteage > rowB.original.commission_percenteage ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > -1 ?
                    <span>{numberFormat(props.value, '0,0.00')}%</span>
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
            Header: 'Uptime',
            accessor: 'uptime',
            sortType: (rowA, rowB) => rowA.original.uptime > rowB.original.uptime ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value > -1 ?
                  <div className="w-56 mt-0.5 ml-auto">
                    <ProgressBarWithText
                      width={props.value}
                      text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
                        {numberFormat(props.value, '0,0.00')}%
                      </div>}
                      color="bg-green-500 dark:bg-green-600 rounded"
                      backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
                      className={`h-4 flex items-center justify-${props.value < 20 ? 'start' : 'end'}`}
                    />
                  </div>
                  :
                  <div className="w-56 text-right ml-auto">-</div>
                :
                <div className="skeleton w-56 h-4 rounded mt-0.5 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={blocks ?
          blocks.data.map((block, i) => { return { ...block, i } })
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={true}
        defaultPageSize={100}
      />
    </div>
  )
}