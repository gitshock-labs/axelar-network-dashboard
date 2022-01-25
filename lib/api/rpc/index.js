import { block } from '../cosmos'
import { getRequestUrl } from '../../utils'

const api_name = 'rpc'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const status = async (params, _status) => {
  const path = '/status'

  const response =  await request(path, params)

  if (response && Number(response?.earliest_block_height) > 0) {
    const block_variance = 1

    let earliest_block_height = Number(response.earliest_block_height)
    earliest_block_height = earliest_block_height + (earliest_block_height + block_variance < Number(response.latest_block_height) ? block_variance : 0)

    const resBlock = !_status && await block(earliest_block_height)

    response.earliest_block_height_for_cal = earliest_block_height
    response.earliest_block_time = resBlock?.data?.time || _status?.earliest_block_time
    response.chain_id = resBlock?.data?.chain_id || _status?.chain_id
    response.is_interval = !!_status
  }

  return response
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