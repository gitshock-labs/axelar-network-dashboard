import { useState, useEffect } from 'react'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getKeygen, getKeys } from '../../lib/api/query'

export default function Keygen() {
  const [data, setData] = useState(null)
  const [keys, setKeys] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let response = await getKeygen()

      if (response) {
        setData({ data: response.data || {} })
      }

      response = await getKeys()

      if (response) {
        setKeys({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="my-4 xl:my-6 mx-auto">
      <Summary data={data && data.data} />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-4 my-2 md:my-4">
        <Widget
          title={<span className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Blocks</span>}
          className="py-4 px-0"
        >
          <div className="mt-3">
            <BlocksTable />
          </div>
        </Widget>
        <Widget
          title={<span className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Transactions</span>}
          className="py-4 px-0"
        >
          <div className="mt-3">
            <TransactionsTable page="index" />
          </div>
        </Widget>
      </div>
    </div>
  )
}