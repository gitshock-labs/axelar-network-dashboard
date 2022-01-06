import CoinInfo from '../../components/coin-info'
import ProposalsTable from '../../components/proposals/proposals-table'
import SectionTitle from '../../components/section-title'

export default function Proposals() {
  return (
    <>
      <SectionTitle
        title="List of proposals"
        subtitle="Proposals"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <div className="max-w-7xl my-4 xl:my-6 mx-auto">
        <ProposalsTable
          className="no-border"
        />
      </div>
    </>
  )
}