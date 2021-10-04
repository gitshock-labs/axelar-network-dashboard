import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import { FiBox } from 'react-icons/fi'

import Datatable from '../datatable'
import { ProgressBarWithText } from '../progress-bars'
import Copy from '../copy'

import { status as getStatus } from '../../lib/api/rpc'
import { allValidators, validatorSelfDelegation } from '../../lib/api/cosmos'
import { numberFormat, ellipseAddress } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA } from '../../reducers/types'

export default function ValidatorsTable({ status }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { status_data, validators_data } = { ...data }

  useEffect(() => {
    const getData = async () => {
      const response = await getStatus()

      if (response) {
        dispatch({
          type: STATUS_DATA,
          value: response
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getValidators = async () => {
      let response = await allValidators({}, validators_data, status, null, Number(status_data.latest_block_height))

      if (response) {
        dispatch({
          type: VALIDATORS_DATA,
          value: response.data
        })

        if (response.data) {
          const validators_data = response.data

          for (let i = 0; i < validators_data.length; i++) {
            let validator_data = validators_data[i]

            validator_data = await validatorSelfDelegation(validator_data, validators_data, status)

            if (validator_data) {
              validators_data[i] = validator_data

              dispatch({
                type: VALIDATORS_DATA,
                value: validators_data
              })
            }
          }
        }
      }
    }

    if (status && status_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [status, status_data])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <div className="flex flex-row items-center space-x-1 my-2">
        {['active', 'inactive', 'deregistering'].map((_status, i) => (
          <Link key={i} href={`/validators${i > 0 ? `/${_status}` : ''}`}>
            <a className={`btn btn-default btn-rounded ${_status === status ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'bg-trasparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'}`}>
              {_status}
              {validators_data && _status === status ? ` (${validators_data.filter(validator => status === 'inactive' ? !(['BOND_STATUS_BONDED'].includes(validator.status)) : status === 'deregistering' ? validator.deregistering : !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)).length})` : ''}
            </a>
          </Link>
        ))}
      </div>
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
            accessor: 'description.moniker',
            sortType: (rowA, rowB) => (rowA.original.description.moniker || rowA.original.i) > (rowB.original.description.moniker || rowB.original.i) ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className={`min-w-max flex items-${props.value ? 'start' : 'center'} space-x-2`}>
                  {props.row.original.description.image && (
                    <Link href={`/validator/${props.row.original.operator_address}`}>
                      <a>
                        <img
                          src={props.row.original.description.image}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col">
                    {props.value && (
                      <Link href={`/validator/${props.row.original.operator_address}`}>
                        <a className="text-blue-600 dark:text-blue-400 font-medium">
                          {props.value || props.row.original.operator_address}
                        </a>
                      </Link>
                    )}
                    <span className="flex items-center space-x-1">
                      <Link href={`/validator/${props.row.original.operator_address}`}>
                        <a className="text-gray-500 font-light">
                          {ellipseAddress(props.row.original.operator_address, 16)}
                        </a>
                      </Link>
                      <Copy text={props.row.original.operator_address} />
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
            Header: ['active'].includes(status) ? 'Voting Power' : 'Bonded Tokens',
            accessor: 'tokens',
            sortType: (rowA, rowB) => rowA.original.tokens > rowB.original.tokens ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex flex-col justify-center text-left sm:text-right">
                  {props.value > 0 ?
                    <>
                      <span className="font-medium">{numberFormat(Math.floor(props.value / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0.00')}</span>
                      <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.value * 100 / _.sumBy(validators_data.filter(validator => !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)), 'tokens'), '0,0.000')}%</span>
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="flex flex-col justify-center space-y-1">
                  <div className="skeleton w-16 h-4 ml-0 sm:ml-auto" />
                  <div className="skeleton w-8 h-4 ml-0 sm:ml-auto" />
                </div>
            ),
            headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
          },
          {
            Header: 'Self Delegation',
            accessor: 'self_delegation',
            sortType: (rowA, rowB) => rowA.original.self_delegation / rowA.original.delegator_shares > rowB.original.self_delegation / rowB.original.delegator_shares ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton && typeof props.value === 'number' ?
                <div className="flex flex-col justify-center text-left sm:text-right">
                  {props.value > 0 ?
                    <>
                      {/*<span className="font-medium">{numberFormat(Math.floor(props.value / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0.00')}</span>*/}
                      <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.value * 100 / props.row.original.delegator_shares, '0,0.000')}%</span>
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="flex flex-col justify-center space-y-1">
                  {/*<div className="skeleton w-16 h-4 ml-0 sm:ml-auto" />*/}
                  <div className="skeleton w-8 h-4 ml-0 sm:ml-auto" />
                </div>
            ),
            headerClassName: 'justify-start sm:justify-end text-left sm:text-right',
          },
          {
            Header: 'Commission',
            accessor: 'commission.commission_rates.rate',
            sortType: (rowA, rowB) => Number(rowA.original.commission.commission_rates.rate) > Number(rowB.original.commission.commission_rates.rate) ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > 0 ?
                    <span>{numberFormat(props.value * 100, '0,0.00')}%</span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-8 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: (
              <span className="flex items-center space-x-1">
                <span>Uptime</span>
                <span>{numberFormat(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS), '0,0')}</span>
                <FiBox size={16} className="stroke-current" />
              </span>
            ),
            accessor: 'uptime',
            sortType: (rowA, rowB) => rowA.original.uptime > rowB.original.uptime ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton && typeof props.value === 'number' ?
                props.value > 0 ?
                  <div className="w-56 mt-0.5 ml-auto">
                    <ProgressBarWithText
                      width={props.value}
                      text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
                        {numberFormat(props.value, '0,0.00')}%
                      </div>}
                      color="bg-green-500 dark:bg-green-600 rounded"
                      backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
                      className={`h-4 flex items-center justify-${props.value < 20 ? 'start' : 'end'}`}
                    />
                  </div>
                  :
                  <div className="w-56 text-right ml-auto">{/*-*/}</div>
                :
                <div className="skeleton w-56 h-4 rounded mt-0.5 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Status',
            accessor: 'status',
            sortType: (rowA, rowB) => rowA.original.status > rowB.original.status ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value ?
                    <>
                      <span className={`bg-${props.value.includes('UN') ? props.value.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-2 py-1`}>
                        {props.value.replace('BOND_STATUS_', '')}
                      </span>
                      {props.row.original.deregistering && (
                        <div className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-2">
                          (De-registering)
                        </div>
                      )}
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-24 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Jailed',
            accessor: 'jailed',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value ?
                    <span className="bg-red-600 rounded capitalize text-white font-semibold px-2 py-1">
                      Jailed
                    </span>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-24 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ].filter(column => ['inactive', 'deregistering'].includes(status) ? !(['uptime'].includes(column.accessor)) : !(['jailed'].includes(column.accessor)))}
        data={validators_data ?
          validators_data.filter(validator => status === 'inactive' ? !(['BOND_STATUS_BONDED'].includes(validator.status)) : status === 'deregistering' ? validator.deregistering : !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)).map((validator, i) => { return { ...validator, i } })
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={validators_data ? validators_data.filter(validator => status === 'inactive' ? !(['BOND_STATUS_BONDED'].includes(validator.status)) : status === 'deregistering' ? validator.deregistering : !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)).length <= 10 : true}
        defaultPageSize={100}
      />
      {validators_data && validators_data.filter(validator => status === 'inactive' ? !(['BOND_STATUS_BONDED'].includes(validator.status)) : status === 'deregistering' ? validator.deregistering : !validator.jailed && ['BOND_STATUS_BONDED'].includes(validator.status)).length < 1 && (
        <div className="bg-white dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2">
          No Validators
        </div>
      )}
    </div>
  )
}