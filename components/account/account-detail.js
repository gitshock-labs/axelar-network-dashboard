import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Widget from '../widget'
import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress, randImage } from '../../lib/utils'

const CURRENCY = 'usd'
const CURRENCY_SYMBOL = '$'

export default function AccountDetail({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

  return (
    <>
      <div className="w-full flex flex-row items-center justify-start md:justify-end space-x-2">
        <div className="text-base font-semibold">Total:</div>
        {data ?
          <div className="flex items-center text-gray-700 dark:text-gray-100 space-x-2">
            {data.total?.length > 0 ?
              data.total.map((total, i) => (
                <span key={i} className="bg-gray-200 dark:bg-gray-800 rounded font-medium space-x-1 px-2 py-1">
                  <span>{numberFormat(total.amount, '0,0.00000000')}</span>
                  <span className="uppercase font-light">{ellipseAddress(total.denom, 6)}</span>
                  {chain_data?.coin && chain_data.staking_params?.bond_denom === total.denom && (
                    <span className="text-gray-500">
                      (
                      {CURRENCY_SYMBOL}
                      {numberFormat(total.amount * chain_data.coin[CURRENCY], '0,0.00000000')}
                      )
                    </span>
                  )}
                </span>
              ))
              :
              '-'
            }
          </div>
          :
          <div className="skeleton w-16 h-7 ml-0 md:ml-auto" />
        }
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 my-4">
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Balances</span>}
          className="dark:border-gray-900"
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
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{ellipseAddress(props.value, 6)}</span>
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
                        {chain_data?.coin && chain_data.staking_params?.bond_denom === props.value && (
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
                          {chain_data?.coin && chain_data.staking_params?.bond_denom === props.row.original.denom && (
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
              (data.balances?.map((balance, i) => { return { ...balance, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data?.balances?.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
          {data && !(data.balances?.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-sm font-medium italic text-center my-2 py-2">
              No Balances
            </div>
          )}
        </Widget>
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Rewards</span>}
          className="dark:border-gray-900"
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
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{ellipseAddress(props.value, 6)}</span>
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
                        {chain_data?.coin && chain_data.staking_params?.bond_denom === props.value && (
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
                          {chain_data?.coin && chain_data.staking_params?.bond_denom === props.row.original.denom && (
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
              (data.rewards?.rewards?.map((reward, i) => { return { ...reward, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data?.rewards?.rewards?.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
          {data && !(data.rewards?.rewards?.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-sm font-medium italic text-center my-2 py-2">
              No Rewards
            </div>
          )}
        </Widget>
        {/*data?.operator_address*/true && (
          <Widget
            title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Commissions</span>}
            className="dark:border-gray-900"
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
                        <div className="flex flex-col">
                          <span className="flex items-center space-x-1">
                            <span className="uppercase font-semibold">{ellipseAddress(props.value, 6)}</span>
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
                          {chain_data?.coin && chain_data.staking_params?.bond_denom === props.value && (
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
                            {chain_data?.coin && chain_data.staking_params?.bond_denom === props.row.original.denom && (
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
                (data.commission?.map((commission, i) => { return { ...commission, i } })) || []
                :
                [...Array(3).keys()].map(i => { return { i, skeleton: true } })
              }
              noPagination={data?.commission?.length > 10 ? false : true}
              defaultPageSize={10}
              className="no-border mt-4"
            />
            {data && !(data.commission?.length > 0) && (
              <div className="bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-sm font-medium italic text-center my-2 py-2">
                No Commissions
              </div>
            )}
          </Widget>
        )}
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 my-4">
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Delegations</span>}
          className="dark:border-gray-900"
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
                Header: 'Validator',
                accessor: 'validator_data.description.moniker',
                sortType: (rowA, rowB) => (rowA.original.validator_data?.description?.moniker || rowA.original.i) > (rowB.original.validator_data?.description?.moniker || rowB.original.i) ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.value ? 'start' : 'center'} space-x-2`}>
                      {props.row.original.validator_data && (
                        <Link href={`/validator/${props.row.original.validator_address}`}>
                          <a>
                            {props.row.original.validator_data.description?.image ?
                              <img
                                src={props.row.original.validator_data.description.image}
                                alt=""
                                className="w-6 h-6 rounded-full"
                              />
                              :
                              <div className="skeleton w-6 h-6 rounded-full" />
                            }
                          </a>
                        </Link>
                      )}
                      <div className="flex flex-col">
                        {props.value && (
                          <Link href={`/validator/${props.row.original.validator_address}`}>
                            <a className="text-blue-600 dark:text-white font-medium">
                              {props.value || props.row.original.validator_address}
                            </a>
                          </Link>
                        )}
                        <span className="flex items-center space-x-1">
                          <Link href={`/validator/${props.row.original.validator_address}`}>
                            <a className="text-gray-500 font-light">
                              {ellipseAddress(props.row.original.validator_address, 16)}
                            </a>
                          </Link>
                          <Copy text={props.row.original.validator_address} />
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
                Header: 'Coin',
                accessor: 'denom',
                sortType: (rowA, rowB) => rowA.original.denom > rowB.original.denom ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.row.original.contract_address ? 'start' : 'center'} space-x-2`}>
                      <div className="flex flex-col">
                        <span className="flex items-center space-x-1">
                          <span className="uppercase font-semibold">{ellipseAddress(props.value, 6)}</span>
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
                        {chain_data?.coin && chain_data.staking_params?.bond_denom === props.value && (
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
                          {chain_data?.coin && chain_data.staking_params?.bond_denom === props.row.original.denom && (
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
              (data.stakingDelegations?.map((delegation, i) => { return { ...delegation, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data?.stakingDelegations?.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
          {data && !(data.stakingDelegations?.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-2 py-2">
              No Delegations
            </div>
          )}
        </Widget>
        <Widget
          title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Unbonding</span>}
          className="dark:border-gray-900"
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
                Header: 'Validator',
                accessor: 'validator_data?.description?.moniker',
                sortType: (rowA, rowB) => (rowA.original.validator_data?.description?.moniker || rowA.original.i) > (rowB.original.validator_data?.description?.moniker || rowB.original.i) ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className={`min-w-max flex items-${props.value ? 'start' : 'center'} space-x-2`}>
                      {props.row.original.validator_data && (
                        <Link href={`/validator/${props.row.original.validator_address}`}>
                          <a>
                            {props.row.original.validator_data.description?.image || true ?
                              <img
                                src={props.row.original.validator_data.description?.image || randImage()}
                                alt=""
                                className="w-6 h-6 rounded-full"
                              />
                              :
                              <div className="skeleton w-6 h-6 rounded-full" />
                            }
                          </a>
                        </Link>
                      )}
                      <div className="flex flex-col">
                        {props.value && (
                          <Link href={`/validator/${props.row.original.validator_address}`}>
                            <a className="text-blue-600 dark:text-white font-medium">
                              {props.value || props.row.original.validator_address}
                            </a>
                          </Link>
                        )}
                        <span className="flex items-center space-x-1">
                          <Link href={`/validator/${props.row.original.validator_address}`}>
                            <a className="text-gray-500 font-light">
                              {ellipseAddress(props.row.original.validator_address, 16)}
                            </a>
                          </Link>
                          <Copy text={props.row.original.validator_address} />
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
                Header: 'Height',
                accessor: 'creation_height',
                disableSortBy: true,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <Link href={`/block/${props.value}`}>
                      <a className="text-blue-600 dark:text-white font-medium">
                        {numberFormat(props.value, '0,0')}
                      </a>
                    </Link>
                    :
                    <div className="skeleton w-16 h-4" />
                ),
              },
              {
                Header: 'Balance',
                accessor: 'balance',
                sortType: (rowA, rowB) => rowA.original.balance > rowB.original.balance ? 1 : -1,
                Cell: props => (
                  !props.row.original.skeleton ?
                    <div className="flex justify-center text-left sm:text-right">
                      <span className="font-medium">
                        {props.value > -1 ?
                          numberFormat(props.value, '0,0.00000000')
                          :
                          '-'
                        }
                        /
                        {props.row.original.initial_balance > -1 ?
                          numberFormat(props.row.original.initial_balance, '0,0.00000000')
                          :
                          '-'
                        }
                      </span>
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
              (data.stakingUnbonding?.map((unbonding, i) => { return { ...unbonding, i } })) || []
              :
              [...Array(3).keys()].map(i => { return { i, skeleton: true } })
            }
            noPagination={data?.stakingUnbonding?.length > 10 ? false : true}
            defaultPageSize={10}
            className="no-border mt-4"
          />
          {data && !(data.stakingUnbonding?.length > 0) && (
            <div className="bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-2 py-2">
              No Unbonding
            </div>
          )}
        </Widget>
      </div>
    </>
  )
}