import { getRequestUrl } from '../../utils'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../tx'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_INDEXER_URL, path, { ...params }))
  return await res.json()
}

export const transactions = async params => {
  const path = '/txs/_search'

  params = { ...params, index: 'txs', method: 'search', sort: params.sort ? typeof params.sort === 'object' ? JSON.stringify(params.sort) : params.sort : undefined }

  let response = await request(path, params)

  if (response && response.hits && response.hits.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
        status: getTxStatus(record._source),
        type: getTxType(record._source),
        fee: getTxFee(record._source),
        symbol: getTxSymbol(record._source),
        gas_used: getTxGasUsed(record._source),
        gas_limit: getTxGasLimit(record._source),
        memo: getTxMemo(record._source),
        activities: getTxActivities(record._source),
      }
    })

    response = { data: response.hits.hits }
  }

  return response
}