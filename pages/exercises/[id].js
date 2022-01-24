import { useRouter } from 'next/router'

import Exercises from '../../components/exercises'

export default function Exercise() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <Exercises id={query.id} />
  )
}