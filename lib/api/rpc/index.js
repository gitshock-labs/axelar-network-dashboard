import { getRequestUrl } from '../../utils'

const api_name = 'rpc'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const status = async params => {
  const path = '/status'
  return await request(path, params)
}

export const netInfo = async params => {
  const path = '/net_info'
  return await request(path, params)
}

export const genesis = async params => {
  const path = '/genesis'
  return await request(path, params)
}

export const consensusState = async params => {
  const path = '/dump_consensus_state'
  return await request(path, params)
}