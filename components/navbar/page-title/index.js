import { useRouter } from 'next/router'

import SectionTitle from '../../section-title'
import Copy from '../../copy'
import LeaderboardNav from '../../leaderboard-nav'

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
      title = 'Overview'
      subtitle = 'Cross-chain'
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