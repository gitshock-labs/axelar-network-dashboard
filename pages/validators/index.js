import ValidatorsTable from '../../components/validators/validators-table'
import SectionTitle from '../../components/section-title'

export default function Validators() {
  return (
    <>
      <SectionTitle
        title="List of active validators"
        subtitle="Validators"
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <ValidatorsTable status="active" />
    </>
  )
}