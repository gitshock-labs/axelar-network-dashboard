import _ from 'lodash'

import { prometheus } from '../prometheus'
import { keygens as getKeygens } from '../opensearch'
import { getRequestUrl, rand } from '../../utils'

const api_name = 'data'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const getUptime = async (id, params) => {
  const path = `/validators/${id}`
  const latestBlock = rand(20234)
  return {
    data: [...Array(250).keys()].map(i => {
      return {
        height: latestBlock - i,
        approved: rand() % 8,
        denied: rand() % 2,
      }
    })
  }
}

export const keygenSummary = async params => {
  const response = await prometheus({ query: '{__name__=~"axelar_tss_minimum_keygen_threshold|axelar_tss_corruption_threshold"}' })

  return {
    active_keygen_threshold: response && response.data && response.data.result && response.data.result[response.data.result.findIndex(metric => metric.metric && metric.metric.__name__ === 'axelar_tss_minimum_keygen_threshold' && metric.value && metric.value[1])] && Number(response.data.result[response.data.result.findIndex(metric => metric.metric && metric.metric.__name__ === 'axelar_tss_minimum_keygen_threshold' && metric.value && metric.value[1])].value[1]),
    corruption_signing_threshold: response && response.data && response.data.result && Object.fromEntries(response.data.result.filter(metric => metric.metric && ['axelar_tss_corruption_threshold'].includes(metric.metric.__name__) && metric.value && metric.value[1]).map(metric => [metric.metric.keyID, Number(metric.value[1])])),
  }
}

export const keygens = async params => {
  const path = '/'

  params = { ...params, name: 'keygens' }

  let data = await request(path, params)

  const keygensData = await getKeygens({
    aggs: { keygens: { terms: { field: 'keygen.keyword', size: 100 } } },
    query: { exists: { field: 'keygen' } },
  })

  if (keygensData && keygensData.data) {
    data = _.uniq(_.concat(data, keygensData.data))
  }

  return data
}

export const bridgeAccounts = async params => {
  const path = '/'

  params = { ...params, name: 'bridge_accounts' }

  return await request(path, params)
}