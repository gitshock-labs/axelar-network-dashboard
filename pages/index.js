import { useRouter } from 'next/router'

import CoinInfo from '../components/coin-info'
import Dashboard from '../components/dashboard'
import SectionTitle from '../components/section-title'

import { isMatchRoute } from '../lib/routes'

export default function Index() {
  const router = useRouter()
  const { pathname, asPath } = { ...router }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  if (typeof window !== 'undefined' && pathname !== _asPath) {
    router.push(isMatchRoute(_asPath) ? asPath : '/')
  }

  if (typeof window === 'undefined' || pathname !== _asPath) {
    return (
      <span className="min-h-screen" />
    )
  }

  return (
    <>
      <SectionTitle
        title="Overview"
        subtitle="Dashboard"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Dashboard />
      <div className="dark:bg-black" />
      <div className="bg-yellow-500" />
    </>
  )
}