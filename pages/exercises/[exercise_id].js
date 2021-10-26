import { useRouter } from 'next/router'

import Exercises from '../../components/exercises'
import SectionTitle from '../../components/section-title'

import { exercises } from '../../lib/menus'

export default function Exercise() {
  const router = useRouter()
  const { query } = { ...router }
  const { exercise_id } = { ...query }
  const exercise = exercise_id && exercises.find(_exercise => _exercise.id === exercise_id)

  return (
    <>
      <SectionTitle
        title={<span className="text-lg">
          {exercise?.title} Checker
        </span>}
        subtitle={<div className="text-xs sm:text-sm mt-1">
          {exercise?.description}
        </div>}
        subTitleClassName="min-w-min"
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Exercises id={exercise_id} />
    </>
  )
}