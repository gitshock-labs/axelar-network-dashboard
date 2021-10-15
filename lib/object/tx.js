import _ from 'lodash'

import { feeDenom, denomName, denomAmount } from './denom'

export const getTxStatus = data => data && !data.code ? 'success' : 'failed'

export const getTxType = data => _.head(data && data.logs && data.logs.flatMap(log => log.events && log.events.filter(event => event.type === 'message'/*event.type !== 'message' || log.events.length < 2*/).map(event => event.type === 'message' ? event.attributes && _.head(event.attributes.filter(attribute => attribute.key === 'action').map(attribute => attribute.value)) : event.type)))

export const getTxFee = data => data && data.tx && data.tx.auth_info && data.tx.auth_info.fee && data.tx.auth_info.fee.amount && denomAmount(_.sumBy(data.tx.auth_info.fee.amount, 'amount'), feeDenom)

export const getTxSymbol = data => data && data.tx && data.tx.auth_info && data.tx.auth_info.fee && data.tx.auth_info.fee.amount && _.head(data.tx.auth_info.fee.amount.map(amount => amount && denomName(amount.denom)).filter(denom => denom))

export const getTxGasUsed = data => data && Number(data.gas_used)

export const getTxGasLimit = data => data && Number(data.gas_wanted)

export const getTxMemo = data => data && data.tx && data.tx.body && data.tx.body.memo

export const getTxActivities = data => {
  const activities = data && data.logs && data.logs.map(log => log && log.events && _.assign.apply(_, (log.events.map(event => {
    const event_obj = {
      type: event.type,
      log: log.log, ...((event.attributes && _.assign.apply(_, event.attributes.filter(attribute => !(event.type !== 'message' && attribute.key === 'action')).map(attribute => {
        const attr_obj = {
          [`${attribute.key}`]: attribute.key === 'amount' && typeof attribute.value === 'string' ? denomAmount(attribute.value.substring(0, attribute.value.split('').findIndex(c => isNaN(c)) > -1 ? attribute.value.split('').findIndex(c => isNaN(c)) : undefined), attribute.value.substring(attribute.value.split('').findIndex(c => isNaN(c)))) : attribute.value,
        }

        if (attribute.key === 'amount' && typeof attribute.value === 'string') {
          attr_obj.symbol = denomName(attribute.value.substring(attribute.value.split('').findIndex(c => isNaN(c))))
        }

        return { ...attr_obj }
      }))) || {}),
    }

    if (event.attributes && event.attributes.findIndex(attribute => attribute.key === 'recipient') > -1) {
      event_obj.recipient = _.uniq(event.attributes.filter(attribute => attribute.key === 'recipient').map(attribute => attribute.value))
    }

    return { ...event_obj }
  }))))

  if (activities && activities.length < 1 && data && data.code) {
    activities.push({ failed: true })
  }

  return activities
}