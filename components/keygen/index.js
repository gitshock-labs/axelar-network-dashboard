import { useState, useEffect } from 'react'

import KeygenSummary from './keygen-summary'
import KeysTable from './keys-table'

import { getKeygen, getKeys } from '../../lib/api/query'

export default function Keygen() {
  const [keygen, setKeygen] = useState(null)
  const [keys, setKeys] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let response = await getKeygen()

      if (response) {
        setKeygen({ data: response.data || {} })
      }

      response = await getKeys()

      if (response) {
        setKeys({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <KeygenSummary data={keygen && keygen.data} />
      <KeysTable data={keys} noLoad={true} />
    </div>
  )
}