import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Widget from '../widget'
import Datatable from '../datatable'
import Copy from '../copy'

import { randImage } from '../../lib/api/query'
import { numberFormat, ellipseAddress } from '../../lib/utils'

const CURRENCY = 'usd'
const CURRENCY_SYMBOL = '$'

export default function AccountDetail({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

  return (
    <>
      {data ?
        <span>
          {data.balances && data.balances[0] && data.balances[0].currency}
          {numberFormat(_.sumBy(data.balances, 'quote'), `0,0.000${Math.abs(_.sumBy(data.balances, 'quote')) < 0.001 ? '000' : ''}`)}
        </span>
        :
        <div className="skeleton w-20 h-3 mt-1" />
      }
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 my-4">
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Balances</span>}
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
                accessor: 'denom',
                sortType: (rowA, rowB) => rowA.original.denom > rowB.original.denom ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.row.original.contract_address ? 'start' : 'center'} space-x-2`}>
                      <img
                        src={props.row.original.image || randImage(props.row.original.i)}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{props.value}</span>
                          {props.row.original.symbol && (
                            <span className="uppercase text-gray-400 dark:text-gray-600">{props.row.original.symbol}</span>
                          )}
                        </span>
                        {props.row.original.contract_address && (
                          <span className="flex items-center space-x-1">
                            <span className="font-light">{ellipseAddress(props.row.original.contract_address)}</span>
                            <Copy text={props.row.original.contract_address} />
                          </span>
                        )}
                        {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.value && (
                          <span className="text-gray-400 dark:text-gray-600">
                            {CURRENCY_SYMBOL}
                            {numberFormat(chain_data.coin[CURRENCY], '0,0.00000000')}
                          </span>
                        )}
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
                accessor: 'amount',
                sortType: (rowA, rowB) => rowA.original.amount > rowB.original.amount ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className="flex flex-col justify-center text-left sm:text-right">
                      {props.value > -1 ?
                        <>
                          <span className="font-medium">{numberFormat(props.value, '0,0.00000000')}</span>
                          {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.row.original.denom && (
                            <span className="text-gray-400 dark:text-gray-600">
                              {CURRENCY_SYMBOL}
                              {numberFormat(props.value * chain_data.coin[CURRENCY], '0,0.00000000')}
                            </span>
                          )}
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
            ]}
            data={data ?
              (data.balances && data.balances.map((balance, i) => { return { ...balance, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data && data.balances && data.balances.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
        </Widget>
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Rewards</span>}
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
                accessor: 'denom',
                sortType: (rowA, rowB) => rowA.original.denom > rowB.original.denom ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.row.original.contract_address ? 'start' : 'center'} space-x-2`}>
                      <img
                        src={props.row.original.image || randImage(props.row.original.i)}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{props.value}</span>
                          {props.row.original.symbol && (
                            <span className="uppercase text-gray-400 dark:text-gray-600">{props.row.original.symbol}</span>
                          )}
                        </span>
                        {props.row.original.contract_address && (
                          <span className="flex items-center space-x-1">
                            <span className="font-light">{ellipseAddress(props.row.original.contract_address)}</span>
                            <Copy text={props.row.original.contract_address} />
                          </span>
                        )}
                        {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.value && (
                          <span className="text-gray-400 dark:text-gray-600">
                            {CURRENCY_SYMBOL}
                            {numberFormat(chain_data.coin[CURRENCY], '0,0.00000000')}
                          </span>
                        )}
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
                Header: 'Amount',
                accessor: 'amount',
                sortType: (rowA, rowB) => rowA.original.amount > rowB.original.amount ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className="flex flex-col justify-center text-left sm:text-right">
                      {props.value > -1 ?
                        <>
                          <span className="font-medium">{numberFormat(props.value, '0,0.00000000')}</span>
                          {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.row.original.denom && (
                            <span className="text-gray-400 dark:text-gray-600">
                              {CURRENCY_SYMBOL}
                              {numberFormat(props.value * chain_data.coin[CURRENCY], '0,0.00000000')}
                            </span>
                          )}
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
            ]}
            data={data ?
              (data.rewards && data.rewards.rewards && data.rewards.rewards.map((reward, i) => { return { ...reward, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data && data.rewards && data.rewards.rewards && data.rewards.rewards.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
        </Widget>
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Commissions</span>}
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
                accessor: 'denom',
                sortType: (rowA, rowB) => rowA.original.denom > rowB.original.denom ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.row.original.contract_address ? 'start' : 'center'} space-x-2`}>
                      <img
                        src={props.row.original.image || randImage(props.row.original.i)}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{props.value}</span>
                          {props.row.original.symbol && (
                            <span className="uppercase text-gray-400 dark:text-gray-600">{props.row.original.symbol}</span>
                          )}
                        </span>
                        {props.row.original.contract_address && (
                          <span className="flex items-center space-x-1">
                            <span className="font-light">{ellipseAddress(props.row.original.contract_address)}</span>
                            <Copy text={props.row.original.contract_address} />
                          </span>
                        )}
                        {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.value && (
                          <span className="text-gray-400 dark:text-gray-600">
                            {CURRENCY_SYMBOL}
                            {numberFormat(chain_data.coin[CURRENCY], '0,0.00000000')}
                          </span>
                        )}
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
                Header: 'Amount',
                accessor: 'amount',
                sortType: (rowA, rowB) => rowA.original.amount > rowB.original.amount ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className="flex flex-col justify-center text-left sm:text-right">
                      {props.value > -1 ?
                        <>
                          <span className="font-medium">{numberFormat(props.value, '0,0.00000000')}</span>
                          {chain_data && chain_data.coin && chain_data.staking_params && chain_data.staking_params.bond_denom === props.row.original.denom && (
                            <span className="text-gray-400 dark:text-gray-600">
                              {CURRENCY_SYMBOL}
                              {numberFormat(props.value * chain_data.coin[CURRENCY], '0,0.00000000')}
                            </span>
                          )}
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
            ]}
            data={data ?
              (data.commission && data.commission.map((commission, i) => { return { ...commission, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data && data.commission && data.commission.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
        </Widget>
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 my-4">
      </div>
    </>
  )
}