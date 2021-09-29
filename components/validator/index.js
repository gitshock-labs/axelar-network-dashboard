import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import moment from 'moment'

import ValidatorDetail from './validator-detail'
import VotingPower from './voting-power'
import Uptime from './uptime'
import DelegationsTable from './delegations-table'
import TransactionsTable from '../transactions/transactions-table'
import KeysTable from '../keygen/keys-table'
import Widget from '../widget'

import { getUptime, keygens as getKeygens } from '../../lib/api/query'
import { status as getStatus } from '../../lib/api/rpc'
import { allValidators, validatorSets, transactionsByEvents, allDelegations } from '../../lib/api/cosmos'
import { getKeygensByValidator } from '../../lib/api/executor'
import { getName } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA, KEYGENS_DATA } from '../../reducers/types'

export default function Validator({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { chain_data, status_data, validators_data, keygens_data } = { ...data }

  const [validator, setValidator] = useState(null)
  const [uptime, setUptime] = useState(null)
  const [signEvents, setSignEvents] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [delegations, setDelegations] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [table, setTable] = useState('voting_events')

  useEffect(() => {
    const getData = async () => {
      const response = await getStatus()

      if (response) {
        dispatch({
          type: STATUS_DATA,
          value: response
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getValidators = async () => {
      const response = await allValidators({}, validators_data, null, address, Number(status_data.latest_block_height))

      if (response) {
        dispatch({
          type: VALIDATORS_DATA,
          value: response.data
        })
      }
    }

    if (address && status_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [address, status_data])

  useEffect(() => {
    const getAllKeygens = async () => {
      const response = await getKeygens()

      if (response) {
        dispatch({
          type: KEYGENS_DATA,
          value: response
        })
      }
    }

    if (!keygens_data) {
      getAllKeygens()
    }

    const interval = setInterval(() => getAllKeygens(), 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [keygens_data])

  useEffect(() => {
    const getData = async () => {
      let validatorData

      const validator_data = validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === address)]

      if (validator_data) {
        validatorData = { ...validatorData, ...validator_data }
      
        const response = await validatorSets()

        if (response && response.result && response.result.validators && response.result.validators.findIndex(validator_data => validator_data.address === validatorData.consensus_address) > -1) {
          validatorData = { ...validatorData, proposer_priority: response.result.validators[response.result.validators.findIndex(validator_data => validator_data.address === validatorData.consensus_address)].proposer_priority }
        }
      }

      setValidator({ data: validatorData || {}, address })

      let response = await getUptime(address)

      if (response) {
        setUptime({ data: response.data || [], address })
      }

      response = await transactionsByEvents(`sign.action='decided'`, null, address)

      setSignEvents({ data: response || [], total: response ? response.length : 0, address })

      let data = []

      // data = await transactionsByEvents(`message.sender='${address}'`, data)
      // data = await transactionsByEvents(`sign.sender='${address}'`, data)
      data = await transactionsByEvents(`sign.action='decided'`, data, address)

      data = _.slice(data, 0, 100)

      setTransactions({ data, total: data.length, address })

      response = await allDelegations(address)

      if (response) {
        setDelegations({
          data: _.orderBy((response.data && response.data.map(delegation => {
            return {
              ...delegation.delegation,
              self: validatorData && delegation.delegation.delegator_address === validatorData.delegator_address,
              shares: Number(delegation.delegation.shares) / Math.pow(10, delegation.balance && delegation.balance.denom && delegation.balance.denom.startsWith('u') ? 6 : 0),
              ...delegation.balance,
              denom: delegation.balance && delegation.balance.denom && delegation.balance.denom.substring(delegation.balance.denom.startsWith('u') ? 1 : 0),
              amount: delegation.balance && Number(delegation.balance.amount) / Math.pow(10, delegation.balance.denom && delegation.balance.denom.startsWith('u') ? 6 : 0),
            }
          })) || [], ['self', 'shares'], ['desc', 'desc']),
          address
        })
      }

      response = await getKeygensByValidator(address)

      if (response) {
        setKeygens({ data: response, address })
      }
    }

    if (address && validators_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [address, validators_data])

  return (
    <>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
        <div className="my-2">
          <ValidatorDetail
            data={validator && validator.address === address && validator.data}
            delegations={delegations && delegations.address === address && delegations.data}
            keygens={keygens && keygens.address === address && keygens.data}
            all_keygens={keygens_data}
            sign_events={signEvents && signEvents.address === address && signEvents.data}
          />
        </div>
        <div className="my-2">
          <VotingPower data={validator && validator.address === address && validator.data} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4">
        <div className="w-full md:w-1/2 xl:w-2/5 my-2">
          <Uptime data={uptime && uptime.address === address && uptime.data} validator_data={validator && validator.address === address && validator.data} />
        </div>
        <div className="w-full md:w-1/2 xl:w-3/5 my-2">
          <Widget
            title={<div className="flex flex-row items-center space-x-1">
              {['voting_events', 'delegations', 'keygen'].map((_table, i) => (
                <div
                  key={i}
                  onClick={() => setTable(_table)}
                  className={`btn btn-default btn-rounded cursor-pointer bg-trasparent ${_table === table ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 text-white dark:hover:text-gray-100'}`}
                >
                  {getName(_table)}
                  {_table === 'voting_events' && (<span className="text-gray-500 font-light italic ml-1">(Mock Data)</span>)}
                </div>
              ))}
            </div>}
            className="px-2 md:px-4"
          >
            <div className="mt-3">
              {table === 'voting_events' ?
                <TransactionsTable data={transactions} noLoad={true} page="validator" />
                :
                table === 'delegations' ?
                 <DelegationsTable data={delegations && delegations.address === address && delegations.data} />
                  :
                  <KeysTable data={keygens} page="validator" />
              }
            </div>
          </Widget>
        </div>
      </div>
    </>
  )
}