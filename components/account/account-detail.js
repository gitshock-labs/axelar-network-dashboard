import _ from 'lodash'

import Widget from '../widget'
import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function AccountDetail({ data }) {
  return (
    <Widget
      title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Balances</span>}
      description={data ?
        <span>
          {data.balances && data.balances[0] && data.balances[0].currency}
          {numberFormat(_.sumBy(data.balances, 'quote'), `0,0.000${Math.abs(_.sumBy(data.balances, 'quote')) < 0.001 ? '000' : ''}`)}
        </span>
        :
        <div className="skeleton w-20 h-3 mt-1" />
      }
    >
      <Datatable
        columns={[
          {
            Header: '#',
            accessor: 'i',
            sortType: (rowA, rowB) => rowA.original.i > rowB.original.i ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                numberFormat(props.value + 1, '0,0')
                :
                <div className="skeleton w-4 h-3" />
            ),
          },
          {
            Header: 'Coin',
            accessor: 'name',
            sortType: (rowA, rowB) => rowA.original.name > rowB.original.name ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max flex items-start space-x-2">
                  <img
                    src={props.row.original.image}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="flex items-center space-x-1">
                      <span className="font-semibold">{props.value}</span>
                      <span className="uppercase text-gray-400 dark:text-gray-600">{props.row.original.symbol}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="font-light">{ellipseAddress(props.row.original.contract_address)}</span>
                      <Copy text={props.row.original.contract_address} />
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
            Header: 'Balance',
            accessor: 'balance',
            sortType: (rowA, rowB) => rowA.original.quote > rowB.original.quote ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex flex-col justify-center text-left sm:text-right">
                  {props.value > 0 ?
                    <>
                      <span className="font-medium">{numberFormat(props.value, '0,0.00000000')}</span>
                      <span className="text-gray-400 dark:text-gray-600">
                        {props.row.original.currency}
                        {numberFormat(props.row.original.quote, `0,0.000${Math.abs(props.row.original.quote) < 0.001 ? '000' : ''}`)}
                      </span>
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
            Header: 'Price',
            accessor: 'quote_rate',
            sortType: (rowA, rowB) => rowA.original.quote_rate > rowB.original.quote_rate ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > 0 ?
                    <span>{props.row.original.currency}{numberFormat(props.value, '0,0.00000000')}</span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-8 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={data ?
          data.balances.map((balance, i) => { return { ...balance, i } })
          :
          [...Array(5).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={true}
        defaultPageSize={10}
        className="no-border mt-4"
      />
    </Widget>
  )
}