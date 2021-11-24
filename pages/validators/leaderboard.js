import LeaderboardNav from '../../components/leaderboard-nav'
import SectionTitle from '../../components/section-title'

export default function SnapshotsIndex() {
  return (
    <>
      <SectionTitle
        title="Validators"
        subtitle="Leaderboard"
        right={<LeaderboardNav />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      Coming Soon
    </>
  )
}