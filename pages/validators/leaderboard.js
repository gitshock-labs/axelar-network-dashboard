import LeaderboardNav from '../../components/leaderboard-nav'
import Leaderboard from '../../components/leaderboard'
import SectionTitle from '../../components/section-title'

export default function LeaderboardIndex() {
  return (
    <>
      <SectionTitle
        title="Validators"
        subtitle="Leaderboard"
        right={<LeaderboardNav />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Leaderboard />
    </>
  )
}