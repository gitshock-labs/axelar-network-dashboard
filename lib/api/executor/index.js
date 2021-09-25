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

export const getKeygensByValidator = async address => {
  let response = await axelard({ cmd: `axelard q tss key-shares-by-validator ${address}` })

  if (response && response.data && response.data.stdout) {
    response = response.data.stdout.split('- ').filter(key => key).map(key => Object.fromEntries(key.split('\n').map(attr => attr && attr.trim()).map(attr => attr.split(': ').map(kv => kv && kv.startsWith('"') && kv.endsWith('"') ? Number(kv.substring(1, kv.length - 1)) : kv)).filter(attr => attr[0])))
  }

  return response
}