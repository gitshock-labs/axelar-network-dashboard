import Link from 'next/link'
import { useState, useEffect } from 'react'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getSummary } from '../../lib/api/query'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getSummary()

      if (response) {
        setData({ data: response.data || {} })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="my-4 mx-auto">
      <Summary data={data && data.data} />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-4 my-2 md:my-4">
        <Widget
          title={<Link href="/blocks">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Blocks</a>
          </Link>}
          className="py-4 px-0"
        >
          <BlocksTable n={10} className="mt-3" />
        </Widget>
        <Widget
          title={<Link href="/transactions">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Transactions</a>
          </Link>}
          className="py-4 px-0"
        >
          <TransactionsTable page="index" className="mt-3" />
        </Widget>
      </div>
    </div>
  )
}