import { useState, useEffect } from 'react'

import moment from 'moment'

import AccountDetail from './account-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getAccount } from '../../lib/api/query'
import { transactions as getTransactions } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

export default function Account({ address }) {
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let response = await getAccount(address)

      if (response) {
        setAccount({ data: response.data || {}, address })
      }

      let data = []

      const getTransactionsByEvents = async events => {
        let pageKey = true

        let txsData = []

        while (pageKey && txsData.length < 100) {
          const response = await getTransactions({ events, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

          txsData = _.uniqBy(_.concat(txsData, (response && response.data) || []), 'txhash')

          pageKey = response && response.pagination && response.pagination.next_key
        }

        data = _.orderBy(_.uniqBy(_.concat(data, txsData), 'txhash'), ['timestamp', 'height'], ['desc', 'desc'])
      }

      if (address.startsWith('cosmos')) {
        await getTransactionsByEvents(`ibc_transfer.sender='${address}'`)
        await getTransactionsByEvents(`ibc_transfer.receiver='${address}'`)
      }
      else {
        await getTransactionsByEvents(`message.sender='${address}'`)
        await getTransactionsByEvents(`transfer.sender='${address}'`)
        await getTransactionsByEvents(`transfer.recipient='${address}'`)
      }

      data = _.slice(data, 0, 100)

      setTransactions({ data, total: response && response.total, address })
    }

    if (address) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [address])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <AccountDetail data={account && account.address === address && account.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Transactions</span>
        </div>}
        className="mt-4"
      >
        <div className="mt-3">
          <TransactionsTable data={transactions} noLoad={true} />
        </div>
      </Widget>
    </div>
  )
}