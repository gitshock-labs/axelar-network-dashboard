import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import moment from 'moment'

import Datatable from '../datatable'
import Copy from '../copy'

import { allValidators, validatorProfile } from '../../lib/api/cosmos'
import { blocks as getBlocks } from '../../lib/api/opensearch'
import { numberFormat, ellipseAddress, randImage } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

const LATEST_SIZE = 100

export default function BlocksTable({ n, className = '' }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [blocks, setBlocks] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        if (typeof n !== 'number') {
          const response = await allValidators({}, validators_data)

          if (response) {
            dispatch({
              type: VALIDATORS_DATA,
              value: response.data
            })

            setLoadValsProfile(true)
          }
        }
      }
    }

    getValidators()

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [n])

  useEffect(() => {
    const controller = new AbortController()

    const getValidatorsProfile = async () => {
      if (loadValsProfile && validators_data?.findIndex(validator_data => validator_data?.description && !validator_data.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const validator_data = data[i]

            if (validator_data?.description) {
              if (validator_data.description.identity && !validator_data.description.image) {
                const responseProfile = await validatorProfile({ key_suffix: validator_data.description.identity })

                if (responseProfile?.them?.[0]?.pictures?.primary?.url) {
                  validator_data.description.image = responseProfile.them[0].pictures.primary.url
                }
              }

              validator_data.description.image = validator_data.description.image || randImage(i)

              data[i] = validator_data
            }
          }
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: VALIDATORS_DATA,
            value: data
          })
        }
      }
    }

    getValidatorsProfile()

    return () => {
      controller?.abort()
    }
  }, [loadValsProfile])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getBlocks({ size: n || LATEST_SIZE, sort: [{ height: 'desc' }] })

        if (response) {
          setBlocks({ data: response.data || [] })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), (n ? 5 : 10) * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Datatable
        columns={[
          {
            Header: 'Height',
            accessor: 'height',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/blocks/${props.value}`}>
                  <a className="text-blue-600 dark:text-blue-500 font-medium">
                    {numberFormat(props.value, '0,0')}
                  </a>
                </Link>
                :
                <div className="skeleton w-16 h-4" />
            ),
          },
          {
            Header: 'Block Hash',
            accessor: 'hash',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <Link href={`/blocks/${props.row.original.height}`}>
                  <a className="uppercase font-medium">
                    {ellipseAddress(props.value, n ? 6 : 10)}
                  </a>
                </Link>
                :
                <div className={`skeleton w-${n ? 24 : 48} h-4`} />
            ),
          },
          {
            Header: 'Proposer',
            accessor: 'proposer_address',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton && validators_data ?
                props.row.original.operator_address ?
                  <div className={`min-w-max flex items-${props.row.original.proposer_name ? 'start' : 'center'} space-x-2`}>
                    <Link href={`/validator/${props.row.original.operator_address}`}>
                      <a>
                        {props.row.original.proposer_image ?
                          <img
                            src={props.row.original.proposer_image}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          :
                          <div className="skeleton w-6 h-6 rounded-full" />
                        }
                      </a>
                    </Link>
                    <div className="flex flex-col">
                      {props.row.original.proposer_name && (
                        <Link href={`/validator/${props.row.original.operator_address}`}>
                          <a className="text-blue-600 dark:text-blue-500 font-medium">
                            {props.row.original.proposer_name || props.row.original.operator_address}
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
                  '-'
                :
                <div className="flex items-start space-x-2">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-2.5">
                    <div className="skeleton w-24 h-4" />
                    <div className="skeleton w-56 h-3" />
                  </div>
                </div>
            ),
          },
          {
            Header: 'Txs',
            accessor: 'txs',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value > -1 ?
                    <span>{numberFormat(props.value, '0,0')}</span>
                    :
                    '-'
                  }
                </div>
                :
                <div className={`skeleton w-${n ? 8 : 12} h-4 ml-auto`} />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Time',
            accessor: 'time',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  <span className="text-gray-400 dark:text-gray-600">
                    {Number(moment().diff(moment(props.value), 'second')) > 59 ?
                      moment(props.value).fromNow()
                      :
                      <>{moment().diff(moment(props.value), 'second')}s ago</>
                    }
                  </span>
                </div>
                :
                <div className={`skeleton w-${n ? 16 : 24} h-4 ml-auto`} />
            ),
            headerClassName: 'justify-end text-right',
          },
        ]}
        data={blocks ?
          blocks.data.filter((block, i) => !n || i < n).map((block, i) => {
            let proposer_name, proposer_image, operator_address

            if (block?.proposer_address && validators_data?.findIndex(validator_data => validator_data.consensus_address === block.proposer_address) > -1) {
              const validator_data = validators_data[validators_data.findIndex(validator_data => validator_data.consensus_address === block.proposer_address)]

              operator_address = validator_data.operator_address

              if (validator_data.description) {
                proposer_name = validator_data.description.moniker
                proposer_image = validator_data.description.image
              }
            }

            return { ...block, i, operator_address, proposer_name, proposer_image }
          })
          :
          [...Array(n || 25).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={true}
        defaultPageSize={100}
        className={`min-h-full ${className}`}
      />
      {blocks && !(blocks.data?.length > 0) && (
        <div className={`bg-${!n ? 'white' : 'gray-50'} dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2`}>
          No Blocks
        </div>
      )}
    </>
  )
}