import { useRouter } from 'next/router'

import CoinInfo from '../../components/coin-info'
import Validator from '../../components/validator'
import SectionTitle from '../../components/section-title'
import Copy from '../../components/copy'

import { ellipseAddress } from '../../lib/utils'

export default function ValidatorAddress() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title="Details for Validator"
        subtitle={<div className="flex items-center space-x-2">
          <span className="uppercase">{ellipseAddress(query.address, 16)}</span>
          <Copy size={20} text={query.address} />
        </div>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Validator address={query.address} />
    </>
  )
}