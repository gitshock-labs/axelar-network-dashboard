import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import Summary from './summary'
import BlocksTable from '../blocks/blocks-table'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { getSummary } from '../../lib/api/query'
import { allValidators } from '../../lib/api/cosmos'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)

  useEffect(() => {
    const getValidators = async () => {
      const response = await allValidators({}, validators_data)

      if (response) {
        dispatch({
          type: VALIDATORS_DATA,
          value: response.data
        })
      }
    }

    getValidators()

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getData = async () => {
      const response = await getSummary()

      if (response) {
        setSummaryData({ data: response.data || {} })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="my-4 mx-auto pb-2">
      <Summary data={summaryData && summaryData.data} />
      <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 my-4">
        <div className="mt-3">
          <Link href="/blocks">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Blocks</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <BlocksTable n={10} className="bg-white dark:bg-gray-900" />
          </Widget>
        </div>
        <div className="mt-8 md:mt-3">
          <Link href="/transactions">
            <a className="text-gray-900 dark:text-gray-100 text-base font-semibold mx-3">Latest Transactions</a>
          </Link>
          <div className="h-1" />
          <Widget className="min-h-full contents p-0">
            <TransactionsTable page="index" className="bg-white dark:bg-gray-900" />
          </Widget>
        </div>
      </div>
    </div>
  )
}