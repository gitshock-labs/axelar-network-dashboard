import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import KeygenSummary from './keygen-summary'
import KeysTable from './keys-table'

import { getKeygenSummary, keygens as getKeygens } from '../../lib/api/query'
import { allValidators } from '../../lib/api/cosmos'
import { getKeygenById } from '../../lib/api/executor'
import { getName } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Keygen() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { validators_data } = { ...data }

  const [keygenSummary, setKeygenSummary] = useState(null)
  const [keygens, setKeygens] = useState(null)

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
      let response = await getKeygenSummary()

      if (response) {
        setKeygenSummary({ data: response.data || {} })
      }

      response = await getKeygens()

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

      setKeygens({ data })
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (validators_data && keygens && keygens.data) {
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
  }, [validators_data])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <KeygenSummary data={keygenSummary && keygenSummary.data} />
      <KeysTable data={keygens} />
    </div>
  )
}