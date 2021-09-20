import { getRequestUrl } from '../../utils'

const api_name = 'executor'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const axelard = async params => {
  const path = '/'
  return await request(path, params)
}