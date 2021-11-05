import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { denomSymbol } from '../../lib/object/denom'
import { numberFormat } from '../../lib/utils'

export default function VotingPower({ data }) {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { denoms_data, chain_data } = { ..._data }

  return (
    <Widget
      title={<span className="text-lg font-medium">Voting Power</span>}
      className="min-h-full"
    >
      {data ?
        <div className="flex items-center sm:justify-center mt-5 mb-6">
          <div className="w-60 h-32 bg-gray-900 dark:bg-black rounded-lg flex items-center justify-center">
            <div className="flex flex-col text-center space-y-1">
              <span className="text-white text-2xl font-semibold">{numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}</span>
              {chain_data?.staking_pool?.bonded_tokens && (
                <span className="text-gray-200 dark:text-gray-200 text-sm">(~ {numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)) * 100 / Math.floor(chain_data.staking_pool.bonded_tokens), '0,0.00')}%)</span>
              )}
            </div>
          </div>
        </div>
        :
        <div className="flex items-center justify-center mt-5 mb-6">
          <div className="skeleton w-60 h-32 rounded-lg" />
        </div>
      }
      <div className={`grid grid-flow-row grid-cols-1 sm:grid-cols-2 text-base sm:text-sm lg:text-base gap-4 ${data ? '' : 'my-1.5'}`}>
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Self Delegation Ratio</span>
            <span className="flex items-center text-gray-600 dark:text-gray-400 space-x-1.5">
              <span>{numberFormat(data.self_delegation * 100 / data.delegator_shares, '0,0.00')}%</span>
              <span className="text-gray-500 space-x-1">
                <span>(~</span>
                <span>{numberFormat(Math.floor(data.self_delegation / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}</span>
                <span className="uppercase">{chain_data?.staking_params && denomSymbol(chain_data.staking_params.bond_denom, denoms_data)})</span>
              </span>
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-28 h-5" />
          </div>
        }
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Delegator Shares</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(data.delegator_shares / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION), '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Proposer Priority</span>
            <span className="text-gray-600 dark:text-gray-400">
              {!isNaN(data.proposer_priority) ? numberFormat(data.proposer_priority, '0,0') : '-'}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
        {data ?
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">Tokens</span>
            <span className="text-gray-600 dark:text-gray-400">
              {numberFormat(Math.floor(data.tokens / Number(process.env.NEXT_PUBLIC_POWER_REDUCTION)), '0,0')}
            </span>
          </div>
          :
          <div className="flex flex-col space-y-3">
            <div className="skeleton w-40 h-6" />
            <div className="skeleton w-20 h-5" />
          </div>
        }
      </div>
    </Widget>
  )
}