import Link from 'next/link'

import { FiKey } from 'react-icons/fi'
import moment from 'moment'

import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function KeysTable({ data }) {
  return (
    <Datatable
      columns={[
        {
          Header: 'Generated Key',
          accessor: 'key',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="flex items-center space-x-1">
                <FiKey size={16} />
                <span className="font-medium">{ellipseAddress(props.value)}</span>
                <Copy text={props.value} />
              </div>
              :
              <div className="skeleton w-48 h-4" />
          ),
        },
        {
          Header: 'Time',
          accessor: 'time',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="text-right">
                <span className="text-gray-400 dark:text-gray-600">
                  {moment(props.value).format('MMM D, YYYY h:mm:ss A')}
                </span>
              </div>
              :
              <div className="skeleton w-48 h-4 ml-auto" />
          ),
          headerClassName: 'justify-end text-right',
        },
        {
          Header: 'Block',
          accessor: 'block',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="text-right">
                <Link href={`/blocks/${props.value}`}>
                  <a className="text-blue-600 dark:text-blue-400">
                    {props.value}
                  </a>
                </Link>
              </div>
              :
              <div className="skeleton w-16 h-4 ml-auto" />
          ),
          headerClassName: 'justify-end text-right',
        },
        {
          Header: 'Participated Validators',
          accessor: 'validators',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="flex flex-col space-y-2 mb-4">
                {props.value && props.value.length > 0 ?
                  props.value.map((validator, i) => (
                    <div key={i} className="flex items-center text-xs space-x-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{validator.key}</span>
                      <span>[{validator.share}]</span>
                    </div>
                  ))
                  :
                  '-'
                }
              </div>
              :
              <div className="flex flex-col space-y-2 mb-4">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="skeleton w-48 h-4" />
                ))}
              </div>
          ),
        },
      ]}
      data={data ?
        data.data.map((key, i) => { return { ...key, i } })
        :
        [...Array(10).keys()].map(i => { return { i, skeleton: true } })
      }
      defaultPageSize={10}
    />
  )
}