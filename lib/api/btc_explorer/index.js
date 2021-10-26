import { getRequestUrl } from '../../utils'

const api_name = 'btc_explorer'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const transaction = async (tx, params) => {
  const path = `/tx/${tx}`
  return await request(path, params)
}