import { useRouter } from 'next/router'

import CoinInfo from '../../components/coin-info'
import Transaction from '../../components/transactions/transaction'
import SectionTitle from '../../components/section-title'
import Copy from '../../components/copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Validators() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title="Details for Transaction"
        subtitle={<div className="flex items-center space-x-2">
          <span className="uppercase">{ellipseAddress(query.tx, 6)}</span>
          <Copy size={20} text={query.tx} />
        </div>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Transaction height={query.tx} />
    </>
  )
}