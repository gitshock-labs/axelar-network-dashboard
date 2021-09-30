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
        subtitle={<div className="flex items-center space-x-2 xl:space-x-0">
          <span className="xl:hidden uppercase text-sm xl:text-lg">{ellipseAddress(query.address, 16)}</span>
          <span className="hidden xl:block uppercase text-sm xl:text-lg xl:pr-2">{ellipseAddress(query.address, 32)}</span>
          <Copy size={20} text={query.address} />
        </div>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Validator address={query.address} />
    </>
  )
}