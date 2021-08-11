import CoinInfo from '../components/coin-info'
import Dashboard from '../components/dashboard'
import SectionTitle from '../components/section-title'

export default function Index() {
  return (
    <>
      <SectionTitle
        title="Overview"
        subtitle="Dashboard"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Dashboard />
    </>
  )
}