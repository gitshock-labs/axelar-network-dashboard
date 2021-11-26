import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import StackGrid from 'react-stack-grid'
import _ from 'lodash'
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { IoRefreshCircle } from 'react-icons/io5'

import Widget from '../widget'

import { status as getStatus } from '../../lib/api/rpc'
import { historical } from '../../lib/api/opensearch'
import { numberFormat } from '../../lib/utils'

import { STATUS_DATA } from '../../reducers/types'

const snapshot_block_size = Number(process.env.NEXT_PUBLIC_SNAPSHOT_BLOCK_SIZE)

export default function Leaderboard({ n = 100 }) {
  const dispatch = useDispatch()
  const { data, preferences } = useSelector(state => ({ data: state.data, preferences: state.preferences }), shallowEqual)
  const { status_data } = { ...data }
  const { theme } = { ...preferences }

  const [statusLoaded, setStatusLoaded] = useState(null)
  const [snapshots, setSnapshots] = useState(null)
  const [fromSnapshot, setFromSnapshot] = useState(null)
  const [toSnapshot, setToSnapshot] = useState(null)
  const [readyToLoad, setReadyToLoad] = useState(null)
  const [loading, setLoading] = useState(null)
  const [snapshotsData, setSnapshotsData] = useState(null)

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
                    { range: { snapshot_block: { gte: snapshot_block - (n * snapshot_block_size) + 1, lte: snapshot_block } } },
                  ],
                },
              },
            })
          }

          let data = _.orderBy(Object.entries(response?.data || {}).map(([key, value]) => {
            return {
              snapshot_block: Number(key),
              num_validators: value,
            }
          }), ['snapshot_block'], ['desc'])

          setSnapshots({ data })

          for (let i = 0; i < data.length; i++) {
            if (!controller.signal.aborted) {
              const snapshot = data[i]

              if (snapshot?.snapshot_block < latestBlock) {
                const _response = await getBlock(snapshot?.snapshot_block)

                if (_response?.data?.time) {
                  snapshot.time = moment(_response.data.time).valueOf()

                  data[i] = snapshot

                  setSnapshots({ data })
                }
              }
            }
          }

          if (!fromSnapshot && !toSnapshot) {
            setFromSnapshot(_.last(_.slice(data, 0, 10))?.snapshot_block)
            setToSnapshot(_.head(data)?.snapshot_block)

            setLoading(true)
          }
        }
      }
    }

    if (statusLoaded) {
      setStatusLoaded(false)

      getData()
    }

    return () => {
      controller?.abort()
    }
  }, [statusLoaded])

  useEffect(() => {
    if (fromSnapshot && toSnapshot) {
      if (fromSnapshot > toSnapshot) {
        setToSnapshot(fromSnapshot)
      }
      else {
        setReadyToLoad(true)
      }
    }
  }, [fromSnapshot])

  useEffect(() => {
    if (fromSnapshot && toSnapshot) {
      if (toSnapshot < fromSnapshot) {
        setFromSnapshot(toSnapshot)
      }
      else {
        setReadyToLoad(true)
      }
    }
  }, [toSnapshot])

  useEffect(() => {
    const getData = async () => {
      if (loading && fromSnapshot && toSnapshot) {
        setReadyToLoad(false)

        const response = await historical({
          query: {
            bool: {
              must: [
                { range: { snapshot_block: { gte: fromSnapshot - snapshot_block_size + 1, lte: toSnapshot } } },
              ],
            },
          },
          size: 10000,
        })

        const data = _.orderBy((response?.data || []).map(_snapshot => {
          return {
            ..._snapshot,
          }
        }), ['snapshot_block'], ['desc'])

        setSnapshotsData({ data })

        setLoading(false)
      }
    }

    getData()
  }, [loading])

  const latestBlock = status_data && Number(status_data.latest_block_height)

  return (
    <>
      {snapshots?.data?.length > 0 && (
        <div className="flex items-center space-x-4 mb-4">
          <span className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span>From Snapshot</span>
            {fromSnapshot && (
              <select
                value={fromSnapshot}
                onChange={e => setFromSnapshot(Number(e.target.value))}
                className="max-w-min dark:bg-gray-800 outline-none border-gray-200 dark:border-gray-800 shadow-none focus:shadow-none text-xs"
              >
                {snapshots.data.map((_snapshot, i) => (
                  <option key={i} value={_snapshot.snapshot_block}>
                    {numberFormat(_snapshot.snapshot_block, '0,0')}
                  </option>
                ))}
              </select>
            )}
          </span>
          <span className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span>To Snapshot</span>
            {toSnapshot && (
              <select
                value={toSnapshot}
                onChange={e => setToSnapshot(Number(e.target.value))}
                className="max-w-min dark:bg-gray-800 outline-none border-gray-200 dark:border-gray-800 shadow-none focus:shadow-none text-xs"
              >
                {snapshots.data.map((_snapshot, i) => (
                  <option key={i} value={_snapshot.snapshot_block}>
                    {numberFormat(_snapshot.snapshot_block, '0,0')}
                  </option>
                ))}
              </select>
            )}
          </span>
          {readyToLoad && !loading && (
            <IoRefreshCircle
              size={24}
              onClick={() => setLoading(true)}
              className="cursor-pointer text-indigo-600 dark:text-gray-200"
            />
          )}
          {loading && (
            <Loader type="Puff" color={theme === 'dark' ? 'white' : '#D1D5DB'} width="20" height="20" />
          )}
        </div>
      )}
      Coming Soon
    </>
  )
}