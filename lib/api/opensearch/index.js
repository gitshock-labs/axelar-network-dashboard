import _ from 'lodash'

import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../object/tx'
import { base64ToHex, base64ToBech32 } from '../../object/key'
import { getRequestUrl } from '../../utils'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_INDEXER_URL, path, { ...params }))
  return await res.json()
}

const objectToString = object => object ? typeof object === 'object' ? JSON.stringify(object) : object : undefined

export const transactions = async (params, denoms) => {
  const path = '/txs/_search'

  params = {
    ...params,
    index: 'txs',
    method: 'search',
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
        status: getTxStatus(record._source),
        type: getTxType(record._source),
        fee: getTxFee(record._source, denoms),
        symbol: getTxSymbol(record._source, denoms),
        gas_used: getTxGasUsed(record._source),
        gas_limit: getTxGasLimit(record._source),
        memo: getTxMemo(record._source),
        activities: getTxActivities(record._source, denoms),
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
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

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
        hash: base64ToHex(record._source.hash),
        proposer_address: base64ToBech32(record._source.proposer_address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS),
        txs: typeof record._source.txs === 'number' ? record._source.txs : -1,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
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
    fields: objectToString(params.fields),
  }

  let response = await request(path, params)

  if (response?.aggregations?.uptimes?.buckets) {
    response = {
      data: Object.fromEntries(response.aggregations.uptimes.buckets.map(record => [base64ToBech32(record.key, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS), record.doc_count])),
      total: response.hits?.total?.value,
    }
  }

  return response
}

export const heartbeats = async params => {
  const path = '/heartbeats/_search'

  params = {
    size: 0,
    ...params,
    index: 'heartbeats',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
    fields: objectToString(params.fields),
  }

  let response = await request(path, params)

  if (response?.aggregations?.heartbeats?.buckets) {
    response = {
      data: Object.fromEntries(response.aggregations.heartbeats.buckets.map(record => [record.key, record.heightgroup?.buckets && record.heightgroup?.buckets.length <= 100000 ? record.heightgroup.buckets.length : record.doc_count])),
      total: response.hits?.total?.value,
    }
  }

  return response
}

export const transfers = async params => {
  const path = '/transfers/_search'

  params = {
    size: 0,
    ...params,
    index: 'transfers',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.aggregations?.transfers?.buckets) {
    response = {
      data: response.aggregations.transfers.buckets.flatMap(record =>
        record?.assets?.buckets?.map(_record => {
          return {
            id: `${record.key}_${_record.key}`,
            chain: record.key,
            asset: _record.key,
            tx: _record.doc_count,
            amount: _record.amounts?.value,
            avg_amount: _record.avg_amounts?.value,
            since: _record.since?.value,
            times: _record.times?.buckets?.map(time => {
              return {
                time: time.key,
                tx: time.doc_count,
                amount: time.amounts?.value,
              }
            }),
            token_address: _.head(_record.token_address?.buckets?.map(address => address.key).filter(address => address)),
            transfer_action: _.head(_record.transfer_action?.buckets?.map(action => action.key).filter(action => action)),
          }
        }) || []
      ),
    }

    response.total = response.data?.length
  }
  else if (response?.aggregations?.assets?.buckets) {
    response = {
      data: response.aggregations.assets.buckets.map(record => {
        return {
          id: record.key,
          asset: record.key,
          tx: record.doc_count,
          amount: record.amounts?.value,
        }
      }),
    }

    response.total = response.data?.length
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

  if (response?.aggregations?.keygens?.buckets) {
    response = {
      data: response.aggregations.keygens.buckets.map(keygen => keygen.key),
      total: response.hits?.total?.value,
    }
  }

  return response
}

export const searchAxelard = async params => {
  const path = '/axelard/_search'

  params = {
    ...params,
    index: 'axelard',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
        id: record._id,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
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

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
  }

  return response
}

export const successKeygens = async params => {
  const path = '/keygens/_search'

  params.query = { bool: { must_not: [{ exists: { field: 'failed' } }] } }

  params = {
    ...params,
    index: 'keygens',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
  }

  return response
}

export const failedKeygens = async params => {
  const path = '/keygens/_search'

  params.query = { match: { failed: true } }

  params = {
    ...params,
    index: 'keygens',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.hits?.hits) {
    response.hits.hits = response.hits.hits.map(record => {
      return {
        ...record._source,
      }
    })

    response = { data: response.hits.hits, total: response.hits.total?.value }
  }

  return response
}

export const historical = async params => {
  const path = '/historical/_search'

  params = {
    size: 0,
    ...params,
    index: 'historical',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
    fields: objectToString(params.fields),
  }

  let response = await request(path, params)

  if (response?.aggregations?.historical?.buckets) {
    response = {
      data: Object.fromEntries(response.aggregations.historical.buckets.map(record => [record.key, record.doc_count])),
      total: response.hits?.total?.value,
    }
  }

  if (response?.aggregations?.validators?.buckets) {
    response = {
      data: response.aggregations.validators.buckets.map(record => {
        return {
          operator_address: record.key,
          description: {
            moniker: _.head(record.moniker?.buckets?.map(obj => obj?.key).filter(v => v)),
            identity: _.head(record.identity?.buckets?.map(obj => obj?.key).filter(v => v)),
          },
          supported_chains: record.supported_chains?.buckets?.filter(obj => obj?.key && obj?.doc_count).map(obj => { return { chain: obj.key, count: obj.doc_count } }) || [],
          vote_participated: record.vote_participated?.value,
          vote_not_participated: record.vote_not_participated?.value,
          keygen_participated: record.keygen_participated?.value,
          keygen_not_participated: record.keygen_not_participated?.value,
          sign_participated: record.sign_participated?.value,
          sign_not_participated: record.sign_not_participated?.value,
          up_heartbeats: record.up_heartbeats?.value,
          missed_heartbeats: record.missed_heartbeats?.value,
          ineligibilities_jailed: record.ineligibilities_jailed?.value,
          ineligibilities_tombstoned: record.ineligibilities_tombstoned?.value,
          ineligibilities_missed_too_many_blocks: record.ineligibilities_missed_too_many_blocks?.value,
          ineligibilities_no_proxy_registered: record.ineligibilities_no_proxy_registered?.value,
          ineligibilities_proxy_insuficient_funds: record.ineligibilities_proxy_insuficient_funds?.value,
          ineligibilities_tss_suspended: record.ineligibilities_tss_suspended?.value,
          up_blocks: record.up_blocks?.value,
          missed_blocks: record.missed_blocks?.value,
          num_blocks_jailed: record.num_blocks_jailed?.value,
        }
      }),
      total: response.aggregations.validators.buckets.length,
    }
  }

  if (response?.hits?.hits) {
    response = {
      data: _.orderBy(response.hits.hits.map(_validator => _validator._source), ['description.moniker'], ['asc']),
      total: response.hits.total?.value,
    }
  }

  return response
}