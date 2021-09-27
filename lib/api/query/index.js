import _ from 'lodash'

import { keygens as getKeygens } from '../opensearch'
import { getRequestUrl, rand } from '../../utils'

const api_name = 'data'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const getSummary = async params => {
  const path = '/summary'
  return {
    data: {
      block_height: rand(7234324),
      block_height_at: new Date().getTime(),
      avg_block_time: 5.19 + rand() / 100,
      active_validators: 18,
      total_validators: 32,
      online_voting_power_now: '35.02m',
      online_voting_power_now_percentage: 3.5,
      total_voting_power: '1.00b',
      corruption_signing_threshold: 5.1,
    }
  }
}

export const getUptime = async (id, params) => {
  const path = `/validators/${id}`
  const latestBlock = rand(7234324)
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