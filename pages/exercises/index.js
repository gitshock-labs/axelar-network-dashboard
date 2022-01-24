import { useRouter } from 'next/router'

import { exercises } from '../../lib/menus'

export default function Exercises() {
  const router = useRouter()
  const { pathname } = { ...router }

  if (typeof window !== 'undefined') {
    router.push(exercises.find(ex => !ex.disabled) ? `${pathname}/${exercises.find(ex => !ex.disabled).id}` : '/')
  }

  return null
}