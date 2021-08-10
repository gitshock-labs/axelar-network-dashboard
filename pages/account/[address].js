import { useRouter } from 'next/router'

import CoinInfo from '../../components/coin-info'
import Account from '../../components/account'
import SectionTitle from '../../components/section-title'
import Copy from '../../components/copy'

import { ellipseAddress } from '../../lib/utils'

export default function Validators() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title="Details for Account"
        subtitle={<div className="flex items-center space-x-2">
          <span className="uppercase">{ellipseAddress(query.address, 6)}</span>
          <Copy size={20} text={query.address} />
        </div>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Account address={query.address} />
    </>
  )
}