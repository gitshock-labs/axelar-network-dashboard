import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { denomSymbol } from '../../lib/object/denom'
import { numberFormat } from '../../lib/utils'

export default function VotingPower({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { chain_data } = { ..._data }

  return (
    <Widget
      title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Voting Power</span>}
      className="min-h-full"
    >
      {data ?
        <div className="flex items-center justify-center mt-4 mb-6">
          <div className="w-60 h-28 bg-gray-900 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="flex flex-col">
              <span className="text-gray-100 dark:text-gray-100 text-2xl font-semibold">{numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}</span>
              {chain_data?.staking_pool?.bonded_tokens && (
                <span className="text-gray-200 dark:text-gray-200 text-sm text-center">(~ {numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)) * 100 / Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00')}%)</span>
              )}
            </div>
          </div>
        </div>
        :
        <div className="flex items-center justify-center mt-4 mb-6">
          <div className="skeleton w-60 h-28 rounded-lg" />
        </div>
      }
      {data ?
        <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 text-base gap-2 lg:gap-4">
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Self Delegation Ratio</span>
            <span className="flex items-center font-light space-x-1">
              <span>{numberFormat(data.self_delegation * 100 / data.delegator_shares, '0,0.00')}%</span>
              <span className="text-gray-400 dark:text-gray-600 space-x-1">
                <span>(~</span>
                <span>{numberFormat(Math.floor(data.self_delegation / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}</span>
                <span className="uppercase">{chain_data?.staking_params && denomSymbol(chain_data.staking_params.bond_denom)})</span>
              </span>
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Delegator Shares</span>
            <span className="font-light">{numberFormat(data.delegator_shares / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION), '0,0')}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Proposer Priority</span>
            <span className="font-light">{!isNaN(data.proposer_priority) ? numberFormat(data.proposer_priority, '0,0') : '-'}</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Tokens</span>
            <span className="font-light">{numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}</span>
          </div>
        </div>
        :
        <div className="w-full grid grid-flow-row grid-cols-1 lg:grid-cols-2 text-base gap-3 lg:gap-8 mb-2">
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