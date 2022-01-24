import { getRequestUrl } from '../../utils'

const api_name = 'crosschain_config'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const chains = async params => {
  const path = '/'

  params = { ...params, name: `chains_${process.env.NEXT_PUBLIC_NETWORK}` }

  const response = await request(path, params)
  return response
}

export const cosmosChains = async params => {
  const path = '/'

  params = { ...params, name: `cosmos_chains_${process.env.NEXT_PUBLIC_NETWORK}` }

  const response = await request(path, params)
  return response
}

export const assets = async params => {
  const path = '/'

  params = { ...params, name: `assets_${process.env.NEXT_PUBLIC_NETWORK}` }

  const response = await request(path, params)
  return response
}