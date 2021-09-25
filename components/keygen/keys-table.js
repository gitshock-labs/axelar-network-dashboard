import Link from 'next/link'

import { FiKey } from 'react-icons/fi'

import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function KeysTable({ data, address, page }) {
  return (
    <>
      <Datatable
        columns={[
          {
            Header: 'Key ID',
            accessor: 'key_id',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex items-center text-gray-900 dark:text-gray-100 space-x-1">
                  <FiKey size={16} />
                  <span className="font-medium">{ellipseAddress(props.value)}</span>
                  <Copy text={props.value} />
                </div>
                :
                <div className="skeleton w-48 h-4" />
            ),
          },
          {
            Header: 'Key Chain',
            accessor: 'key_chain',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                    {props.value}
                  </span>
                  :
                  '-'
                :
                <div className="skeleton w-12 h-4" />
            ),
          },
          {
            Header: 'Key Role',
            accessor: 'key_role',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                    {props.value.replace('KEY_ROLE_', '')}
                  </span>
                  :
                  '-'
                :
                <div className="skeleton w-12 h-4" />
            ),
          },
          {
            Header: 'Block',
            accessor: 'snapshot_block_number',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div>
                  <Link href={`/blocks/${props.value}`}>
                    <a className="text-blue-600 dark:text-blue-400">
                      {props.value}
                    </a>
                  </Link>
                </div>
                :
                <div className="skeleton w-16 h-4" />
            ),
          },
          {
            Header: 'Share',
            accessor: 'num_validator_shares',
            sortType: (rowA, rowB) => rowA.original.num_validator_shares > rowB.original.num_validator_shares ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right space-x-1">
                  <span>{numberFormat(props.value, '0,0')}</span>
                  <span>/</span>
                  <span>{numberFormat(props.row.original.num_total_shares, '0,0')}</span>
                </div>
                :
                <div className="skeleton w-12 h-4 ml-auto" />
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
        ].filter(column => ['validator'].includes(page) ? !(['validators', 'shares'].includes(column.accessor)) : !(['share'].includes(column.accessor)))}
        data={data ?
          data.data.map((key, i) => { return { ...key, i } })
          :
          [...Array(10).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={data && data.length > 10 ? false : true}
        defaultPageSize={10}
      />
      {data && !(data.data && data.data.length > 0) && (
        <div className={`bg-${['validator'].includes(page) ? 'gray-50' : 'white'} dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2`}>
          No Keys
        </div>
      )}
    </>
  )
}