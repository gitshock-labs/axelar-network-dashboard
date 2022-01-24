import { useRouter } from 'next/router'

import Validator from '../../components/validator'

export default function ValidatorAddress() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <Validator address={query.address} />
  )
}