import CoinInfo from '../../components/coin-info'
import Bridge from '../../components/bridge'
import SectionTitle from '../../components/section-title'

export default function BridgeIndex() {
  return (
    <>
      <SectionTitle
        title="List of Bridge Accounts"
        subtitle={<>Bridge Accounts <span className="text-gray-500 text-sm font-light italic">(Mocked)</span></>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Bridge />
    </>
  )
}