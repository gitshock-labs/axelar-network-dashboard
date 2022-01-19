import { DENOMS_DATA, CHAIN_DATA, SLASHING_DATA, STATUS_DATA, VALIDATORS_DATA, VALIDATORS_CHAINS_DATA, KEYGENS_DATA, JAILED_SYNC_DATA } from './types'

export default function data(
  state = {
    [`${DENOMS_DATA}`]: null,
    [`${CHAIN_DATA}`]: null,
    [`${SLASHING_DATA}`]: null,
    [`${STATUS_DATA}`]: null,
    [`${VALIDATORS_DATA}`]: null,
    [`${VALIDATORS_CHAINS_DATA}`]: null,
    [`${KEYGENS_DATA}`]: null,
    [`${JAILED_SYNC_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
    case DENOMS_DATA:
      return {
        ...state,
        [`${DENOMS_DATA}`]: action.value
      }
    case CHAIN_DATA:
      return {
        ...state,
        [`${CHAIN_DATA}`]: action.value
      }
    case SLASHING_DATA:
      return {
        ...state,
        [`${SLASHING_DATA}`]: action.value
      }
    case STATUS_DATA:
      return {
        ...state,
        [`${STATUS_DATA}`]: action.value
      }
    case VALIDATORS_DATA:
      return {
        ...state,
        [`${VALIDATORS_DATA}`]: action.value
      }
    case VALIDATORS_CHAINS_DATA:
      return {
        ...state,
        [`${VALIDATORS_CHAINS_DATA}`]: action.value ? { ...state[`${VALIDATORS_CHAINS_DATA}`], ...action.value }  : {}
      }
    case KEYGENS_DATA:
      return {
        ...state,
        [`${KEYGENS_DATA}`]: action.value
      }
    case JAILED_SYNC_DATA:
      return {
        ...state,
        [`${JAILED_SYNC_DATA}`]: action.value ? { ...state[`${JAILED_SYNC_DATA}`], [`${action.i}`]: action.value } : {}
      }
    default:
      return state
  }
}