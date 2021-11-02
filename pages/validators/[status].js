import { useRouter } from 'next/router'

// import CoinInfo from '../../components/coin-info'
import SlashingInfo from '../../components/slashing-info'
import ValidatorsTable from '../../components/validators/validators-table'
import SectionTitle from '../../components/section-title'

export default function ValidatorsStatus() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title={`List of ${query.status} validators`}
        subtitle="Validators"
        right={<SlashingInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <ValidatorsTable status={query.status} />
    </>
  )
}