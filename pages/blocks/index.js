import CoinInfo from '../../components/coin-info'
import BlocksTable from '../../components/blocks/blocks-table'
import SectionTitle from '../../components/section-title'

export default function Blocks() {
  return (
    <>
      <SectionTitle
        title="Latest blocks"
        subtitle="Blocks"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <div className="max-w-4xl my-4 xl:my-6 mx-auto">
        <BlocksTable className="no-border" />
      </div>
    </>
  )
}