import _ from 'lodash'

import { uptimes } from '../opensearch'
import { axelard } from '../executor'
import { getTxStatus, getTxType, getTxFee, getTxSymbol, getTxGasUsed, getTxGasLimit, getTxMemo, getTxActivities } from '../../object/tx'
import { base64ToHex, base64ToBech32, delegatorAddress, pubKeyToBech32 } from '../../object/key'
import { getRequestUrl, randImage } from '../../utils'

const api_name = 'cosmos'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const stakingParams = async params => {
  const path = '/cosmos/staking/v1beta1/params'
  return await request(path, params)
}

export const stakingPool = async params => {
  const path = '/cosmos/staking/v1beta1/pool'
  return await request(path, params)
}

export const bankSupply = async (denom, params) => {
  const path = `/cosmos/bank/v1beta1/supply${denom ? `/${denom}` : ''}`
  return await request(path, params)
}

export const communityPool = async params => {
  const path = '/cosmos/distribution/v1beta1/community_pool'
  return await request(path, params)
}

export const mintInflation = async params => {
  const path = '/cosmos/mint/v1beta1/inflation'
  return await request(path, params)
}

export const validatorSets = async params => {
  const path = '/validatorsets/latest'
  return await request(path, params)
}

export const bankBalances = async (address, params) => {
  const path = `/cosmos/bank/v1beta1/balances/${address}`
  return await request(path, params)
}

