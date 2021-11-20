import { useRouter } from 'next/router'

import CoinInfo from '../../components/coin-info'
import Block from '../../components/blocks/block'
import SectionTitle from '../../components/section-title'

export default function height() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title="Details for Block"
        subtitle={`#${query?.height}`}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Block height={query?.height} />
    </>
  )
}