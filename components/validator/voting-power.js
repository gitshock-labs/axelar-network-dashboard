import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat } from '../../lib/utils'

export default function VotingPower({ data }) {
  return (
    <Widget
      title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Voting Power</span>}
    >
      {data ?
        <div className="flex items-center justify-center my-6">
          <div className="w-60 h-28 bg-gray-800 dark:bg-gray-200 flex items-center justify-center">
            <div className="flex flex-col">
              <span className="text-gray-200 dark:text-gray-800 text-2xl font-semibold">{numberFormat(data.voting_power, '0,0')}</span>
              <span className="text-gray-200 dark:text-gray-800 text-sm text-center">(~ {numberFormat(data.voting_power_percentage, '0,0.00')}%)</span>
            </div>
          </div>
        </div>
        :
        <div className="flex items-center justify-center my-6">
          <div className="skeleton w-60 h-28" />
        </div>
      }
      {data ?
        <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 text-base gap-2 lg:gap-4">
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Self Delegation Ratio</span>
            <span className="flex items-center font-light space-x-1">
              <span>{numberFormat(data.self_delegation_ratio, '0,0.00')}%</span>
              <span className="text-gray-400 dark:text-gray-600">(~ {numberFormat(data.self_delegation, '0,0')} <span className="uppercase">{data.symbol}</span>)</span>
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Delegator Shares</span>
            <span className="font-light">{numberFormat(data.delegator_shares, '0,0')}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Proposer Priority</span>
            <span className="font-light">{numberFormat(data.proposer_priority, '0,0')}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Tokens</span>
            <span className="font-light">{numberFormat(data.tokens, '0,0')}</span>
          </div>
        </div>
        :
        <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 text-base gap-3 lg:gap-8">
          <div className="flex flex-col space-y-4">
            <div className="skeleton w-48 h-4" />
            <div className="skeleton w-40 h-5" />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="skeleton w-48 h-4" />
            <div className="skeleton w-32 h-5" />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="skeleton w-40 h-4" />
            <div className="skeleton w-32 h-5" />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="skeleton w-24 h-4" />
            <div className="skeleton w-32 h-5" />
          </div>
        </div>
      }
    </Widget>
  )
}