export const allBankBalances = async (address, params) => {
  let pageKey = true

  let data = []

  while (pageKey) {
    const response = await bankBalances(address, { ...params, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

    data = _.uniqBy(_.concat(data, response.balances || []), 'denom')

    pageKey = response && response.pagination && response.pagination.next_key
  }

  return { data }
}

export const stakingDelegations = async (address, params) => {
  const path = `/cosmos/staking/v1beta1/delegations/${address}`
  return await request(path, params)
}

export const allStakingDelegations = async (address, params) => {
  let pageKey = true

  let data = []

  while (pageKey) {
    const response = await stakingDelegations(address, { ...params, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

    data = _.uniqBy(_.concat(data, response.delegation_responses || []), 'delegation.delegator_address')

    pageKey = response && response.pagination && response.pagination.next_key
  }

  return { data }
}

export const stakingUnbonding = async (address, params) => {
  const path = `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`
  return await request(path, params)
}

export const allStakingUnbonding = async (address, params) => {
  let pageKey = true

  let data = []

  while (pageKey) {
    const response = await stakingUnbonding(address, { ...params, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

    data = _.uniqBy(_.concat(data, response.unbonding_responses || []), 'delegator_address')

    pageKey = response && response.pagination && response.pagination.next_key
  }

  return { data }
}

export const distributionRewards = async (address, params) => {
  const path = `/cosmos/distribution/v1beta1/delegators/${address}/rewards`
  return await request(path, params)
}

export const distributionCommission = async (address, params) => {
  const path = `/cosmos/distribution/v1beta1/validators/${address}/commission`
  return await request(path, params)
}

export const stakingDelegationsAddress = async (operator_address, delegator_address, params) => {
  const path = `/cosmos/staking/v1beta1/validators/${operator_address}/delegations/${delegator_address}`
  return await request(path, params)
}

export const stakingDelegationsAddressUnbonding = async (operator_address, delegator_address, params) => {
  const path = `/cosmos/staking/v1beta1/validators/${operator_address}/delegations/${delegator_address}/unbonding_delegation`
  return await request(path, params)
}

export const transaction = async (tx, params) => {
  const path = `/cosmos/tx/v1beta1/txs/${tx}`

  let response = await request(path, params)

  if (response && response.tx_response) {
    response.tx_response.status = getTxStatus(response.tx_response)
    response.tx_response.type = getTxType(response.tx_response)
    response.tx_response.fee = getTxFee(response.tx_response)
    response.tx_response.symbol = getTxSymbol(response.tx_response)
    response.tx_response.gas_used = getTxGasUsed(response.tx_response)
    response.tx_response.gas_limit = getTxGasLimit(response.tx_response)
    response.tx_response.memo = getTxMemo(response.tx_response)
    response.tx_response.activities = getTxActivities(response.tx_response)

    response = { data: response.tx_response }
  }

  return response
}

export const transactions = async (params, validator) => {
  const path = '/cosmos/tx/v1beta1/txs'

  let response = await request(path, params)

  if (response && response.tx_responses) {
    response.tx_responses = response.tx_responses.map(record => {
      const activities = getTxActivities(record)

      return {
        ...record,
        status: getTxStatus(record),
        type: getTxType(record),
        fee: getTxFee(record),
        symbol: getTxSymbol(record),
        gas_used: getTxGasUsed(record),
        gas_limit: getTxGasLimit(record),
        memo: getTxMemo(record),
        activities,
        participated: validator && activities && activities.findIndex(activity => activity && activity.participants && JSON.parse(activity.participants).includes(validator)) > -1,
        vote: validator && activities ?
          activities.findIndex(activity => activity && activity.participants && JSON.parse(activity.participants).includes(validator)) > -1 ?
            activities.findIndex(activity => activity && activity.participants && activity.participantShareCounts && JSON.parse(activity.participantShareCounts)[JSON.parse(activity.participants).indexOf(validator)] !== '0') > -1 ?
              'approved'
              :
              'denied'
            :
            null
          :
          null,
      }
    })

    response = { data: response.tx_responses, pagination: response.pagination, total: response.pagination && Number(response.pagination.total) }
  }

  return response
}

export const transactionsByEvents = async (events, data, validator, isUnlimit) => {
  let pageKey = true
  let total = 1000
  const page_size = 100
  const max_size = 1000
  let loop_count = 0

  let txsData = []

  while ((pageKey || total) && txsData.length < total && (isUnlimit || txsData.length < max_size) && (loop_count < Math.ceil((isUnlimit ? total : max_size) / page_size))) {
    const response = await transactions({
      events,
      'pagination.key': (isUnlimit || total <= max_size) && pageKey && typeof pageKey === 'string' ? pageKey : undefined,
      'pagination.offset': (isUnlimit || total <= max_size) && pageKey && typeof pageKey === 'string' ?
        undefined
        :
        txsData.length > 0 && total + (total % page_size === 0 ? 0 : page_size - (total % page_size)) - txsData.length >= page_size ?
          total + (total % page_size === 0 ? 0 : page_size - (total % page_size)) - txsData.length > total ?
            total
            :
            total + (total % page_size === 0 ? 0 : page_size - (total % page_size)) - txsData.length
          :
          txsData.length,
    }, validator)

    txsData = _.uniqBy(_.concat(txsData, (response && response.data) || []), 'txhash')

    pageKey = response && response.pagination && response.pagination.next_key

    total = response && response.pagination && Number(response.pagination.total)

    loop_count++
  }

  return _.orderBy(_.uniqBy(_.concat(data || [], txsData), 'txhash'), ['timestamp', 'height'], ['desc', 'desc'])
}

export const block = async (height, params) => {
  const path = `/cosmos/base/tendermint/v1beta1/blocks/${height}`

  let response = await request(path, params)

  if (response && response.block && response.block.header) {
    response.block.header.hash = base64ToHex(response.block_id && response.block_id.hash)
    response.block.header.proposer_address = base64ToBech32(response.block.header.proposer_address, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS)
    response.block.header.txs = response.block.data && response.block.data.txs && typeof response.block.data.txs.length === 'number' ? response.block.data.txs.length : -1

    response = { data: response.block.header }
  }

  return response
}

const validatorProfile = async params => {
  const path = 'https://keybase.io/_/api/1.0/user/lookup.json'

  const res = await fetch(getRequestUrl(path, null, { ...params, fields: 'pictures' }))
  return await res.json()
}

export const validators = async (params, validatorsData, status, addresses) => {
  const path = '/cosmos/staking/v1beta1/validators'

  let response = await request(path, params)

  if (response && response.validators) {
    const validators_data = response.validators

    for (let i = 0; i < validators_data.length; i++) {
      let validator_data = validators_data[i]

      if (validator_data) {
        if (validator_data.description) {
          if (validator_data.description.identity) {
            if (validatorsData && validatorsData.findIndex(_validator_data => _validator_data.description && _validator_data.description.image && _validator_data.operator_address === validator_data.operator_address) > -1) {
              validator_data.description.image = validatorsData[validatorsData.findIndex(_validator_data => _validator_data.description && _validator_data.description.image && _validator_data.operator_address === validator_data.operator_address)].description.image
            }
            else {
              const responseProfile = await validatorProfile({ key_suffix: validator_data.description.identity })

              if (responseProfile && responseProfile.them && responseProfile.them[0] && responseProfile.them[0].pictures && responseProfile.them[0].pictures.primary && responseProfile.them[0].pictures.primary.url) {
                validator_data.description.image = responseProfile.them[0].pictures.primary.url
              }
            }
          }

          validator_data.description.image = validator_data.description.image || randImage(i)
        }

        validator_data.delegator_address = delegatorAddress(validator_data.operator_address)
        if (validator_data.consensus_pubkey && validator_data.consensus_pubkey.key) {
          validator_data.consensus_address = pubKeyToBech32(validator_data.consensus_pubkey.key, process.env.NEXT_PUBLIC_PREFIX_CONSENSUS)
        }

        if (validator_data.delegator_address && typeof validator_data.self_delegation !== 'number' && addresses && addresses.includes(validator_data.operator_address)) {
          validator_data = await validatorSelfDelegation(validator_data, validatorsData, true)
        }

        validator_data.tokens = Number(validator_data.tokens)
        validator_data.delegator_shares = Number(validator_data.delegator_shares)
      }

      validators_data[i] = validator_data
    }

    response = { data: validators_data }
  }

  return response
}

export const allValidators = async (params, validatorsData, status, addresses, latestBlock) => {
  addresses = addresses && !Array.isArray(addresses) ? [addresses] : addresses

  let pageKey = true

  let data = []

  while (pageKey) {
    const response = await validators({ ...params, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined }, validatorsData, status, addresses)

    data = _.orderBy(_.uniqBy(_.concat(data, (response && response.data) || []), 'operator_address'), ['description.moniker'], ['asc'])

    pageKey = response && response.pagination && response.pagination.next_key
  }

  if (latestBlock && (['active'].includes(status) || addresses)) {
    const response = await uptimes({
      aggs: { uptimes: { terms: { field: 'validators.keyword', size: data.length } } },
      query: { range: { height: { gt: latestBlock - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) } } },
    })

    if (response && response.data) {
      data = data.map(validator_data => {
        return {
          ...validator_data,
          uptime: validator_data.consensus_address && typeof response.data[validator_data.consensus_address] === 'number' ?
            response.data[validator_data.consensus_address] * 100 / (response.total || Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS))
            :
            0,
        }
      }).map(validator_data => {
        return {
          ...validator_data,
          uptime: typeof validator_data.uptime === 'number' ? validator_data.uptime > 100 ? 100 : validator_data.uptime < 0 ? 0 : validator_data.uptime : undefined,
        }
      })
    }
  }

  if (status || addresses) {
    let response = await axelard({ cmd: 'axelard q tss deactivated-operators' })

    if (response && response.data && response.data.stdout) {
      const deregisteringAddresses = response.data.stdout.split('operator_addresses:').join('').split('- ').join('').split('\n').map(address => address && address.trim()).filter(address => address)

      data = _.orderBy(data.map(validator_data => { return { ...validator_data, deregistering: deregisteringAddresses.includes(validator_data.operator_address) } }), ['deregistering', 'description.moniker'], ['asc', 'asc'])
    }

    response = await axelard({ cmd: 'axelard q snapshot validators -oj' })

    if (response && response.data && response.data.stdout) {
      try {
        const illegibleAddresses = JSON.parse(response.data.stdout).validators.filter(validator_data => validator_data.tss_illegibility_info && Object.values(validator_data.tss_illegibility_info).findIndex(value => value) > -1)

        data = _.orderBy(data.map(validator_data => {
          return {
            ...validator_data,
            illegible: illegibleAddresses.findIndex(_validator_data => _validator_data.operator_address === validator_data.operator_address) > -1,
            tss_illegibility_info: illegibleAddresses.findIndex(_validator_data => _validator_data.operator_address === validator_data.operator_address) > -1 ?
              illegibleAddresses[illegibleAddresses.findIndex(_validator_data => _validator_data.operator_address === validator_data.operator_address)].tss_illegibility_info
              :
              null
          }
        }), ['deregistering', 'description.moniker'], ['asc', 'asc'])
      }
      catch (error) {}
    }
  }

  return { data }
}

export const allValidatorsSelfDelegation = async (validatorsData, status) => {
  for (let i = 0; i < validatorsData.length; i++) {
    let validator_data = validatorsData[i]

    validator_data = await validatorSelfDelegation(validator_data, validatorsData, status)

    validatorsData[i] = validator_data
  }

  return validatorsData
}

export const validatorSelfDelegation = async (validator_data, validatorsData, status) => {
  if (validator_data) {
    if (validator_data.delegator_address && typeof validator_data.self_delegation !== 'number') {
      if (validatorsData && validatorsData.findIndex(_validator_data => typeof _validator_data.self_delegation === 'number' && _validator_data.operator_address === validator_data.operator_address) > -1) {
        validator_data.self_delegation = validatorsData[validatorsData.findIndex(_validator_data => typeof _validator_data.self_delegation === 'number' && _validator_data.operator_address === validator_data.operator_address)].self_delegation
      }
      else if (status && (typeof status === 'boolean' || (['active'].includes(status) ? ['BOND_STATUS_BONDED'].includes(validator_data.status) : ['illegible'].includes(status) ? validator_data.illegible : ['deregistering'].includes(status) ? validator_data.deregistering : !(['BOND_STATUS_BONDED'].includes(validator_data.status))))) {
        const response = await stakingDelegationsAddress(validator_data.operator_address, validator_data.delegator_address)

        if (response && response.delegation_response && response.delegation_response.delegation && response.delegation_response.delegation.shares) {
          validator_data.self_delegation = Number(response.delegation_response.delegation.shares)
        }
      }
    }
  }

  return validator_data
}

export const delegations = async (address, params) => {
  const path = `/cosmos/staking/v1beta1/validators/${address}/delegations`
  return await request(path, params)
}

export const allDelegations = async (address, params) => {
  let pageKey = true

  let data = []

  while (pageKey) {
    const response = await delegations(address, { ...params, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined })

    data = _.uniqBy(_.concat(data, response.delegation_responses || []), 'delegation.delegator_address')

    pageKey = response && response.pagination && response.pagination.next_key
  }

  return { data }
}