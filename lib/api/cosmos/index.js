import _ from 'lodash'

import { getRequestUrl } from '../../utils'

const api_name = 'cosmos'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const getTxStatus = data => data && !data.code ? 'success' : 'failed'

export const getTxType = data => _.head(data && data.logs && data.logs.flatMap(log => log.events && log.events.map(event => event.type).filter(type => type !== 'message')/*.flatMap(event => event.attributes && event.attributes.filter(attribute => attribute.key === 'action').map(attribute => attribute.value))*/))

export const getTxFee = data => data && data.tx && data.tx.auth_info && data.tx.auth_info.fee && data.tx.auth_info.fee.amount && _.sumBy(data.tx.auth_info.fee.amount, 'amount') / Math.pow(10, 6)

export const getTxSymbol = data => data && data.tx && data.tx.auth_info && data.tx.auth_info.fee && data.tx.auth_info.fee.amount && _.head(data.tx.auth_info.fee.amount.map(amount => amount && amount.denom && amount.denom.replace('u', '')).filter(denom => denom))

export const getTxGasUsed = data => data && Number(data.gas_used)

export const getTxGasLimit = data => data && Number(data.gas_wanted)

export const getTxMemo = data => data && data.tx && data.tx.body && data.tx.body.memo

export const getTxActivities = data => data && data.logs && data.logs.map(log => log && log.events && _.assign.apply(_, (log.events.map(event => { return { type: event.type, ...((event.attributes && _.assign.apply(_, event.attributes.filter(attribute => !(event.type !== 'message' && attribute.key === 'action')).map(attribute => { return { [`${attribute.key}`]: attribute.key === 'amount' && typeof attribute.value === 'string' ? Number(attribute.value.substring(0, attribute.value.split('').findIndex(c => isNaN(c)))) / Math.pow(10, attribute.value.indexOf('u') ? 6 : 0) : attribute.value, symbol: attribute.key === 'amount' && typeof attribute.value === 'string' ? attribute.value.substring(attribute.value.split('').findIndex(c => isNaN(c))).replace('u', '') : undefined } }))) || {}) } }))))

export const transaction = async (tx, params) => {
  const path = `/cosmos/tx/v1beta1/txs/${tx}`

  const response = await request(path, params)

  if (response && response.tx_response) {
    response.tx_response.status = getTxStatus(response.tx_response)
    response.tx_response.type = getTxType(response.tx_response)
    response.tx_response.fee = getTxFee(response.tx_response)
    response.tx_response.symbol = getTxSymbol(response.tx_response)
    response.tx_response.gas_used = getTxGasUsed(response.tx_response)
    response.tx_response.gas_limit = getTxGasLimit(response.tx_response)
    response.tx_response.memo = getTxMemo(response.tx_response)
    response.tx_response.activities = getTxActivities(response.tx_response)
  }

  return response
}