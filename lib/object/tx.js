import _ from 'lodash'

import { feeDenom, denomSymbol, denomAmount } from './denom'

export const getTxStatus = data => data && !data.code ? 'success' : 'failed'

export const getTxType = data => _.head(data?.logs?.flatMap(log => log?.events?.filter(event => event.type === 'message'/*event.type !== 'message' || log.events.length < 2*/).map(event => event.type === 'message' ? event.attributes && _.head(event.attributes.filter(attribute => attribute.key === 'action').map(attribute => _.last(attribute.value?.split('.') || []))) : event.type)))

export const getTxFee = (data, denoms) => data?.tx?.auth_info?.fee?.amount && denomAmount(_.sumBy(data.tx.auth_info.fee.amount, 'amount'), feeDenom, denoms)

export const getTxSymbol = (data, denoms) => data?.tx?.auth_info?.fee?.amount && _.head(data.tx.auth_info.fee.amount.map(amount => denomSymbol(amount?.denom, denoms)).filter(denom => denom))

export const getTxGasUsed = data => data && Number(data.gas_used)

export const getTxGasLimit = data => data && Number(data.gas_wanted)

export const getTxMemo = data => data?.tx?.body?.memo

export const getTxActivities = (data, denoms) => {
  const activities = data?.logs?.map(log => log?.events && _.assign.apply(_, (log.events.map(event => {
    const event_obj = {
      type: event.type,
      log: log.log, ...((event.attributes && _.assign.apply(_, event.attributes.filter(attribute => true/*!(event.type !== 'message' && attribute.key === 'action')*/).map(attribute => {
        const attr_obj = {
          [`${attribute.key}`]: attribute.key === 'amount' && typeof attribute.value === 'string' ? denomAmount(attribute.value.substring(0, attribute.value.split('').findIndex(c => isNaN(c)) > -1 ? attribute.value.split('').findIndex(c => isNaN(c)) : undefined), attribute.value.split('').findIndex(c => isNaN(c)) > -1 ? attribute.value.substring(attribute.value.split('').findIndex(c => isNaN(c))) : denoms?.[0]?.denom, denoms) : attribute.key === 'action' ? _.last(attribute.value?.split('.') || []) : attribute.value,
        }

        if (attribute.key === 'amount' && typeof attribute.value === 'string') {
          attr_obj.symbol = denomSymbol(attribute.value.split('').findIndex(c => isNaN(c)) > -1 ? attribute.value.substring(attribute.value.split('').findIndex(c => isNaN(c))) : denoms?.[0]?.denom, denoms)
        }

        return { ...attr_obj }
      }))) || {}),
    }

    if (!event_obj?.action) {
      event_obj.action = event_obj.type
    }

    if (event?.attributes?.findIndex(attribute => attribute.key === 'recipient') > -1) {
      event_obj.recipient = _.uniq(event.attributes.filter(attribute => attribute.key === 'recipient').map(attribute => attribute.value))
    }

    return { ...event_obj }
  }))))

  if (activities?.length < 1 && data?.code) {
    activities.push({ failed: true })
  }

  return activities
}