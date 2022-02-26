import _ from 'lodash'

import { tx_manager } from '../../object/tx'
import { base64ToHex, base64ToBech32 } from '../../object/key'
// import { getRequestUrl } from '../../utils'

const request = async (path, params) => {
  // const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_INDEXER_URL, path, { ...params }))
  params = { ...params, path }

  const res = await fetch(process.env.NEXT_PUBLIC_INDEXER_URL, {
    method: 'POST',
    body: JSON.stringify(params),
  }).catch(error => { return null })
  return res && await res.json()
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
        status: tx_manager.status(hit._source),
        type: tx_manager.type(hit._source),
        fee: tx_manager.fee(hit._source, denoms),
        symbol: tx_manager.symbol(hit._source, denoms),
        gas_used: tx_manager.gas_used(hit._source),
        gas_limit: tx_manager.gas_limit(hit._source),
        memo: tx_manager.memo(hit._source),
        activities: tx_manager.activities(hit._source, denoms),
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
        hash: base64ToHex(hit._source.hash),
        proposer_address: base64ToBech32(hit._source.proposer_address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS),
        txs: typeof hit._source.txs === 'number' ? hit._source.txs : -1,
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
        id: hit._id,
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
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
    response.hits.hits = response.hits.hits.map(hit => {
      return {
        ...hit._source,
      }
    })

    response = {
      data: response.hits.hits,
      total: response.aggregations?.total?.buckets?.find(d => d?.key_as_string === 'true')?.doc_count || response.hits.total?.value,
    }
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
      data: _.orderBy(response.hits.hits.map(hit => hit._source), ['description.moniker'], ['asc']),
      total: response.hits.total?.value,
    }
  }

  return response
}

export const linkedAddresses = async params => {
  const path = '/linked_addresses/_search'

  params = {
    size: 0,
    ...params,
    index: 'linked_addresses',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
    fields: objectToString(params.fields),
  }

  let response = await request(path, params)

  if (response?.hits?.hits) {
    response = {
      data: response.hits.hits.map(hit => hit._source),
      total: response.hits.total?.value,
    }
  }

  return response
}

export const crosschainTxs = async params => {
  const path = '/crosschain_txs/_search'

  params = {
    size: 0,
    ...params,
    index: 'crosschain_txs',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
  }

  let response = await request(path, params)

  if (response?.aggregations?.from_chains?.buckets) {
    response = {
      data: response.aggregations.from_chains.buckets.flatMap(f => (
        f.to_chains?.buckets?.flatMap(t => (
          t.assets?.buckets?.map(a => {
            return {
              id: `${f.key}_${t.key}_${a.key}`,
              from_chain: f.key,
              to_chain: t.key,
              asset: a.key,
              tx: a.doc_count,
              amount: a.amounts?.value,
              avg_amount: a.avg_amounts?.value,
              max_amount: a.max_amounts?.value,
              since: a.since?.value,
              times: a.times?.buckets?.map(time => {
                return {
                  time: time.key,
                  tx: time.doc_count,
                  amount: time.amounts?.value,
                }
              }),
            }
          }) || []
        )) || []
      )) || [],
    }

    response.total = response.data?.length
  }
  else if (response?.aggregations?.assets?.buckets) {
    response = {
      data: response.aggregations.assets.buckets.flatMap(a => (
        a.to_chains?.buckets?.map(t => {
          return {
            id: `${a.key}_${t.key}`,
            asset: a.key,
            to_chain: t.key,
            tx: t.doc_count,
            amount: t.amounts?.value,
            avg_amount: t.avg_amounts?.value,
            max_amount: t.max_amounts?.value,
            since: t.since?.value,
            times: t.times?.buckets?.map(time => {
              return {
                time: time.key,
                tx: time.doc_count,
                amount: time.amounts?.value,
              }
            }),
          }
        }) || []
      )) || [],
    }

    response.total = response.data?.length
  }

  return response
}

export const evmVotes = async params => {
  const path = '/evm_votes/_search'

  params = {
    size: 0,
    ...params,
    index: 'evm_votes',
    method: 'search',
    aggs: objectToString(params.aggs),
    query: objectToString(params.query),
    sort: objectToString(params.sort),
    fields: objectToString(params.fields),
  }

  let response = await request(path, params)

  if (response?.aggregations?.votes?.buckets) {
    response = {
      data: Object.fromEntries(response.aggregations.votes.buckets.map(record => [
        record.key,
        {
          chains: Object.fromEntries((record.chains?.buckets || []).map(c => [
            c.key,
            {
              confirms: Object.fromEntries((c.confirms?.buckets || []).map(cf => [cf.key_as_string, cf.doc_count])),
              total: c.doc_count,
            },
          ])),
          total: record.doc_count,
        },
      ])),
      total: response.hits?.total?.value,
    }
  }
  else if (response?.hits?.hits) {
    response = {
      data: response.hits.hits.map(hit => hit._source),
      total: response.hits.total?.value,
    }
  }

  return response
}