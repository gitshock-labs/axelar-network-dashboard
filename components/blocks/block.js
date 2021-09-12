import { useState, useEffect } from 'react'

import moment from 'moment'
import _ from 'lodash'

import BlockDetail from './block-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getBlock } from '../../lib/api/query'
import { transactions as getTransactions } from '../../lib/api/cosmos'
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

      // response = await getTransactions({ query: { match: { height } }, size: 100, sort: [{ timestamp: 'desc' }] })

      let data = []

      let pageKey = true

      while (pageKey) {
        response = await getTransactions({ events: `tx.height=${height}`, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

        data = _.orderBy(_.uniqBy(_.concat(data, (response && response.data) || []), 'txhash'), ['timestamp'], ['desc'])

        pageKey = response && response.pagination && response.pagination.next_key
      }

      setTransactions({ data, total: response && response.total, height })
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
            <span>({transactions.total || transactions.data.length})</span>
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