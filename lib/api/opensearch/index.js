import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../object/tx'
import { base64ToHex, base64ToBech32 } from '../../object/key'
import { getRequestUrl } from '../../utils'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_INDEXER_URL, path, { ...params }))
  return await res.json()
}

const objectToString = object => object ? typeof object === 'object' ? JSON.stringify(object) : object : undefined

export const transactions = async params => {
  const path = '/txs/_search'

  params = {
    ...params,
    index: 'txs',
    method: 'search',
    query: objectToString(params.query),
    sort: objectToString(params.sort),
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
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response && response.hits && response.hits.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
        hash: base64ToHex(record._source.hash),
        proposer_address: base64ToBech32(record._source.proposer_address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS),
        txs: typeof record._source.txs === 'number' ? record._source.txs : -1,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total && response.hits.total.value }
  }

  return response
}

export const uptimes = async params => {
  const path = '/uptimes/_search'

  params = {
    size: 0,
    ...params,
    index: 'uptimes',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response && response.aggregations && response.aggregations.uptimes && response.aggregations.uptimes.buckets) {
    response = {
      data: Object.fromEntries(response.aggregations.uptimes.buckets.map(record => [base64ToBech32(record.key, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS), record.doc_count])),
      total: response.hits && response.hits.total && response.hits.total.value,
    }
  }

  return response
}

export const keygens = async params => {
  const path = '/txs/_search'

  params = {
    size: 0,
    ...params,
    index: 'txs',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response && response.aggregations && response.aggregations.keygens && response.aggregations.keygens.buckets) {
    response = {
      data: response.aggregations.keygens.buckets.map(keygen => keygen.key),
      total: response.hits && response.hits.total && response.hits.total.value,
    }
  }

  return response
}

export const signAttempts = async params => {
  const path = '/sign_attempts/_search'

  params = {
    ...params,
    index: 'sign_attempts',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response && response.hits && response.hits.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total && response.hits.total.value }
  }

  return response
}

export const failedKeygens = async params => {
  const path = '/failed_keygens/_search'

  params = {
    ...params,
    index: 'failed_keygens',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response && response.hits && response.hits.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total && response.hits.total.value }
  }

  return response
}