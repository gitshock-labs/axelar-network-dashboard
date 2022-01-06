import Link from 'next/link'

import _ from 'lodash'

import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, getName, ellipseAddress } from '../../lib/utils'

export default function VotesTable({ data, className = '' }) {
  return (
    <>
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: (rowA, rowB) => rowA.original.i > rowB.original.i ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="my-1">
                  {numberFormat((props.flatRows?.indexOf(props.row) > -1 ? props.flatRows.indexOf(props.row) : props.value) + 1, '0,0')}
                </div>
                :
                <div className="skeleton w-4 h-4 my-0.5" />
            ),
          },
          {
            Header: 'Voter',
            accessor: 'voter',
            sortType: (rowA, rowB) => rowA.original.voter > rowB.original.voter ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max flex items-center space-x-2 my-1">
                  <div className="flex flex-col">
                    <span className="flex items-center space-x-1">
                      <Link href={`/account/${props.value}`}>
                        <a className="text-blue-600 dark:text-white">
                          {ellipseAddress(props.value, 16)}
                        </a>
                      </Link>
                      <Copy text={props.value} />
                    </span>
                  </div>
                </div>
                :
                <div className="flex items-start space-x-2 my-0.5">
                  <div className="flex flex-col space-y-1.5">
                    <div className="skeleton w-24 h-4" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Vote',
            accessor: 'option',
            sortType: (rowA, rowB) => rowA.original.status > rowB.original.status ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right my-1">
                  {props.value ?
                    <span className={`bg-${['YES'].includes(props.value) ? 'green-600 dark:bg-green-700' : ['NO'].includes(props.value) ? 'red-600 dark:bg-red-700' : 'gray-400 dark:bg-gray-900'} rounded-xl capitalize text-white font-semibold px-2 py-1`}>
                      {props.value?.replace('_', ' ')}
                    </span>
                    :
                    <span className="text-gray-400 dark:text-gray-600">-</span>
                  }
                </div>
                :
                <div className="skeleton w-24 h-6 my-0.5 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={data ?
          data.map((vote, i) => { return { ...vote, i } })
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={data ? data.length <= 10 : true}
        defaultPageSize={100}
        className="small no-border mt-2"
      />
      {data?.length < 1 && (
        <div className="bg-white dark:bg-gray-900 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2">
          No Votes
        </div>
      )}
    </>
  )
}