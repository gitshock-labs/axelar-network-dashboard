import Link from 'next/link'
import { useState, useEffect } from 'react'

import moment from 'moment'

import BlockDetail from './block-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getBlock, getTransactions } from '../../lib/api/query'
import { numberFormat } from '../../lib/utils'

export default function Block({ height }) {
  const [block, setBlock] = useState(null)
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let response = await getBlock(height)

      if (response) {
        setBlock({ data: response.data || {}, height })
      }

      response = await getTransactions({ height })

      if (response) {
        setTransactions({ data: response.data || [], height })
      }
    }

    if (height) {
      getData()
    }

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => clearInterval(interval)
  }, [height])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <BlockDetail data={block && block.height === height && block.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Transactions</span>
          {transactions && transactions.height === height && (
            <span>({transactions.data.length})</span>
          )}
        </div>}
        className="mt-4"
      >
        <div className="mt-3">
          <TransactionsTable data={transactions} noLoad={true} page="blocks" />
        </div>
      </Widget>
    </div>
  )
}