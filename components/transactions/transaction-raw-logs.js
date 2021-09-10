import dynamic from 'next/dynamic'
import { useSelector, shallowEqual } from 'react-redux'
import { convertToJson } from '../../lib/utils'

export default function TransactionRawLogs({ data }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const ReactJson = typeof window !== 'undefined' && dynamic(import('react-json-view'))

  return (
    <>
      <div className="text-gray-900 dark:text-white text-lg font-semibold mt-6">Raw logs</div>
      {data && data.raw_log && (
        <div className="mt-2">
          {typeof data.raw_log === 'string' ?
            <span>{data.raw_log}</span>
            :
            <ReactJson src={convertToJson(data.raw_log)} theme={theme === 'dark' ? 'harmonic' : 'rjv-default'} />
          }
        </div>
      )}
    </>
  )
}