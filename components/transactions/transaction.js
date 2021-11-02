import { useState, useEffect } from 'react'

import moment from 'moment'

import TransactionDetail from './transaction-detail'
import TransactionLogs from './transaction-logs'
import TransactionRawLogs from './transaction-raw-logs'
import Widget from '../widget'

import { transaction as getTransaction } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

export default function Transaction({ tx }) {
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getTransaction(tx)

        if (response) {
          setTransaction({ data: response.data || {}, tx })
        }
      }
    }

    if (tx) {
      getData()
    }

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [tx])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <TransactionDetail data={transaction && transaction.tx === tx && transaction.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Activities</span>
          {transaction && transaction.tx === tx && transaction.data.activities && (
            <span>({transaction.data.activities.length})</span>
          )}
        </div>}
        className="bg-transparent border-0 p-0 md:pt-4 md:pb-8 md:px-8"
      >
        <TransactionLogs data={transaction && transaction.tx === tx && transaction.data} />
        <TransactionRawLogs data={transaction && transaction.tx === tx && transaction.data} />
      </Widget>
    </div>
  )
}