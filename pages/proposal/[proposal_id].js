import { useRouter } from 'next/router'

import CoinInfo from '../../components/coin-info'
import Proposal from '../../components/proposals/proposal'
import SectionTitle from '../../components/section-title'

import { numberFormat } from '../../lib/utils'

export default function ProposalIndex() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title="Details for Proposal"
        subtitle={<div className="flex items-center space-x-2">
          <span className="uppercase text-sm lg:text-lg"># {numberFormat(query.proposal_id, '0,0')}</span>
        </div>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Proposal id={query.proposal_id} />
    </>
  )
}