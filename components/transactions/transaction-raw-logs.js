import dynamic from 'next/dynamic'
import { useSelector, shallowEqual } from 'react-redux'

export default function TransactionLogs({ data }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const ReactJson = typeof window !== 'undefined' && dynamic(import('react-json-view'))

  return data && data.raw_log && (
    <>
      <div className="text-gray-900 dark:text-white text-lg font-semibold mt-6">Raw logs</div>
      <div className="mt-2">
        <ReactJson src={JSON.parse(data.raw_log)} theme={theme === 'dark' ? 'harmonic' : 'rjv-default'} />
      </div>
    </>
  )
}