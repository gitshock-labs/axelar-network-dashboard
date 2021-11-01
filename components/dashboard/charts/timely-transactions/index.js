import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import {
  ResponsiveContainer,
  BarChart,
  linearGradient,
  stop,
  XAxis,
  Bar,
  Cell,
} from 'recharts'
import Loader from 'react-loader-spinner'

export default function TimelyTransactions({ txsData, setTimeFocus }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const [data, setData] = useState(null)

  useEffect(() => {
    if (txsData) {
      const _data = txsData.times?.map((timely, i) => {
        return {
          ...timely,
          day_string: i % 2 === 0 && moment(timely.time).utc().format('DD'),
        }
      })
      setData(_data || [])
    }
  }, [txsData])

  const loaded = data

  return (
    <div className={`w-full h-56 bg-white dark:bg-gray-900 rounded-lg mt-2 ${loaded ? 'pb-0' : ''}`}>
      {loaded ?
        <ResponsiveContainer>
          <BarChart
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
              <linearGradient id="gradient-tx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor={theme === 'dark' ? '#374151' : '#E5E7EB'} stopOpacity={0.95} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#374151' : '#E5E7EB'} stopOpacity={0.75} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day_string" axisLine={false} tickLine={false} />
            <Bar dataKey="tx" minPointSize={5}>
              {data.map((entry, i) => (<Cell key={i} fillOpacity={1} fill="url(#gradient-tx)" />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        :
        <Loader type="BallTriangle" color={theme === 'dark' ? 'white' : '#acacac'} width="36" height="36" />
      }
    </div>
  )
}