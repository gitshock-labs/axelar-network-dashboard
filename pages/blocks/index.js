import CoinInfo from '../../components/coin-info'
import BlocksTable from '../../components/blocks/blocks-table'
import SectionTitle from '../../components/section-title'

export default function Validators() {
  return (
    <>
      <SectionTitle
        title="Latest blocks"
        subtitle="Blocks"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <BlocksTable />
    </>
  )
}