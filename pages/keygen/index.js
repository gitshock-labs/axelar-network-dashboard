import CoinInfo from '../../components/coin-info'
import Keygen from '../../components/keygen'
import SectionTitle from '../../components/section-title'

export default function KeygenIndex() {
  return (
    <>
      <SectionTitle
        title="Keygen Details"
        subtitle={<>Keygen <span className="text-gray-500 text-sm font-light italic">(Mocked)</span></>}
        right={<CoinInfo />}
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Keygen />
    </>
  )
}