import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'

import TransactionDetail from './transaction-detail'
import TransactionLogs from './transaction-logs'
import TransactionRawLogs from './transaction-raw-logs'
import Widget from '../widget'

import { transaction as getTransaction } from '../../lib/api/cosmos'
import { gaiad } from '../../lib/api/executor'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../lib/object/tx'
import { numberFormat, convertToJson } from '../../lib/utils'

export default function Transaction({ tx }) {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data } = { ...data }

  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        let response = await getTransaction(tx, null, denoms_data)

        // if (!response?.data) {
        //   response = await gaiad({ cmd: `gaiad q tx ${tx} -oj` })

        //   if (response?.data?.stdout && convertToJson(response.data.stdout)) {
        //     response.data = convertToJson(response.data.stdout)

        //     response.data.status = getTxStatus(response.data)
        //     response.data.type = getTxType(response.data)
        //     response.data.fee = getTxFee(response.data, denoms_data)
        //     response.data.symbol = getTxSymbol(response.data, denoms_data)
        //     response.data.gas_used = getTxGasUsed(response.data)
        //     response.data.gas_limit = getTxGasLimit(response.data)
        //     response.data.memo = getTxMemo(response.data)
        //     response.data.activities = getTxActivities(response.data, denoms_data)
        //   }
        // }

        if (response) {
          setTransaction({ data: response.data || {}, tx })
        }
      }
    }

    if (tx && denoms_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [tx, denoms_data])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <TransactionDetail data={transaction?.tx === tx && transaction?.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Activities</span>
          {transaction?.tx === tx && transaction?.data?.activities && (
            <span>({transaction.data.activities.length})</span>
          )}
        </div>}
        className="bg-transparent border-0 p-0 md:pt-4 md:pb-8 md:px-8"
      >
        <TransactionLogs data={transaction?.tx === tx && transaction?.data} />
        <TransactionRawLogs data={transaction?.tx === tx && transaction?.data} />
      </Widget>
    </div>
  )
}