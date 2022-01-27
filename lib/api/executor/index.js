import _ from 'lodash'

import { getRequestUrl, convertToJson } from '../../utils'

const api_name = 'executor'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const axelard = async params => {
  const path = '/'
  return await request(path, params)
}

export const gaiad = async params => {
  const path = '/'
  return await request(path, params)
}

export const terrad = async params => {
  const path = '/'
  return await request(path, params)
}

export const getKeygensByValidator = async (address, params) => {
  let response = await axelard({ ...params, cmd: `axelard q tss key-shares-by-validator ${address} -oj`, cache: true, cache_timeout: 1 })

  response = convertToJson(response?.data?.stdout)?.map(k => {
    return {
      ...k,
      snapshot_block_number: Number(k?.snapshot_block_number),
      num_validator_shares: Number(k?.num_validator_shares),
      num_total_shares: Number(k?.num_total_shares),
    }
  }) || []

  return response
}

export const getKeygenById = async (id, params) => {
  let response = await axelard({ ...params, cmd: `axelard q tss key-shares-by-key-id ${id}` })

  if (response?.data?.stdout) {
    response = _.head(Object.values(_.groupBy(response.data.stdout.split('- ').filter(key => key && !(['null'].includes(key))).map(key => Object.fromEntries(key.split('\n').map(attr => attr?.trim()).map(attr => attr.split(': ').map(kv => kv?.startsWith('"') && kv.endsWith('"') ? Number(kv.substring(1, kv.length - 1)) : kv)).filter(attr => attr[0]))), 'key_id')).map(values => { return { ..._.head(values), num_validator_shares: undefined, validator_address: undefined, validators: values.map(value => { return { address: value.validator_address, share: value.num_validator_shares } }) } }))
  }

  return response
}