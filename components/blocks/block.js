import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

import BlockDetail from './block-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { allValidators, block as getBlock, transactions as getTransactions } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Block({ height }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [block, setBlock] = useState(null)
  const [transactions, setTransactions] = useState(null)

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
      const response = await getBlock(height)

      if (response) {
        setBlock({ data: response.data || {}, height })
      }
    }

    if (height) {
      getData()
    }

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => clearInterval(interval)
  }, [height])

  useEffect(() => {
    const getData = async () => {
      // const response = await getTransactions({ query: { match: { height } }, size: 100, sort: [{ timestamp: 'desc' }] })
      let response

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

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [height])

  const validator_data = block && block.height === height && block.data && block.data.proposer_address && validators_data && _.head(validators_data.filter(validator_data => validator_data && validator_data.consensus_address === block.data.proposer_address))

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <BlockDetail data={block && block.height === height && block.data} validator_data={validator_data} />
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