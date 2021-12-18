import TransferInfo from '../../components/transfer-info'
import Crosschain from '../../components/crosschain'
import SectionTitle from '../../components/section-title'

export default function CrosschainIndex() {
  return (
    <>
      <SectionTitle
        title="Traffic Details"
        subtitle="Cross-chain"
        right={<TransferInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <div className="max-w-6xl my-4 xl:my-6 mx-auto">
        <Crosschain />
      </div>
    </>
  )
}