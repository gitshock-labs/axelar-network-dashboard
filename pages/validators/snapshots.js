import LeaderboardNav from '../../components/leaderboard-nav'
import Snapshots from '../../components/snapshots'
import SectionTitle from '../../components/section-title'

export default function SnapshotsIndex() {
  return (
    <>
      <SectionTitle
        title="Latest Snapshots"
        subtitle="Validators"
        right={<LeaderboardNav />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Snapshots />
    </>
  )
}