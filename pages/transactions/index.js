import TransactionsTable from '../../components/transactions/transactions-table'

export default function Transactions() {
  return (
    <div className="max-w-5xl my-2 xl:my-4 mx-auto">
      <TransactionsTable className="no-border" />
    </div>
  )
}