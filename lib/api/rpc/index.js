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