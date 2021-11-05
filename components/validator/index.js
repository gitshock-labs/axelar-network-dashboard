import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import moment from 'moment'

import Information from './information'
import CosmosGeneric from './cosmos-generic'
import AxelarSpecific from './axelar-specific'
import VotingPower from './voting-power'
import Uptime from './uptime'
import KeysTable from '../participations/keys-table'
import TransactionsTable from '../transactions/transactions-table'
import DelegationsTable from './delegations-table'
import Widget from '../widget'

import { getUptime, keygens as getKeygens } from '../../lib/api/query'
import { status as getStatus } from '../../lib/api/rpc'
import { allValidators, validatorSets, transactionsByEvents, allDelegations } from '../../lib/api/cosmos'
import { getKeygensByValidator } from '../../lib/api/executor'
import { denomSymbol, denomAmount } from '../../lib/object/denom'
import { getName } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA/*, KEYGENS_DATA*/ } from '../../reducers/types'

export default function Validator({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data, status_data, validators_data, keygens_data } = { ...data }

  const [validator, setValidator] = useState(null)
  const [uptime, setUptime] = useState(null)
  const [tab, setTab] = useState('key_share')
  const [keygens, setKeygens] = useState(null)
  const [signs, setSigns] = useState(null)
  const [delegations, setDelegations] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getStatus()

        if (response) {
          dispatch({
            type: STATUS_DATA,
            value: response
          })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, address, Number(status_data.latest_block_height))

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data
          })
        }
      }
    }

    if (address && status_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, status_data])

  // useEffect(() => {
  //   const controller = new AbortController()

  //   const getAllKeygens = async () => {
  //     if (!controller.signal.aborted) {
  //       const response = await getKeygens()

  //       if (response) {
  //         dispatch({
  //           type: KEYGENS_DATA,
  //           value: response
  //         })
  //       }
  //     }
  //   }

  //   if (!keygens_data) {
  //     getAllKeygens()
  //   }

  //   const interval = setInterval(() => getAllKeygens(), 10 * 60 * 1000)
  //   return () => {
  //     controller?.abort()
  //     clearInterval(interval)
  //   }
  // }, [keygens_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let validatorData, response

      const validator_data = validators_data?.[validators_data.findIndex(validator_data => validator_data.operator_address === address)]

      if (validator_data) {
        validatorData = { ...validatorData, ...validator_data }
      
        if (!controller.signal.aborted) {
          response = await validatorSets()

          if (response?.result?.validators?.findIndex(validator_data => validator_data.address === validatorData.consensus_address) > -1) {
            validatorData = { ...validatorData, proposer_priority: response.result.validators[response.result.validators.findIndex(validator_data => validator_data.address === validatorData.consensus_address)].proposer_priority }
          }
        }
      }

      setValidator({ data: validatorData || {}, address })

      if (!controller.signal.aborted) {
        response = await getUptime(Number(status_data.latest_block_height), validatorData?.consensus_address)

        if (response) {
          setUptime({ data: response.data || [], address })
        }
      }

      if (!controller.signal.aborted) {
        response = await allDelegations(address)

        if (response) {
          setDelegations({
            data: _.orderBy(response.data?.map(delegation => {
              return {
                ...delegation.delegation,
                self: validatorData && delegation.delegation.delegator_address === validatorData.delegator_address,
                shares: delegation.delegation && denomAmount(delegation.delegation.shares, delegation.balance?.denom, denoms_data),
                ...delegation.balance,
                denom: denomSymbol(delegation.balance?.denom, denoms_data),
                amount: delegation.balance && denomAmount(delegation.balance.amount, delegation.balance.denom, denoms_data),
              }
            }) || [], ['self', 'shares'], ['desc', 'desc']),
            address
          })
        }
      }

      if (!controller.signal.aborted) {
        response = await getKeygensByValidator(address)

        if (response) {
          setKeygens({ data: response, address })
        }
      }

      if (!controller.signal.aborted) {
        response = await transactionsByEvents(`sign.action='decided'`, null, address, true, denoms_data)

        setSigns({ data: response || [], total: response ? response.length : 0, address })
      }
    }

    if (address && denoms_data && status_data && validators_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, denoms_data, status_data, validators_data])

  return (
    <>
      <div className="my-4">
        <Information
          data={validator?.address === address && validator?.data}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        <CosmosGeneric data={validator?.address === address && validator?.data} />
        <AxelarSpecific data={validator?.address === address && validator?.data} />
        <VotingPower data={validator?.address === address && validator?.data} />
        <Uptime data={uptime?.address === address && uptime?.data} validator_data={validator?.address === address && validator?.data} />
        <Widget
          title={<div className="grid grid-flow-row grid-cols-2 sm:grid-cols-4 md:grid-cols-2 xl:flex flex-row items-center space-x-1">
            {['key_share', 'keygen', 'sign'].map((_tab, i) => (
              <div
                key={i}
                onClick={() => setTab(_tab)}
                className={`max-w-min sm:max-w-max md:max-w-min lg:max-w-max btn btn-default btn-rounded cursor-pointer bg-trasparent ${_tab === tab ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 text-white dark:hover:text-gray-100'}`}
              >
                {getName(_tab)}
              </div>
            ))}
          </div>}
          className="px-2 md:px-4"
        >
          <div className="mt-3">
            {tab === 'sign' ?
              <TransactionsTable data={signs && { ...signs, data: _.slice(signs.data?.filter(transaction => transaction.participated), 0, 100) }} noLoad={true} location="validator" />
              :
              <KeysTable data={keygens} page="validator" />
            }
          </div>
        </Widget>
        <Widget
          title={<span className="text-lg font-medium">Delegations</span>}
        >
          <div className="mt-2">
            <DelegationsTable data={delegations?.address === address && delegations?.data} />
          </div>
        </Widget>
      </div>
    </>
  )
}