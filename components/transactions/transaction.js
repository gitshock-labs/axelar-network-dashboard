import { useState, useEffect } from 'react'

import moment from 'moment'

import TransactionDetail from './transaction-detail'
import TransactionLogs from './transaction-logs'
import Widget from '../widget'

import { getTransaction } from '../../lib/api/query'
import { numberFormat } from '../../lib/utils'

export default function Transaction({ tx }) {
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getTransaction(tx)

      if (response) {
        setTransaction({ data: response.data || {}, tx })
      }
    }

    if (tx) {
      getData()
    }

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => clearInterval(interval)
  }, [tx])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <TransactionDetail data={transaction && transaction.tx === tx && transaction.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Logs</span>
          {transaction && transaction.tx === tx && transaction.data.logs && (
            <span>({transaction.data.logs.length})</span>
          )}
        </div>}
        className="bg-transparent border-0 mt-4 p-0 md:p-8"
      >
        <div className="mt-3">
          <TransactionLogs data={transaction && transaction.tx === tx && transaction.data} />
        </div>
      </Widget>
    </div>
  )
}