import CoinInfo from '../../components/coin-info'
import BridgeAccounts from '../../components/bridge-accounts'
import SectionTitle from '../../components/section-title'

export default function BridgeAccountsIndex() {
  return (
    <>
      <SectionTitle
        title="List of Bridge Accounts"
        subtitle="Bridge Accounts"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <BridgeAccounts />
    </>
  )
}