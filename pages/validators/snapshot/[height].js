import { useRouter } from 'next/router'

import { FiBox } from 'react-icons/fi'

import LeaderboardNav from '../../../components/leaderboard-nav'
import Snapshot from '../../../components/snapshot'
import SectionTitle from '../../../components/section-title'

import { numberFormat } from '../../../lib/utils'

export default function SnapshotIndex() {
  const router = useRouter()
  const { query } = { ...router }

  return (
    <>
      <SectionTitle
        title={<div className="flex items-center space-x-1">
          <span>Snapshot Details</span>
          {/*<span className="flex items-center">
            (<FiBox size={14} className="stroke-current" />
          </span>
          <span>{numberFormat(query?.height - Number(process.env.NEXT_PUBLIC_SNAPSHOT_BLOCK_SIZE) + 1, '0,0')} - {numberFormat(query?.height, '0,0')}</span>
          )*/}
        </div>}
        subtitle={`#${numberFormat(query?.height, '0,0')}`}
        subTitleClassName="font-mono"
        right={<LeaderboardNav />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Snapshot height={query?.height} />
    </>
  )
}