import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import AccountDetail from './account-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { allValidators, allBankBalances, allStakingDelegations, allStakingUnbonding, distributionRewards, distributionCommissions, transactionsByEvents, validatorProfile } from '../../lib/api/cosmos'
import { denomSymbol, denomAmount } from '../../lib/object/denom'
import { numberFormat, randImage } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Account({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data, validators_data } = { ...data }

  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, null, null, denoms_data)

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data,
          })

          setLoadValsProfile(true)
        }
      }
    }

    if (denoms_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getValidatorsProfile = async () => {
      if (loadValsProfile && validators_data?.findIndex(validator_data => validator_data?.description && !validator_data.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const validator_data = data[i]

            if (validator_data?.description) {
              if (validator_data.description.identity && !validator_data.description.image) {
                const responseProfile = await validatorProfile({ key_suffix: validator_data.description.identity })

                if (responseProfile?.them?.[0]?.pictures?.primary?.url) {
                  validator_data.description.image = responseProfile.them[0].pictures.primary.url
                }
              }

              validator_data.description.image = validator_data.description.image || randImage(i)

              data[i] = validator_data
            }
          }
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: VALIDATORS_DATA,
            value: data,
          })
        }
      }
    }

    getValidatorsProfile()

    return () => {
      controller?.abort()
    }
  }, [loadValsProfile])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let accountData

      const validator_data = validators_data?.find(validator_data => validator_data?.delegator_address === address)

      const operator_address = validator_data?.operator_address

      if (operator_address) {
        accountData = { ...accountData, operator_address }
      }

      let response

      if (!controller.signal.aborted) {
        response = await allBankBalances(address)

        if (response) {
          accountData = {
            ...accountData,
            balances: response.data?.map(balance => {
              return {
                ...balance,
                denom: denomSymbol(balance.denom, denoms_data),
                amount: denomAmount(balance.amount, balance.denom, denoms_data),
              }
            }),
          }
        }
      }

      if (!controller.signal.aborted) {
        response = await allStakingDelegations(address)

        if (response) {
          accountData = {
            ...accountData,
            stakingDelegations: response.data?.map(delegation => {
              return {
                ...delegation.delegation,
                validator_data: delegation.delegation && (validators_data?.find(validator_data => validator_data.operator_address === delegation.delegation.validator_address) || {}),
                shares: delegation.delegation?.shares && (isNaN(delegation.delegation.shares) ? -1 : denomAmount(delegation.delegation.shares, delegation.balance?.denom, denoms_data)),
                ...delegation.balance,
                denom: denomSymbol(delegation?.balance?.denom, denoms_data),
                amount: delegation.balance?.amount && (isNaN(delegation.balance.amount) ? -1 : denomAmount(delegation.balance.amount, delegation.balance.denom, denoms_data)),
              }
            }),
          }
        }
      }

      if (!controller.signal.aborted) {
        response = await allStakingUnbonding(address)

        if (response) {
          accountData = {
            ...accountData,
            stakingUnbonding: response.data?.flatMap(unbonding => !(unbonding?.entries) ? [] : unbonding.entries.map(entry => {
              return {
                ...unbonding,
                validator_data: unbonding && (validators_data?.find(validator_data => validator_data.operator_address === unbonding.validator_address)?.description || {}),
                entries: undefined,
                ...entry,
                creation_height: Number(entry.creation_height),
                initial_balance: Number(entry.initial_balance) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION),
                balance: Number(entry.balance) / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION),
              }
            })),
          }
        }
      }

      if (!controller.signal.aborted) {
        response = await distributionRewards(address)

        if (response) {
          accountData = {
            ...accountData,
            rewards: {
              ...response,
              rewards: response.rewards && Object.entries(_.groupBy(response.rewards.flatMap(reward => reward.reward).map(reward => { return { ...reward, denom: denomSymbol(reward.denom, denoms_data), amount: reward.amount && (isNaN(reward.amount) ? -1 : denomAmount(reward.amount, reward.denom, denoms_data)) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
              total: response.total && Object.entries(_.groupBy(response.total.map(total => { return { ...total, denom: denomSymbol(total.denom, denoms_data), amount: total.amount && denomAmount(total.amount, total.denom, denoms_data) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
            },
          }
        }
      }

      if (!controller.signal.aborted) {
        if (operator_address) {
          response = await distributionCommissions(operator_address)

          if (response) {
            accountData = {
              ...accountData,
              commission: response?.commission?.commission?.map(commission => {
                return {
                  ...commission,
                  denom: denomSymbol(commission.denom, denoms_data),
                  amount: commission.amount && (isNaN(commission.amount) ? -1 : denomAmount(commission.amount, commission.denom, denoms_data)),
                }
              }),
            }
          }
        }
      }

      if (!controller.signal.aborted) {
        accountData = {
          ...accountData,
          total: Object.entries(_.groupBy(_.concat(
            accountData.balances?.filter(balance => balance.amount > -1),
            accountData.stakingDelegations?.filter(delegation => delegation.amount > -1),
            accountData.stakingUnbonding?.map(unbonding => { return { ...unbonding, denom: unbonding.denom || chain_data?.staking_params?.bond_denom, amount: unbonding.balance } }),
            accountData.rewards?.rewards?.filter(reward => reward.amount > -1),
            accountData.commission?.filter(commission => commission.amount > -1)
          ), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }).filter(total => total.denom && !(['undefined'].includes(total.denom))),
        }

        setAccount({ data: accountData || {}, address })
      }
    }

    if (address && denoms_data && validators_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, denoms_data, validators_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let data = []

      if (!controller.signal.aborted) {
        if (address.startsWith('cosmos')) {
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`ibc_transfer.sender='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`ibc_transfer.receiver='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
        }
        else {
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`message.sender='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`message.address='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`message.destinationAddress='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`transfer.sender='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`transfer.recipient='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`outpointConfirmation.destinationAddress='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }
          if (!controller.signal.aborted) {
            data = await transactionsByEvents(`depositConfirmation.destinationAddress='${address}'`, data, null, null, denoms_data)

            if (data.length > 0) {
              setTransactions({ data, total: data.length, address })
            }
          }

          setTransactions({ data, total: data.length, address })
        }
      }
    }

    if (address && denoms_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, denoms_data, validators_data])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <AccountDetail data={account?.address === address && account?.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Transactions</span>
        </div>}
        className="mt-4"
      >
        <div className="mt-3">
          <TransactionsTable data={transactions?.address === address && transactions} noLoad={true} />
        </div>
      </Widget>
    </div>
  )
}