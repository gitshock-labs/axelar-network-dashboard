import _ from 'lodash'
import moment from 'moment'
import { Img } from 'react-image'

import Datatable from '../datatable'
import Copy from '../copy'

import { chainName, chainImage } from '../../lib/object/chain'
import { numberFormat, ellipseAddress, randImage } from '../../lib/utils'

export default function TransfersTable({ data, className = '' }) {
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
                <div className="skeleton w-4 h-4 my-1" />
            ),
          },
          {
            Header: 'Asset',
            accessor: 'asset_name',
            sortType: (rowA, rowB) => rowA.original.asset_name > rowB.original.asset_name ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className={`min-w-max flex items-start space-x-2 my-1`}>
                  <img
                    src={props.row.original.asset_image || randImage(props.row.original.i)}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {props.value}
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="uppercase text-gray-400 dark:text-gray-500 font-medium">
                        {props.row.original.asset_symbol}
                      </span>
                    </span>
                  </div>
                </div>
                :
                <div className="flex items-start space-x-2 my-1">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-1.5">
                    <div className="skeleton w-20 h-4" />
                    <div className="skeleton w-12 h-4" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Token Address',
            accessor: 'token_address',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="my-1">
                  {props.value ?
                    <span className="flex items-center space-x-1 my-1">
                      <span className="text-gray-600 dark:text-gray-400">{ellipseAddress(props.value, 10)}</span>
                      <Copy text={props.value} />
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-36 h-5 my-1" />
            ),
          },
          {
            Header: 'From Chain',
            accessor: 'chain_name',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max flex items-center space-x-2 my-1">
                  <img
                    src={props.row.original.chain_image || randImage(props.row.original.i)}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {props.value}
                    </span>
                  </div>
                </div>
                :
                <div className="flex items-center space-x-2 my-1">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-1.5">
                    <div className="skeleton w-20 h-4" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'To Chain',
            accessor: 'chain',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max h-6 flex items-center space-x-2 my-1">
                  <Img
                    src={(['ConfirmERC20Deposit'].includes(props.row.original.transfer_action) ? chainImage('axelarnet') : null)}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {['ConfirmERC20Deposit'].includes(props.row.original.transfer_action) ? chainName('axelarnet') : 'EVM Chains'}
                    </span>
                  </div>
                </div>
                :
                <div className="flex items-center space-x-2 my-1">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-1.5">
                    <div className="skeleton w-20 h-4" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Transactions',
            accessor: 'tx',
            sortType: (rowA, rowB) => rowA.original.tx > rowB.original.tx ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right my-1">
                  {props.value ?
                    <span className="font-mono">
                      {numberFormat(props.value, '0,0')}
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-5 my-1 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Volume',
            accessor: 'amount',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right my-1">
                  {props.value ?
                    <span className="space-x-1.5">
                      <span className="font-mono">{numberFormat(props.value, props.value >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                      <span className="uppercase text-gray-400 dark:text-gray-400">{props.row.original.asset_symbol}</span>
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-5 my-1 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Avg. Size',
            accessor: 'avg_amount',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right my-1">
                  {props.value ?
                    <span className="space-x-1.5">
                      <span className="font-mono">{numberFormat(props.value, props.value >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                      <span className="uppercase text-gray-400 dark:text-gray-400">{props.row.original.asset_symbol}</span>
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-5 my-1 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'First Seen',
            accessor: 'since',
            sortType: (rowA, rowB) => rowA.original.since > rowB.original.since ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right my-1">
                  {props.value > -1 ?
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      {moment(props.value).format('MMM D, YYYY h:mm:ss A z')}
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-5 my-1 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={data ?
          data.data?.map((key, i) => { return { ...key, i } })
          :
          [...Array(10).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={data?.data?.length > 10 ? false : true}
        defaultPageSize={100}
        className={`no-border ${className}`}
      />
      {data && !(data.data?.length > 0) && (
        <div className="bg-white dark:bg-gray-900 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2">
          No Transfers Found
        </div>
      )}
    </>
  )
}