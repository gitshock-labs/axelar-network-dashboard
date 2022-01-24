import { VALIDATORS_DATA, VALIDATORS_CHAINS_DATA, JAILED_SYNC_DATA } from './types'

export default function data(
  state = {
    [`${VALIDATORS_DATA}`]: null,
    [`${VALIDATORS_CHAINS_DATA}`]: null,
    [`${JAILED_SYNC_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
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
    case JAILED_SYNC_DATA:
      return {
        ...state,
        [`${JAILED_SYNC_DATA}`]: action.value ? { ...state[`${JAILED_SYNC_DATA}`], [`${action.i}`]: action.value } : {}
      }
    default:
      return state
  }
}