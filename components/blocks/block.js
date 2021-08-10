import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import _ from 'lodash'

import Datatable from '../../components/datatable'
import { ProgressBarWithText } from '../../components/progress-bars'
import Copy from '../../components/copy'

import { getValidators } from '../../lib/api/query'
import { generateUrl, numberFormat, ellipseAddress } from '../../lib/utils'

export default function ValidatorsTable({ status }) {
  const router = useRouter()

  const [validators, setValidators] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getValidators()

      if (response) {
        setValidators({ data: response.data || [], status })
      }
    }

    getData()
    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [status])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <div className="flex flex-row items-center space-x-1 my-2">
        {['active', 'inactive', 'deregistering'].map((_status, i) => (
          <Link key={i} href={`/validators${i > 0 ? `/${_status}` : ''}`}>
            <a className={`btn btn-default btn-rounded ${_status === status ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'bg-trasparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'}`}>
              {_status}
              {validators && _status === status ? ` (${validators.data.filter(validator => validator.status === status).length})` : ''}
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
            accessor: 'name',
            sortType: (rowA, rowB) => (rowA.original.name || rowA.original.key) > (rowB.original.name || rowB.original.key) ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="min-w-max flex items-start space-x-2">
                  <Link href={`/validator/${props.row.original.key}`}>
                    <a>
                      <img
                        src={props.row.original.image}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    </a>
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/validator/${props.row.original.key}`}>
                      <a className="text-blue-600 dark:text-blue-400 font-semibold">
                        {props.value || props.row.original.key}
                      </a>
                    </Link>
                    <span className="flex items-center space-x-1">
                      <span className="font-light">{ellipseAddress(props.row.original.key)}</span>
                      <Copy text={props.row.original.key} />
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
            Header: 'Voting Power',
            accessor: 'voting_power',
            sortType: (rowA, rowB) => rowA.original.voting_power > rowB.original.voting_power ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex flex-col justify-center text-left sm:text-right">
                  {props.value > -1 ?
                    <>
                      <span className="font-medium">{numberFormat(props.value, '0,0')}</span>
                      <span className="text-gray-400 dark:text-gray-600">{numberFormat(props.row.original.voting_power_percentage, `0,0.000${Math.abs(props.row.original.voting_power_percentage) < 0.001 ? '000' : ''}`)}%</span>
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
            Header: 'Commission',
            accessor: 'commission_percenteage',
            sortType: (rowA, rowB) => rowA.original.commission_percenteage > rowB.original.commission_percenteage ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > -1 ?
                    <span>{numberFormat(props.value, '0,0.00')}%</span>
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
            Header: 'Uptime',
            accessor: 'uptime',
            sortType: (rowA, rowB) => rowA.original.uptime > rowB.original.uptime ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value > -1 ?
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
                  <div className="w-56 text-right ml-auto">-</div>
                :
                <div className="skeleton w-56 h-4 rounded mt-0.5 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={validators && validators.status === status ?
          validators.data.filter(validator => validator.status === status).map((validator, i) => { return { ...validator, i } })
          :
          [...Array(25).keys()].map(i => { return { i, skeleton: true } })
        }
        defaultPageSize={50}
      />
    </div>
  )
}