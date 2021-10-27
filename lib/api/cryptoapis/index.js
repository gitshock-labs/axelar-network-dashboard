import { getRequestUrl } from '../../utils'

const api_name = 'cryptoapis'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const ethTx = async (tx, params) => {
  const path = `/blockchain-data/ethereum/${process.env.NEXT_PUBLIC_ETHEREUM_NETWORK}/transactions/${tx}`
  return await request(path, params)
}