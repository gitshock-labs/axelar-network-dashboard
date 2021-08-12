import Link from 'next/link'

import { FiKey } from 'react-icons/fi'
import moment from 'moment'

import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function KeysTable({ data, address, page }) {
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
                      <Link href={`/validator/${validator.key}`}>
                        <a className="text-blue-600 dark:text-blue-400 font-medium">{validator.key}</a>
                      </Link>
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
        {
          Header: 'Share',
          accessor: 'share',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              props.row.original.validators && props.row.original.validators.length > 0 ?
                props.row.original.validators.filter(validator => validator.key === address).map((validator, i) => (
                  <span key={i}>{validator.share}</span>
                ))
                :
                '-'
              :
              <div className="skeleton w-12 h-4" />
          ),
        },
      ].filter(column => ['validator'].includes(page) ? !(['time', 'block', 'validators'].includes(column.accessor)) : !(['share'].includes(column.accessor)))}
      data={data ?
        data.data.map((key, i) => { return { ...key, i } })
        :
        [...Array(10).keys()].map(i => { return { i, skeleton: true } })
      }
      defaultPageSize={10}
    />
  )
}