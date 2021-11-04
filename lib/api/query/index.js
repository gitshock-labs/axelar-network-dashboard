import _ from 'lodash'

import { genesis } from '../rpc'
import { prometheus } from '../prometheus'
import { uptimes/*, constants*/, keygens as getKeygens } from '../opensearch'
import { base64ToBech32 } from '../../object/key'
import { getRequestUrl, rand } from '../../utils'

const api_name = 'data'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const getUptime = async (latestBlock, address) => {
  let data

  const response = await uptimes({
    query: { range: { height: { gt: latestBlock - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_DISPLAY_BLOCKS) } } },
    size: Number(process.env.NEXT_PUBLIC_NUM_UPTIME_DISPLAY_BLOCKS),
  })

  if (response?.hits?.hits) {
    data = _.orderBy(response.hits.hits.map(uptime => uptime._source), ['height'], ['desc']).map(uptime => {
      return {
        ...uptime,
        up: uptime.validators.map(validator => base64ToBech32(validator, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS)).includes(address),
      }
    }).map(uptime => {
      return {
        ...uptime,
        // approved: uptime.up && rand() % 8,
        // denied: uptime.up && rand() % 2,
      }
    })
  }
  else {
    data = [...Array(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_DISPLAY_BLOCKS)).keys()].map(i => {
      return {
        height: latestBlock - i,
      }
    })
  }

  return { data }
}

export const keygenSummary = async params => {
  let response = await prometheus({ query: '{__name__=~"axelar_tss_minimum_keygen_threshold|axelar_tss_corruption_threshold"}' })

  let data = {
    active_keygen_threshold: Number(response?.data?.result?.find(metric => metric?.metric?.__name__ === 'axelar_tss_minimum_keygen_threshold' && metric.value?.[1])?.value[1]),
    corruption_signing_threshold: response?.data?.result && Object.fromEntries(response.data.result.filter(metric => metric?.metric && ['axelar_tss_corruption_threshold'].includes(metric.metric.__name__) && metric.value?.[1]).map(metric => [metric.metric.keyID, Number(metric.value[1])])),
  }

  // response = await constants({ size: 1, query: { match: { _id: 'app_message' } } })

  // if (response?.data) {
  //   data = { ...data, ...(_.head(response.data)) }
  // }

  response = await genesis()

  if (response?.result?.genesis?.app_state) {
    data = { ...data, ...response.result.genesis.app_state }
  }

  return data
}

export const keygens = async params => {
  const path = '/'

  params = { ...params, name: 'keygens' }

  let data = await request(path, params)

  const keygensData = await getKeygens({
    aggs: { keygens: { terms: { field: 'keygen.keyword', size: 100 } } },
    query: { exists: { field: 'keygen' } },
  })

  if (keygensData?.data) {
    data = _.uniq(_.concat(data, keygensData.data))
  }

  return data
}

export const bridgeAccounts = async params => {
  const path = '/'

  params = { ...params, name: 'bridge_accounts' }

  return await request(path, params)
}

export const denoms = async params => {
  const path = '/'

  params = { ...params, name: 'denoms' }

  return await request(path, params)
}