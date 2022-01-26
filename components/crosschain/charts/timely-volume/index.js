import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import {
  ResponsiveContainer,
  AreaChart,
  linearGradient,
  stop,
  XAxis,
  Area,
} from 'recharts'
import Loader from 'react-loader-spinner'

export default function TimelyVolume({ volumeData, setTimeFocus }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const [data, setData] = useState(null)

  useEffect(() => {
    if (volumeData) {
      const _data = volumeData.times?.map((timely, i) => {
        return {
          ...timely,
          day_string: i % 2 === 1 && moment(timely.time).utc().format('DD'),
        }
      })
      setData(_data || [])
    }
  }, [volumeData])

  const loaded = data

  return (
    <div className={`w-full h-56 bg-white dark:bg-gray-900 rounded-lg mt-2 ${loaded ? 'pb-0' : ''}`}>
      {loaded ?
        <ResponsiveContainer>
          <AreaChart
            data={data}
            onMouseEnter={event => {
              if (event) {
                if (setTimeFocus) {
                  setTimeFocus(event?.activePayload?.[0]?.payload?.time)
                }
              }
            }}
            onMouseMove={event => {
              if (event) {
                if (setTimeFocus) {
                  setTimeFocus(event?.activePayload?.[0]?.payload?.time)
                }
              }
            }}
            onMouseLeave={() => {
              if (event) {
                if (setTimeFocus) {
                  setTimeFocus(_.last(data)?.time)
                }
              }
            }}
            margin={{ top: 10, right: 2, left: 2, bottom: 4 }}
            className="mobile-hidden-x"
          >
            <defs>
              <linearGradient id="gradient-vol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor={theme === 'dark' ? '#374151' : '#E5E7EB'} stopOpacity={0.95} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#374151' : '#E5E7EB'} stopOpacity={0.75} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day_string" axisLine={false} tickLine={false} />
            <Area type="basis" dataKey="amount" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} fillOpacity={1} fill="url(#gradient-vol)" />
          </AreaChart>
        </ResponsiveContainer>
        :
        <div className="w-full h-4/5 flex items-center justify-center">
          <Loader type="Triangle" color={theme === 'dark' ? 'white' : '#acacac'} width="48" height="48" />
        </div>
      }
    </div>
  )
}