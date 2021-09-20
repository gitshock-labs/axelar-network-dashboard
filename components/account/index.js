import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import AccountDetail from './account-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { allValidators, allBankBalances, allStakingDelegations, allStakingUnbonding, distributionRewards, distributionCommission, transactionsByEvents } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Account({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { chain_data, validators_data } = { ...data }

  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState(null)

  useEffect(() => {
    const getValidators = async () => {
      const response = await allValidators({}, validators_data)

      if (response) {
        dispatch({
          type: VALIDATORS_DATA,
          value: response.data
        })
      }
    }

    getValidators()

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getData = async () => {
      let accountData

      const validator_data = validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.delegator_address === address)]

      const operator_address = validator_data && validator_data.operator_address

      if (operator_address) {
        accountData = { ...accountData, operator_address }
      }

      let response = await allBankBalances(address)

      if (response) {
        accountData = {
          ...accountData,
          balances: response.data && response.data.map(balance => {
            return {
              ...balance,
              denom: balance.denom && balance.denom.substring(balance.denom.startsWith('u') ? 1 : 0),
              amount: balance.amount && (isNaN(balance.amount) ? -1 : Number(balance.amount) / Math.pow(10, balance.denom && balance.denom.startsWith('u') ? 6 : 0)),
            }
          }),
        }
      }

      response = await allStakingDelegations(address)

      if (response) {
        accountData = {
          ...accountData,
          stakingDelegations: response.data && response.data.map(delegation => {
            return {
              ...delegation.delegation,
              validator_data: delegation.delegation && validators_data && validators_data.findIndex(validator_data => validator_data.operator_address === delegation.delegation.validator_address) > -1 ? validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === delegation.delegation.validator_address)].description : {},
              shares: delegation.delegation && delegation.delegation.shares && (isNaN(delegation.delegation.shares) ? -1 : Number(delegation.delegation.shares) / Math.pow(10, delegation.balance && delegation.balance.denom && delegation.balance.denom.startsWith('u') ? 6 : 0)),
              ...delegation.balance,
              denom: delegation.balance && delegation.balance.denom && delegation.balance.denom.substring(delegation.balance.denom.startsWith('u') ? 1 : 0),
              amount: delegation.balance && delegation.balance.amount && (isNaN(delegation.balance.amount) ? -1 : Number(delegation.balance.amount) / Math.pow(10, delegation.balance && delegation.balance.denom && delegation.balance.denom.startsWith('u') ? 6 : 0)),
            }
          }),
        }
      }

      response = await allStakingUnbonding(address)

      if (response) {
        accountData = {
          ...accountData,
          stakingUnbonding: response.data && response.data.flatMap(unbonding => !(unbonding && unbonding.entries) ? [] : unbonding.entries.map(entry => {
            return {
              ...unbonding,
              validator_data: unbonding && validators_data && validators_data.findIndex(validator_data => validator_data.operator_address === unbonding.validator_address) > -1 ? validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === unbonding.validator_address)].description : {},
              entries: undefined,
              ...entry,
              creation_height: Number(entry.creation_height),
              initial_balance: Number(entry.initial_balance) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION),
              balance: Number(entry.balance) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION),
            }
          })),
        }
      }

      response = await distributionRewards(address)

      if (response) {
        accountData = {
          ...accountData,
          rewards: {
            ...response,
            rewards: response.rewards && Object.entries(_.groupBy(response.rewards.flatMap(reward => reward.reward).map(reward => { return { ...reward, denom: reward.denom && reward.denom.substring(reward.denom.startsWith('u') ? 1 : 0), amount: reward.amount && (isNaN(reward.amount) ? -1 : Number(reward.amount) / Math.pow(10, reward.denom && reward.denom.startsWith('u') ? 6 : 0)) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
            total: response.total && Object.entries(_.groupBy(response.total.map(total => { return { ...total, denom: total.denom && total.denom.substring(total.denom.startsWith('u') ? 1 : 0), amount: total.amount && Number(total.amount) / Math.pow(10, total.denom && total.denom.startsWith('u') ? 6 : 0) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
          },
        }
      }

      if (operator_address) {
        response = await distributionCommission(operator_address)

        if (response) {
          accountData = {
            ...accountData,
            commission: response && response.commission && response.commission.commission && response.commission.commission.map(commission => {
              return {
                ...commission,
                denom: commission.denom && commission.denom.substring(commission.denom.startsWith('u') ? 1 : 0),
                amount: commission.amount && (isNaN(commission.amount) ? -1 : Number(commission.amount) / Math.pow(10, commission.denom && commission.denom.startsWith('u') ? 6 : 0)),
              }
            }),
          }
        }
      }

      accountData = {
        ...accountData,
        total: Object.entries(_.groupBy(_.concat(
          accountData.balances && accountData.balances.filter(balance => balance.amount > -1),
          accountData.stakingDelegations && accountData.stakingDelegations.filter(delegation => delegation.amount > -1),
          accountData.stakingUnbonding && accountData.stakingUnbonding.map(unbonding => { return { ...unbonding, denom: unbonding.denom || (chain_data && chain_data.staking_params && chain_data.staking_params.bond_denom), amount: unbonding.balance } }),
          accountData.rewards && accountData.rewards.rewards && accountData.rewards.rewards.filter(reward => reward.amount > -1),
          accountData.commission && accountData.commission.filter(commission => commission.amount > -1)
        ), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
      }

      setAccount({ data: accountData || {}, address })

      let data = []

      if (address.startsWith('cosmos')) {
        data = await transactionsByEvents(`ibc_transfer.sender='${address}'`, data)
        data = await transactionsByEvents(`ibc_transfer.receiver='${address}'`, data)
      }
      else {
        data = await transactionsByEvents(`message.sender='${address}'`, data)
        data = await transactionsByEvents(`message.address='${address}'`, data)
        data = await transactionsByEvents(`message.destinationAddress='${address}'`, data)
        data = await transactionsByEvents(`transfer.sender='${address}'`, data)
        data = await transactionsByEvents(`transfer.recipient='${address}'`, data)
        data = await transactionsByEvents(`outpointConfirmation.destinationAddress='${address}'`, data)
        data = await transactionsByEvents(`depositConfirmation.destinationAddress='${address}'`, data)
      }

      data = _.slice(data, 0, 100)

      setTransactions({ data, total: response && response.total, address })
    }

    if (address && validators_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [address, validators_data])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <AccountDetail data={account && account.address === address && account.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Transactions</span>
        </div>}
        className="mt-4"
      >
        <div className="mt-3">
          <TransactionsTable data={transactions} noLoad={true} />
        </div>
      </Widget>
    </div>
  )
}