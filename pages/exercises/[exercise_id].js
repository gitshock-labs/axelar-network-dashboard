import Link from 'next/link'
import { useRouter } from 'next/router'

import { TiArrowRight } from 'react-icons/ti'

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
        title={<div className="flex flex-wrap items-center">
          <span className="text-lg mr-2 sm:mr-4">
            {exercise?.title} Checker
          </span>
          {exercise?.doc_url && (
            <a
              href={exercise.doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-white font-medium space-x-0.5 mr-2"
            >
              <span className="uppercase">Doc</span>
              <TiArrowRight size={16} className="transform -rotate-45" />
            </a>
          )}
          {exercise?.submission_url && (
            <a
              href={exercise.submission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-white font-medium space-x-0.5"
            >
              <span className="uppercase">Submission</span>
              <TiArrowRight size={16} className="transform -rotate-45" />
            </a>
          )}
        </div>}
        subtitle={<div className="text-xs sm:text-sm mt-1">
          {exercise?.description}
        </div>}
        right={<div className="flex flex-wrap">
          {exercises.filter(ex => !ex.disabled).map((item, i) => (
            <Link key={i} href={`/exercises/${item.id}`}>
              <a className={`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg flex items-center uppercase space-x-1.5 p-2 ${item.id === exercise_id ? 'text-gray-900 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200 font-bold' : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium'}`}>
                <span className="text-xs">Ex {item.id}</span>
              </a>
            </Link>
          ))}
        </div>}
        subTitleClassName="min-w-min"
        className="flex-col sm:flex-row items-start sm:items-center"
      />
      <Exercises id={exercise_id} />
    </>
  )
}