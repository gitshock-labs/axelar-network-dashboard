import Link from 'next/link'
import { useRouter } from 'next/router'

import { TiArrowRight } from 'react-icons/ti'

import SectionTitle from '../../section-title'
import Copy from '../../copy'
import LeaderboardNav from '../../leaderboard-nav'
import CrosschainInfo from '../../crosschain-info'

import { exercises } from '../../../lib/menus'
import { numberFormat, ellipseAddress } from '../../../lib/utils'

export default function PageTitle() {
  const router = useRouter()
  const { pathname, query } = { ...router }
  const { status, height, address, tx, id } = { ...query }

  let title, subtitle, right

  switch (pathname) {
    case '/':
      title = 'Overview'
      subtitle = 'Dashboard'
      break
    case '/validators':
      title = 'List of active validators'
      subtitle = 'Validators'
      break
    case '/validators/[status]':
      title = `List of ${status} validators`
      subtitle = 'Validators'
      break
    case '/validators/leaderboard':
      title = 'Validators'
      subtitle = 'Leaderboard'
      right = (<LeaderboardNav />)
      break
    case '/validators/snapshots':
      title = 'Latest Snapshots'
      subtitle = 'Validators'
      right = (<LeaderboardNav />)
      break
    case '/validators/snapshot/[height]':
      title = 'Snapshot'
      subtitle = (
        <span className="font-mono">
          # {numberFormat(height, '0,0')}
        </span>
      )
      right = (<LeaderboardNav />)
      break
    case '/validator/[address]':
      title = 'Validator'
      subtitle = (
        <div className="flex items-center space-x-2 xl:space-x-0">
          <span className="xl:hidden uppercase text-sm xl:text-lg">
            {ellipseAddress(address, 16)}
          </span>
          <span className="hidden xl:block uppercase text-sm xl:text-lg xl:pr-2">
            {ellipseAddress(address, 32)}
          </span>
          <Copy size={20} text={address} />
        </div>
      )
      break
    case '/account/[address]':
      title = 'Account'
      subtitle = (
        <div className="flex items-center space-x-2 xl:space-x-0">
          <span className="xl:hidden uppercase text-sm xl:text-lg">
            {ellipseAddress(address, 16)}
          </span>
          <span className="hidden xl:block uppercase text-sm xl:text-lg xl:pr-2">
            {ellipseAddress(address, 24)}
          </span>
          <Copy size={20} text={address} />
        </div>
      )
      break
    case '/blocks':
      title = 'Latest'
      subtitle = 'Blocks'
      break
    case '/block/[height]':
      title = 'Block'
      subtitle = (
        <span className="font-mono">
          # {numberFormat(height, '0,0')}
        </span>
      )
      break
    case '/transactions':
      title = 'Latest'
      subtitle = 'Transactions'
      break
    case '/tx/[tx]':
      title = 'Transaction'
      subtitle = (
        <div className="flex items-center space-x-2 xl:space-x-0">
          <span className="xl:hidden uppercase text-sm xl:text-lg">
            {ellipseAddress(tx, 16)}
          </span>
          <span className="hidden xl:block uppercase text-sm xl:text-lg xl:pr-2">
            {ellipseAddress(tx, 24)}
          </span>
          <Copy size={20} text={address} />
        </div>
      )
      break
    case '/crosschain':
      title = 'Traffic'
      subtitle = 'Cross-chain'
      right = (<CrosschainInfo />)
      break
    case '/participations':
      title = 'Latest'
      subtitle = 'Threshold Participations'
      break
    case '/bridge-accounts':
      title = 'Bridge'
      subtitle = 'Accounts'
      break
    case '/proposals':
      title = 'List of proposals'
      subtitle = 'Proposals'
      break
    case '/proposal/[id]':
      title = 'Proposal'
      subtitle = (
        <span className="font-mono">
          # {numberFormat(id, '0,0')}
        </span>
      )
      break
    case '/exercises/[id]':
      const exercise = id && exercises.find(_exercise => _exercise.id === id)

      title = (
        <div className="flex flex-wrap items-center">
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
        </div>
      )
      subtitle = (
        <div className="leading-5 text-2xs sm:text-sm">
          {exercise?.description}
        </div>
      )
      right = (
        <div className="flex flex-wrap">
          {exercises.filter(ex => !ex.disabled).map((item, i) => (
            <Link key={i} href={`/exercises/${item.id}`}>
              <a className={`bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl flex items-center uppercase space-x-1.5 p-2 ${item.id === id ? 'text-gray-900 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200 font-bold' : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium'}`}>
                <span className="text-xs">Ex {item.id}</span>
              </a>
            </Link>
          ))}
        </div>
      )
      break
    default:
      break
  }

  return (
    <SectionTitle
      title={title}
      subtitle={<div className="mt-1">{subtitle}</div>}
      right={right}
      className="flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 px-2 sm:px-4"
    />
  )
}