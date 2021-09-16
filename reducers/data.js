import { STATUS_DATA, VALIDATORS_DATA } from './types'

export default function data(
  state = {
    [`${STATUS_DATA}`]: null,
    [`${VALIDATORS_DATA}`]: null,
  },
  action
) {
  switch (action.type) {
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
    default:
      return state
  }
}