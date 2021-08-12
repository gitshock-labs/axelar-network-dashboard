import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function DelegationsTable({ data }) {
  return (
    <Datatable
      columns={[
        {
          Header: 'Address',
          accessor: 'address',
          disableSortBy: true,
          Cell: props => (
            !props.row.original.skeleton ?
              <div className="flex items-center space-x-1">
                <span className="font-medium">{ellipseAddress(props.value)}</span>
                <Copy text={props.value} />
              </div>
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
                  <span className="uppercase font-medium">{props.row.original.symbol}</span>
                </span>
                :
                '-'
              :
              <div className="skeleton w-16 h-4" />
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