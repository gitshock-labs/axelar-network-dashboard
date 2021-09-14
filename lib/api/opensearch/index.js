import { randImage } from '../query'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../object/tx'
import { getRequestUrl, base64ToHex, base64ToBech32 } from '../../utils'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_INDEXER_URL, path, { ...params }))
  return await res.json()
}

export const transactions = async params => {
  const path = '/txs/_search'

  params = {
    ...params,
    index: 'txs',
    method: 'search',
    query: params.query ? typeof params.query === 'object' ? JSON.stringify(params.query) : params.query : undefined,
    sort: params.sort ? typeof params.sort === 'object' ? JSON.stringify(params.sort) : params.sort : undefined,
  }

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

    response = { data: response.hits.hits, total: response.hits.total && response.hits.total.value }
  }

  return response
}

export const blocks = async params => {
  const path = '/blocks/_search'

  params = {
    ...params,
    index: 'blocks',
    method: 'search',
    query: params.query ? typeof params.query === 'object' ? JSON.stringify(params.query) : params.query : undefined,
    sort: params.sort ? typeof params.sort === 'object' ? JSON.stringify(params.sort) : params.sort : undefined,
  }

  let response = await request(path, params)

  if (response && response.hits && response.hits.hits) {
    response.hits.hits = response.hits.hits.map((record, i) => {
      return {
        ...record._source,
        hash: base64ToHex(record._source.hash),
        proposer_address: base64ToBech32(record._source.proposer_address, process.env.NEXT_PUBLIC_PREFIX_VALIDATOR),
        proposer_image: randImage(i),
        txs: typeof record._source.txs === 'number' ? record._source.txs : -1,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total && response.hits.total.value }
  }

  return response
}