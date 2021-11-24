import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import StackGrid from 'react-stack-grid'
import moment from 'moment'
import _ from 'lodash'
import Loader from 'react-loader-spinner'
import { FiServer } from 'react-icons/fi'

import Widget from '../widget'

import { status as getStatus } from '../../lib/api/rpc'
import { historical } from '../../lib/api/opensearch'
import { block as getBlock } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

import { STATUS_DATA } from '../../reducers/types'

const snapshot_block_size = Number(process.env.NEXT_PUBLIC_SNAPSHOT_BLOCK_SIZE)

export default function Snapshots({ n = 100 }) {
  const dispatch = useDispatch()
  const { data, preferences } = useSelector(state => ({ data: state.data, preferences: state.preferences }), shallowEqual)
  const { status_data } = { ...data }
  const { theme } = { ...preferences }

  const [statusLoaded, setStatusLoaded] = useState(null)
  const [snapshots, setSnapshots] = useState(null)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getStatus()

        if (response) {
          dispatch({
            type: STATUS_DATA,
            value: response,
          })
        }

        setStatusLoaded(true)
      }
    }

    getData()

    const interval = setInterval(() => getData(), 10 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        if (status_data) {
          const latestBlock = Number(status_data.latest_block_height)

          const snapshot_block = latestBlock - (latestBlock % snapshot_block_size)

          let response

          if (latestBlock >= snapshot_block_size) {
            response = await historical({
              aggs: {
                historical: {
                  terms: { field: 'snapshot_block', size: n },
                },
              },
              query: {
                bool: {
                  must: [
                    { range: { snapshot_block: { gte: snapshot_block - snapshot_block_size + 1, lte: snapshot_block } } },
                  ],
                },
              },
            })
          }

          let data = _.orderBy(Object.entries(response?.data || {}).map(([key, value], i) => {
            return {
              snapshot_block: key,
              num_validators: value,
            }
          }), ['snapshot_block'], ['desc'])

          while (!(data[0]?.snapshot_block >= latestBlock)) {
            data = _.concat({ snapshot_block: (data[0]?.snapshot_block || 0) + snapshot_block_size, processing: !((data[0]?.snapshot_block || 0) + snapshot_block_size >= latestBlock) ? true : undefined }, data)
          }

          setSnapshots({ data })

          for (let i = 0; i < data.length; i++) {
            if (!controller.signal.aborted) {
              const snapshot = data[i]

              if (snapshot?.snapshot_block < latestBlock && !snapshot?.time) {
                const _response = await getBlock(snapshot?.snapshot_block)

                if (_response?.data?.time) {
                  snapshot.time = moment(_response.data.time).valueOf()

                  data[i] = snapshot

                  setSnapshots({ data })
                }
              }
            }
          }
        }
      }
    }

    if (statusLoaded) {
      setStatusLoaded(false)

      getData()
    }

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [statusLoaded])

  useEffect(() => {
    const run = async () => setTimer(moment().unix())

    if (!timer) {
      run()
    }

    const interval = setInterval(() => run(), 0.5 * 1000)
    return () => clearInterval(interval)
  }, [timer])

  const latestBlock = status_data && Number(status_data.latest_block_height)

  const widgets = (snapshots ?
    snapshots.data.map((snapshot, i) => { return { ...snapshot, i } })
    :
    [...Array(20).keys()].map(i => { return { i, skeleton: true } })
  ).map((snapshot, i) => (
    <Widget
      key={i}
      className={`${!latestBlock || (snapshot.snapshot_block <= latestBlock && !snapshot.processing) ? '' : 'bg-gray-100 dark:bg-gray-900'} shadow-xl`}
    >
      {!snapshot.skeleton ?
        <div className="flex flex-col">
          <div className="flex items-center text-gray-400 dark:text-gray-600">
            <span className="capitalize text-sm">Snapshot Block</span>
            {typeof snapshot?.num_validators === 'number' ?
              <span className="flex items-center text-gray-400 dark:text-gray-600 text-xs space-x-1 ml-auto">
                <span>{numberFormat(snapshot.num_validators, '0,0')}</span>
                <FiServer size={14} className="stroke-current" />
              </span>
              :
              snapshot.processing ?
                <Loader type="BallTriangle" color={theme === 'dark' ? 'white' : '#acacac'} width="24" height="24" className="ml-auto" />
                :
                null
            }
          </div>
          <div className="font-mono text-3xl font-semibold text-center my-2">
            {numberFormat(snapshot.snapshot_block, '0,0')}
          </div>
          <div className="text-gray-400 dark:text-gray-600 text-xs text-center">
            {snapshot.snapshot_block > latestBlock ?
              <div className="space-x-1">
                <span>will snap in</span>
                <span className="text-gray-900 dark:text-white">{numberFormat(snapshot.snapshot_block - latestBlock, '0,0')}</span>
                <span>block{snapshot.snapshot_block - latestBlock > 1 ? 's' : ''}</span>
              </div>
              :
              <div className="flex items-center justify-center space-x-1">
                <span className="font-medium">Block Time:</span>
                {snapshot.time ?
                  <span>{moment(snapshot.time).format('MMM D, YYYY h:mm:ss A z')}</span>
                  :
                  <div className="skeleton w-32 h-4" />
                }
              </div>
            }
          </div>
        </div>
        :
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="skeleton w-24 h-4" />
            <div className="skeleton w-12 h-4 ml-auto" />
          </div>
          <div className="skeleton w-32 h-8 my-4 mx-auto" />
          <div className="skeleton w-40 h-4 mx-auto" />
        </div>}
    </Widget>
  )).map((widget, i) => (
    snapshots?.data?.[i]?.time && !snapshots?.data?.[i]?.processing ?
      <Link key={i} href={`/validators/snapshot/${snapshots.data[i].snapshot_block}`}>
        <a>
          {widget}
        </a>
      </Link>
      :
      <div key={i}>
        {widget}
      </div>
  ))

  return (
    <>
      <StackGrid
        columnWidth={336}
        gutterWidth={12}
        gutterHeight={12}
        className="hidden sm:block"
      >
        {widgets}
      </StackGrid>
      <div className="block sm:hidden space-y-3">
        {widgets}
      </div>
    </>
  )
}