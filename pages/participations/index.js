import CoinInfo from '../../components/coin-info'
import Participations from '../../components/participations'
import SectionTitle from '../../components/section-title'

export default function ParticipationsIndex() {
  return (
    <>
      <SectionTitle
        title="Latest Participation Details"
        subtitle="Threshold Participation"
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <div className="max-w-8xl mx-auto">
        <Participations />
      </div>
    </>
  )
}