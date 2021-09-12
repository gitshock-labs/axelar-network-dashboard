import { getRequestUrl } from '../../utils'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../tx'

const api_name = 'cosmos'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const transaction = async (tx, params) => {
  const path = `/cosmos/tx/v1beta1/txs/${tx}`

  let response = await request(path, params)

  if (response && response.tx_response) {
    response.tx_response.status = getTxStatus(response.tx_response)
    response.tx_response.type = getTxType(response.tx_response)
    response.tx_response.fee = getTxFee(response.tx_response)
    response.tx_response.symbol = getTxSymbol(response.tx_response)
    response.tx_response.gas_used = getTxGasUsed(response.tx_response)
    response.tx_response.gas_limit = getTxGasLimit(response.tx_response)
    response.tx_response.memo = getTxMemo(response.tx_response)
    response.tx_response.activities = getTxActivities(response.tx_response)

    response = { data: response.tx_response }
  }

  return response
}

export const transactions = async params => {
  const path = '/cosmos/tx/v1beta1/txs'

  let response = await request(path, params)

  if (response && response.tx_responses) {
    response.tx_responses = response.tx_responses.map(record => {
      return {
        ...record,
        status: getTxStatus(record),
        type: getTxType(record),
        fee: getTxFee(record),
        symbol: getTxSymbol(record),
        gas_used: getTxGasUsed(record),
        gas_limit: getTxGasLimit(record),
        memo: getTxMemo(record),
        activities: getTxActivities(record),
      }
    })

    response = { data: response.tx_responses, pagination: response.pagination, total: response.pagination && Number(response.pagination.total) }
  }

  return response
}

export const validators = async params => {
  const path = '/cosmos/staking/v1beta1/validators'
  return await request(path, params)
}