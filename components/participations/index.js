import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Summary from './summary'
import KeysTable from './keys-table'

import { keygenSummary, keygens as getKeygens } from '../../lib/api/query'
import { allValidators } from '../../lib/api/cosmos'
import { getKeygenById } from '../../lib/api/executor'
import { signAttempts as getSignAttempts, successKeygens as getSuccessKeygens, failedKeygens as getFailedKeygens } from '../../lib/api/opensearch'
import { getName } from '../../lib/utils'

import { VALIDATORS_DATA, KEYGENS_DATA } from '../../reducers/types'

export default function Participations() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [successKeygens, setSuccessKeygens] = useState(null)
  const [failedKeygens, setFailedKeygens] = useState(null)
  const [signAttempts, setSignAttempts] = useState(null)
  const [failedSignAttempts, setFailedSignAttempts] = useState(null)
  const [table, setTable] = useState('keygen_success')

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, 'active')

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data
          })
        }
      }
    }

    getValidators()

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await keygenSummary()

        setSummaryData({ data: response || {}})
      }
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let response, data

      // if (!controller.signal.aborted) {
      //   response = await getKeygens()

      //   if (response) {
      //     dispatch({
      //       type: KEYGENS_DATA,
      //       value: response
      //     })
      //   }

      //   let data = (response || []).map((key_id, i) => {
      //     return {
      //       key_id,
      //       ...(keygens && keygens.data && keygens.data.findIndex(keygen => keygen.key_id === key_id) > -1 ?
      //         keygens.data[keygens.data.findIndex(keygen => keygen.key_id === key_id)]
      //         :
      //         null
      //       ),
      //     }
      //   })

      //   for (let i = 0; i < data.length; i++) {
      //     let keygen = data[i]

      //     if (keygen && keygen.key_id) {
      //       keygen = await getKeygenById(keygen.key_id, { cache: true }) || keygen
      //     }

      //     data[i] = {
      //       ...keygen,
      //       key_chain: keygen.key_chain || (keygen && keygen.key_id && keygen.key_id.split('-').length > 1 && getName(keygen.key_id.split('-')[0])),
      //       key_role: keygen.key_role || (keygen && keygen.key_id && keygen.key_id.split('-').length > 2 && `${keygen.key_id.split('-')[1].toUpperCase()}_KEY`),
      //       validators: keygen.validators && keygen.validators.map(validator => {
      //         return {
      //           ...validator,
      //           ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.address)]),
      //         }
      //       }),
      //     }
      //   }

      //   data = _.orderBy(data, ['snapshot_block_number'], ['desc'])

      //   setKeygens({ data })
      // }

      if (!controller.signal.aborted) {
        response = await getSuccessKeygens({ size: 100, sort: [{ height: 'desc' }] })

        data = (response && response.data) || []

        for (let i = 0; i < data.length; i++) {
          let successKeygen = data[i]

          // if (successKeygen && successKeygen.key_id) {
          //   const keygen = await getKeygenById(successKeygen.key_id, { cache: true })

          //   successKeygen = { ...keygen, ...successKeygen, validator_shares: keygen && keygen.validators }
          // }

          data[i] = {
            ...successKeygen,
            key_chain: successKeygen.key_chain || (successKeygen && successKeygen.key_id && successKeygen.key_id.split('-').length > 1 && getName(successKeygen.key_id.split('-')[0])),
            key_role: successKeygen.key_role || (successKeygen && successKeygen.key_id && successKeygen.key_id.split('-').length > 2 && `${successKeygen.key_id.split('-')[1].toUpperCase()}_KEY`),
            validators: successKeygen.snapshot_validators && successKeygen.snapshot_validators.validators && successKeygen.snapshot_validators.validators.map((validator, j) => {
              return {
                ...validator,
                address: validator.validator,
                ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.validator)]),
                share: validator.share_count,
              }
            }),
            non_participant_validators: successKeygen.snapshot_non_participant_validators && successKeygen.snapshot_non_participant_validators.validators && successKeygen.snapshot_non_participant_validators.validators.map((validator, j) => {
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

        setSuccessKeygens({ data, total: response && response.total })
      }

      if (!controller.signal.aborted) {
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
      }

      if (!controller.signal.aborted) {
        response = await getSignAttempts({ size: 100, query: { match: { result: true } }, sort: [{ height: 'desc' }] })

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

      if (!controller.signal.aborted) {
        response = await getSignAttempts({ size: 100, query: { match: { result: false } }, sort: [{ height: 'desc' }] })

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

        setFailedSignAttempts({ data, total: response && response.total })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [validators_data])

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

      if (successKeygens && successKeygens.data) {
        const data = successKeygens.data.map(successKeygen => {
          return {
            ...successKeygen,
            validators: successKeygen.snapshot_validators && successKeygen.snapshot_validators.validators && successKeygen.snapshot_validators.validators.map((validator, j) => {
              return {
                ...validator,
                address: validator.validator,
                ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.validator)]),
                share: validator.share_count,
              }
            }),
            non_participant_validators: successKeygen.snapshot_non_participant_validators && successKeygen.snapshot_non_participant_validators.validators && successKeygen.snapshot_non_participant_validators.validators.map((validator, j) => {
              return {
                ...validator,
                address: validator.validator,
                ...(validators_data && validators_data[validators_data.findIndex(validator_data => validator_data.operator_address === validator.validator)]),
                share: validator.share_count,
              }
            }),
          }
        })

        setSuccessKeygens({ ...successKeygens, data })
      }

      if (failedKeygens && failedKeygens.data) {
        const data = failedKeygens.data.map(failedKeygen => {
          return {
            ...failedKeygen,
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
        })

        setFailedKeygens({ ...failedKeygens, data })
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

      if (failedSignAttempts && failedSignAttempts.data) {
        const data = failedSignAttempts.data.map(signAttempt => {
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

        setFailedSignAttempts({ ...failedSignAttempts, data })
      }
    }
  }, [validators_data])

  return (
    <div className={`max-w-${['keygen_failed', 'sign_success', 'sign_failed'].includes(table) ? '7xl' : 'full'} my-4 xl:my-6 mx-auto`}>
      <Summary
        data={summaryData && summaryData.data}
        keygens={keygens && keygens.data}
        successKeygens={successKeygens && (typeof successKeygens.total === 'number' ? successKeygens.total : (successKeygens.data && successKeygens.data.length))}
        failedKeygens={failedKeygens && (typeof failedKeygens.total === 'number' ? failedKeygens.total : (failedKeygens.data && failedKeygens.data.length))}
        signAttempts={signAttempts && (typeof signAttempts.total === 'number' ? signAttempts.total : (signAttempts.data && signAttempts.data.length))}
        failedSignAttempts={failedSignAttempts && (typeof failedSignAttempts.total === 'number' ? failedSignAttempts.total : (failedSignAttempts.data && failedSignAttempts.data.length))}
      />
      <div className="flex flex-row items-center overflow-x-auto space-x-1 my-2">
        {['keygen_success', 'keygen_failed', 'sign_success', 'sign_failed'].map((_table, i) => (
          <div
            key={i}
            onClick={() => setTable(_table)}
            className={`btn btn-default btn-rounded cursor-pointer bg-trasparent ${_table === table ? 'bg-gray-700 dark:bg-gray-900 text-white' : 'bg-trasparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-100'}`}
          >
            {_table.split('_').join(' - ')}
          </div>
        ))}
      </div>
      {table === 'keygen_failed' ?
        <KeysTable data={failedKeygens} page={table} />
        :
        table === 'sign_success' ?
          <KeysTable data={signAttempts} page={table} />
          :
          table === 'sign_failed' ?
            <KeysTable data={failedSignAttempts} page={table} />
            :
            <KeysTable data={keygens || successKeygens} page={table} corruption_signing_threshold={summaryData && summaryData.data && summaryData.data.corruption_signing_threshold} />
      }
    </div>
  )
}