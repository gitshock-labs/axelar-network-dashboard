import Link from 'next/link'

import { BsArrowRight } from 'react-icons/bs'

import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function TransactionLogs({ data }) {
  return (
    <div className="flex flex-col space-y-4">
      {(data ?
        data.logs.map((log, i) => { return { ...log, i } })
        :
        [...Array(2).keys()].map(i => { return { i, skeleton: true } })
      ).map((log, i) => (
        <div key={i} className="min-w-max max-w-2xl bg-white dark:bg-gray-800 rounded shadow-lg flex items-center space-x-4 p-4">
          <div className="flex flex-col">
            {!log.skeleton ?
              <>
                <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                  <Link href={`/${log.from.type === 'validator' ? 'validator' : 'account'}/${log.from.key}`}>
                    <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                      {ellipseAddress(log.from.key)}
                    </a>
                  </Link>
                  <Copy text={log.from.key} />
                </div>
                {log.from.name && (
                  <span className="text-xs">{log.from.name}</span>
                )}
              </>
              :
              <>
                <div className="skeleton w-60 h-6" />
                <div className="skeleton w-24 h-4 mt-2" />
              </>
            }
          </div>
          <div className="flex flex-col items-center">
            {!log.skeleton ?
              <>
                <BsArrowRight size={24} />
                {typeof log.value === 'number' ?
                  <span className="flex items-center justify-end space-x-1">
                    <span>{numberFormat(log.value, '0,0.00000000')}</span>
                    <span className="uppercase font-medium">{data.symbol}</span>
                  </span>
                  :
                  '-'
                }
              </>
              :
              <>
                <div className="skeleton w-16 h-4" />
                <div className="skeleton w-24 h-4 mt-2" />
              </>
            }
          </div>
          <div className="flex flex-col">
            {!log.skeleton ?
              <>
                <div className="flex flex-wrap items-center text-xs lg:text-base space-x-1">
                  <Link href={`/${log.to.type === 'validator' ? 'validator' : 'account'}/${log.to.key}`}>
                    <a className="uppercase text-blue-600 dark:text-blue-400 font-medium">
                      {ellipseAddress(log.to.key)}
                    </a>
                  </Link>
                  <Copy text={log.to.key} />
                </div>
                {log.to.name && (
                  <span className="text-xs">{log.to.name}</span>
                )}
              </>
              :
              <>
                <div className="skeleton w-60 h-6" />
                <div className="skeleton w-24 h-4 mt-2" />
              </>
            }
          </div>
        </div>
      ))}
    </div>
  )
}