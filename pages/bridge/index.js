import CoinInfo from '../../components/coin-info'
import BridgeTable from '../../components/bridge/bridge-table'
import SectionTitle from '../../components/section-title'

export default function Bridge() {
  return (
    <>
      <SectionTitle
        title="List of Bridge Accounts"
        subtitle="Bridge Accounts"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <BridgeTable />
    </>
  )
}