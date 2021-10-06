import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Summary from './summary'
import KeysTable from './keys-table'

import { keygenSummary, keygens as getKeygens } from '../../lib/api/query'
import { allValidators } from '../../lib/api/cosmos'
import { getKeygenById } from '../../lib/api/executor'
import { signAttempts as getSignAttempts, failedKeygens as getFailedKeygens } from '../../lib/api/opensearch'
import { getName } from '../../lib/utils'

import { VALIDATORS_DATA, KEYGENS_DATA } from '../../reducers/types'

export default function Participations() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [failedKeygens, setFailedKeygens] = useState(null)
  const [signAttempts, setSignAttempts] = useState(null)
  const [table, setTable] = useState('success')

  useEffect(() => {
    const getValidators = async () => {
      const response = await allValidators({}, validators_data, 'active')

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
      const response = await keygenSummary()

      setSummaryData({ data: response || {}})
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getData = async () => {
      let response = await getKeygens()

      if (response) {
        dispatch({
          type: KEYGENS_DATA,
          value: response
        })
      }

      let data = (response || []).map((key_id, i) => {
        return {
          key_id,
          ...(keygens && keygens.data && keygens.data.findIndex(keygen => keygen.key_id === key_id) > -1 ?
            keygens.data[keygens.data.findIndex(keygen => keygen.key_id === key_id)]
            :
            null
          ),
        }
      })

      for (let i = 0; i < data.length; i++) {
        let keygen = data[i]

        if (keygen && keygen.key_id) {
          keygen = await getKeygenById(keygen.key_id, { cache: true }) || keygen
        }

        data[i] = {
          ...keygen,
          key_chain: keygen.key_chain || (keygen && keygen.key_id && keygen.key_id.split('-').length > 1 && getName(keygen.key_id.split('-')[0])),
          key_role: keygen.key_role || (keygen && keygen.key_id && keygen.key_id.split('-').length > 2 && `${keygen.key_id.split('-')[1].toUpperCase()}_KEY`),
          validators: keygen.validators && keygen.validators.map(validator => {
            return {
              ...validator,
              ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.address)]),
            }
          }),
        }
      }

      data = _.orderBy(data, ['snapshot_block_number'], ['desc'])

      setKeygens({ data })

      response = await getFailedKeygens({ size: 100, sort: [{ height: 'desc' }] })

      data = (response && response.data) || []

      for (let i = 0; i < data.length; i++) {
        const failedKeygen = data[i]

        data[i] = {
          ...failedKeygen,
          key_chain: failedKeygen.key_chain || (failedKeygen && failedKeygen.key_id && failedKeygen.key_id.split('-').length > 1 && getName(failedKeygen.key_id.split('-')[0])),
          key_role: failedKeygen.key_role || (failedKeygen && failedKeygen.key_id && failedKeygen.key_id.split('-').length > 2 && `${failedKeygen.key_id.split('-')[1].toUpperCase()}_KEY`),
          validators: failedKeygen.snapshot_validators && failedKeygen.snapshot_validators.validators && failedKeygen.snapshot_validators.validators.map((validator, j) => {
            return {
              ...validator,
              address: validator.validator,
              ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.validator)]),
              share: validator.share_count,
            }
          }),
          non_participant_validators: failedKeygen.snapshot_non_participant_validators && failedKeygen.snapshot_non_participant_validators.validators && failedKeygen.snapshot_non_participant_validators.validators.map((validator, j) => {
            return {
              ...validator,
              address: validator.validator,
              ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.validator)]),
              share: validator.share_count,
            }
          }),
        }
      }

      data = _.orderBy(data, ['height'], ['desc'])

      setFailedKeygens({ data, total: response && response.total })

      response = await getSignAttempts({ size: 100, sort: [{ height: 'desc' }] })

      data = (response && response.data) || []

      for (let i = 0; i < data.length; i++) {
        const signAttempt = data[i]

        data[i] = {
          ...signAttempt,
          key_chain: signAttempt.key_chain || (signAttempt && signAttempt.key_id && signAttempt.key_id.split('-').length > 1 && getName(signAttempt.key_id.split('-')[0])),
          key_role: signAttempt.key_role || (signAttempt && signAttempt.key_id && signAttempt.key_id.split('-').length > 2 && `${signAttempt.key_id.split('-')[1].toUpperCase()}_KEY`),
          validators: signAttempt.participants && signAttempt.participants.map((address, j) => {
            return {
              address,
              ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === address)]),
              share: signAttempt.participant_shares && signAttempt.participant_shares[j],
            }
          }),
          non_participant_validators: signAttempt.non_participants && signAttempt.non_participants.map((address, j) => {
            return {
              address,
              ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === address)]),
              share: signAttempt.non_participant_shares && signAttempt.non_participant_shares[j],
            }
          }),
        }
      }

      data = _.orderBy(data, ['height'], ['desc'])

      setSignAttempts({ data, total: response && response.total })
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (validators_data) {
      if (keygens && keygens.data) {
        const data = keygens.data.map(keygen => {
          return {
            ...keygen,
            validators: keygen.validators && keygen.validators.map(validator => {
              return {
                ...validator,
                ...validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.address)],
              }
            }),
          }
        })

        setKeygens({ data })
      }

      if (signAttempts && signAttempts.data) {
        const data = signAttempts.data.map(signAttempt => {
          return {
            ...signAttempt,
            validators: signAttempt.participants && signAttempt.participants.map((address, j) => {
              return {
                address,
                ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === address)]),
                share: signAttempt.participant_shares && signAttempt.participant_shares[j],
              }
            }),
            non_participant_validators: signAttempt.non_participants && signAttempt.non_participants.map((address, j) => {
              return {
                address,
                ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === address)]),
                share: signAttempt.non_participant_shares && signAttempt.non_participant_shares[j],
              }
            }),
          }
        })

        setSignAttempts({ ...signAttempts, data })
      }
    }
  }, [validators_data])

  return (
    <div className={`max-w-${['failed', 'sign_attempts'].includes(table) ? '7xl' : '7xl'} my-4 xl:my-6 mx-auto`}>
      <Summary
        data={summaryData && summaryData.data}
        keygens={keygens && keygens.data}
        failedKeygens={failedKeygens && (typeof failedKeygens.total === 'number' ? failedKeygens.total : (failedKeygens.data && failedKeygens.data.length))}
        signAttempts={signAttempts && (typeof signAttempts.total === 'number' ? signAttempts.total : (signAttempts.data && signAttempts.data.length))}
      />
      <div className="flex flex-row items-center overflow-x-auto space-x-1 my-2">
        {['success', 'failed', 'sign_attempts'].map((_table, i) => (
          <div
            key={i}
            onClick={() => setTable(_table)}
            className={`btn btn-default btn-rounded cursor-pointer bg-trasparent ${_table === table ? 'bg-gray-700 dark:bg-gray-800 text-white' : 'bg-trasparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'}`}
          >
            {getName(_table)}
          </div>
        ))}
      </div>
      {table === 'failed' ?
        <KeysTable data={failedKeygens} page={table} />
        :
        table === 'sign_attempts' ?
          <KeysTable data={signAttempts} page={table} />
          :
          <KeysTable data={keygens} corruption_signing_threshold={summaryData && summaryData.data && summaryData.data.corruption_signing_threshold} />
      }
    </div>
  )
}