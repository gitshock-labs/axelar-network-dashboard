import { getRequestUrl } from '../../utils'

const api_name = 'prometheus'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const prometheus = async params => {
  const path = '/api/v1/query'
  return await request(path, params)
}