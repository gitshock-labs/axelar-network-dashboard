import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function DelegationsTable({ data }) {
  return (
    <Datatable
      columns={[
        {
          Header: 'Address',
          accessor: 'delegator_address',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              props.value ?
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{ellipseAddress(props.value)}</span>
                  <Copy text={props.value} />
                  {props.row.original.self && (
                    <span className="bg-indigo-600 rounded-full capitalize text-white font-semibold px-2 py-0.5">
                      Self
                    </span>
                  )}
                </div>
                :
                '-'
              :
              <div className="skeleton w-48 h-4" />
          ),
        },
        {
          Header: 'Amount',
          accessor: 'amount',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              typeof props.value === 'number' ?
                <span className="flex items-center space-x-1">
                  <span>{numberFormat(props.value, '0,0.00000000')}</span>
                  {props.row.original.denom && (
                    <span className="uppercase font-medium">{props.row.original.denom}</span>
                  )}
                </span>
                :
                '-'
              :
              <div className="skeleton w-16 h-4" />
          ),
        },
      ]}
      data={data ?
        data.map((key, i) => { return { ...key, i } })
        :
        [...Array(10).keys()].map(i => { return { i, skeleton: true } })
      }
      noPagination={data && data.length <= 10}
      defaultPageSize={10}
    />
  )
}