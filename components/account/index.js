import { useState, useEffect } from 'react'

import moment from 'moment'

import AccountDetail from './account-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getAccount, getTransactions } from '../../lib/api/query'
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

      response = await getTransactions({ address })

      if (response) {
        setTransactions({ data: response.data || [], address })
      }
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