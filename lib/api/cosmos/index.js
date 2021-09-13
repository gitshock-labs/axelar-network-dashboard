import _ from 'lodash'

import { getRequestUrl } from '../../utils'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../object/tx'

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

export const transactions = async (params, validator) => {
  const path = '/cosmos/tx/v1beta1/txs'

  let response = await request(path, params)

  if (response && response.tx_responses) {
    response.tx_responses = response.tx_responses.map(record => {
      const activities = getTxActivities(record)

      return {
        ...record,
        status: getTxStatus(record),
        type: getTxType(record),
        fee: getTxFee(record),
        symbol: getTxSymbol(record),
        gas_used: getTxGasUsed(record),
        gas_limit: getTxGasLimit(record),
        memo: getTxMemo(record),
        activities,
        vote: validator && activities ?
          activities.findIndex(activity => activity && activity.participants && activity.participantShareCounts && JSON.parse(activity.participants).includes(validator)) > -1 ?
            activities.findIndex(activity => activity && activity.participants && activity.participantShareCounts && JSON.parse(activity.participantShareCounts)[JSON.parse(activity.participants).indexOf(validator)] === '1') > -1 ?
              'approved'
              :
              'denied'
            :
            null
          :
          null,
      }
    })

    response = { data: response.tx_responses, pagination: response.pagination, total: response.pagination && Number(response.pagination.total) }
  }

  return response
}

export const transactionsByEvents = async (events, data, validator) => {
  let pageKey = true

  let txsData = []

  while (pageKey && txsData.length < 100) {
    const response = await transactions({ events, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined }, validator)

    txsData = _.uniqBy(_.concat(txsData, (response && response.data) || []), 'txhash')

    pageKey = response && response.pagination && response.pagination.next_key
  }

  return _.orderBy(_.uniqBy(_.concat(data || [], txsData), 'txhash'), ['timestamp', 'height'], ['desc', 'desc'])
}

export const validators = async params => {
  const path = '/cosmos/staking/v1beta1/validators'
  return await request(path, params)
}