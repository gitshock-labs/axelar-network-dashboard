import Link from 'next/link'

import moment from 'moment'

import Widget from '../widget'

import { numberFormat } from '../../lib/utils'

export default function BlockDetail({ data }) {
  return (
    <Widget>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
        <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
          <span className="font-semibold">Height:</span>
          {data ?
            <span>{data.height}</span>
            :
            <div className="skeleton w-16 h-4" />
          }
        </div>
        <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
          <span className="font-semibold">Block Hash:</span>
          {data ?
            <span className="uppercase">{data.hash}</span>
            :
            <div className="skeleton w-48 h-4" />
          }
        </div>
        <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
          <span className="font-semibold">Block Time:</span>
          {data ?
            <div className="flex items-center space-x-1">
              <span className="text-gray-500 dark:text-gray-400">{moment(data.time).fromNow()}</span>
              <span className="text-xs font-medium">({moment(data.time).format('MMM D, YYYY h:mm:ss A')})</span>
            </div>
            :
            <div className="skeleton w-48 h-4" />
          }
        </div>
        <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
          <span className="font-semibold">No. of Txs:</span>
          {data ?
            <span>{numberFormat(data.txs, '0,0')}</span>
            :
            <div className="skeleton w-10 h-4" />
          }
        </div>
        <div className="flex flex-col lg:flex-row items-start space-x-0 lg:space-x-2">
          <span className="font-semibold">Proposer:</span>
          {data ?
            <Link href={`/validator/${data.proposer.key}`}>
              <a className="font-medium">
                {data.proposer ? data.proposer.name || data.proposer.key : '-'}
              </a>
            </Link>
            :
            <div className="skeleton w-48 h-4" />
          }
        </div>
      </div>
    </Widget>
  )
}