import { useState, useEffect } from 'react'

import moment from 'moment'

import ValidatorDetail from './validator-detail'
import VotingPower from './voting-power'
import Uptime from './uptime'
import DelegationsTable from './delegations-table'
import TransactionsTable from '../transactions/transactions-table'
import KeysTable from '../keygen/keys-table'
import Widget from '../widget'

import { getValidator, getUptime, getDelegations, getTransactions, getKeys } from '../../lib/api/query'
import { getName } from '../../lib/utils'

export default function Validator({ address }) {
  const [validator, setValidator] = useState(null)
  const [uptime, setUptime] = useState(null)
  const [delegations, setDelegations] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [table, setTable] = useState('voting_events')

  useEffect(() => {
    const getData = async () => {
      let response = await getValidator(address)

      if (response) {
        setValidator({ data: response.data || {}, address })
      }

      response = await getUptime(address)

      if (response) {
        setUptime({ data: response.data || [], address })
      }

      response = await getDelegations({ address })

      if (response) {
        setDelegations({ data: response.data || [], address })
      }

      response = await getTransactions({ address })

      if (response) {
        setTransactions({ data: response.data || [], address })
      }

      response = await getKeys({ address })

      if (response) {
        setKeygens({ data: response.data || [], address })
      }
    }

    if (address) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [address])

  return (
    <>
      <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4">
        <div className="w-full md:w-1/2 my-2">
          <ValidatorDetail data={validator && validator.address === address && validator.data} />
        </div>
        <div className="w-full md:w-1/2 my-2">
          <VotingPower data={validator && validator.address === address && validator.data} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4">
        <div className="w-full md:w-1/2 xl:w-2/5 my-2">
          <Uptime data={uptime && uptime.address === address && uptime.data} />
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
                 <DelegationsTable data={delegations} />
                  :
                  <KeysTable data={keygens} page="validator" address={address} />
              }
            </div>
          </Widget>
        </div>
      </div>
    </>
  )
}