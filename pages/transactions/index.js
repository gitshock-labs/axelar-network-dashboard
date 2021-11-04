import CoinInfo from '../../components/coin-info'
import TransactionsTable from '../../components/transactions/transactions-table'
import SectionTitle from '../../components/section-title'

export default function Transactions() {
  return (
    <>
      <SectionTitle
        title="Latest transactions"
        subtitle="Transactions"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <div className="max-w-5xl my-4 xl:my-6 mx-auto">
        <TransactionsTable />
      </div>
    </>
  )
}