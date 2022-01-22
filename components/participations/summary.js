import Link from 'next/link'
import PropTypes from 'prop-types'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import { FiServer } from 'react-icons/fi'

import Widget from '../widget'

import { feeDenom, denomSymbol, denomAmount } from '../../lib/object/denom'
import { idFromEvmId, chains, chainImage } from '../../lib/object/chain'
import { numberFormat } from '../../lib/utils'

const Summary = ({ data, successKeygens, failedKeygens, signAttempts, failedSignAttempts }) => {
  const { _data } = useSelector(state => ({ _data: state.data }), shallowEqual)
  const { denoms_data, validators_data, validators_chains_data } = { ..._data }

  const keyRequirements = _.groupBy(data?.tss?.params?.key_requirements || [], 'key_type')

  const activeValidators = validators_data?.filter(validator => ['BOND_STATUS_BONDED'].includes(validator.status)).map(validator_data => {
    return {
      ...validator_data,
      supported_chains: _.uniq(_.concat(validator_data?.supported_chains || [], Object.entries(validators_chains_data || {}).filter(([key, value]) => value?.includes(validator_data?.operator_address)).map(([key, value]) => key))),
    }
  })

  let evmVotingThreshold = data?.evm?.chains

  // if (evmVotingThreshold?.length > 0 && chains) {
  //   for (let i = 0; i < chains.length; i++) {
  //     const chain = chains[i]

  //     if (chain.threshold && evmVotingThreshold.findIndex(_chain => _chain?.params?.chain === chain?.name) < 0) {
  //       evmVotingThreshold.push({ ...evmVotingThreshold[0], chain: chain?.name })
  //     }
  //   }
  // }

  evmVotingThreshold = evmVotingThreshold?.map(_chain => {
    const maintainValidators = activeValidators?.findIndex(validator => validator.supported_chains?.includes(idFromEvmId(_chain?.params?.chain))) > -1 && activeValidators.filter(validator => validator.supported_chains?.includes(idFromEvmId(_chain?.params?.chain)))

    return {
      ..._chain?.params,
      num_maintain_validators: maintainValidators?.length,
      maintain_staking: denoms_data && maintainValidators && denomAmount(_.sumBy(maintainValidators, 'tokens'), feeDenom, denoms_data),
      total_staking: denoms_data && activeValidators && denomAmount(_.sumBy(activeValidators, 'tokens'), feeDenom, denoms_data),
      denom: denoms_data && denomSymbol(feeDenom, denoms_data),
    }
  }).map(_chain => {
    return {
      ..._chain,
      staking_percentage: typeof _chain.maintain_staking === 'number' && typeof _chain.total_staking === 'number' && (_chain.maintain_staking * 100 / _chain.total_staking),
    }
  })

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-4 my-4">
      <Widget
        title="Keygen Min Participation Requirement"
        className="xl:col-span-3 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
      >
        <span className="flex flex-col space-y-1 mt-1">
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                Object.entries(keyRequirements).map(([key, value]) => (
                  <div key={key} className="col-span-2">
                    <div className="text-gray-400 dark:text-gray-600 text-xs">{key?.replace('KEY_TYPE_', '')}</div>
                    <div className="grid grid-flow-row grid-cols-2 gap-2">
                      {value.map((_key, i) => (
                        <span key={i} className="h-8 text-3xl lg:text-2xl xl:text-3xl font-semibold">
                          {_key.min_keygen_threshold?.denominator > 0 ? numberFormat(_key.min_keygen_threshold.numerator * 100 / _key.min_keygen_threshold.denominator, '0,0.00') : '-'}
                          <span className="text-lg font-normal">%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
                :
                <span className="h-8 text-3xl font-semibold">
                  {typeof data.active_keygen_threshold === 'number' ? numberFormat(data.active_keygen_threshold, '0,0.00') : 'N/A'}
                  <span className="text-lg font-normal">%</span>
                </span>
              :
              <>
                <div className="skeleton w-16 h-7 mt-1" />
                <div className="skeleton w-16 h-7 mt-1" />
              </>
            }
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                _.uniq(Object.values(keyRequirements).flatMap(value => value?.map(_value => _value.key_role))).map((key_role, i) => (
                  <span key={i} className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
                    {key_role?.replace('KEY_ROLE_', '')}
                  </span>
                ))
                :
                null
              :
              <>
                <div className="skeleton w-20 h-4 mt-1" />
                <div className="skeleton w-20 h-4 mt-1" />
              </>
            }
          </div>
        </span>
      </Widget>
      <Widget
        title="Sign Safety Threshold"
        className="xl:col-span-3 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
      >
        <span className="flex flex-col space-y-1 mt-1">
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                Object.entries(keyRequirements).map(([key, value]) => (
                  <div key={key} className="col-span-2">
                    <div className="text-gray-400 dark:text-gray-600 text-xs">{key?.replace('KEY_TYPE_', '')}</div>
                    <div className="grid grid-flow-row grid-cols-2 gap-2">
                      {value.map((_key, i) => (
                        <span key={i} className="h-8 text-3xl lg:text-2xl xl:text-3xl font-semibold">
                          {_key.safety_threshold?.denominator > 0 ? numberFormat(_key.safety_threshold.numerator * 100 / _key.safety_threshold.denominator, '0,0.00') : '-'}
                          <span className="text-lg font-normal">%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
                :
                <span className="h-8 text-3xl font-semibold">N/A</span>
              :
              <>
                <div className="skeleton w-16 h-7 mt-1" />
                <div className="skeleton w-16 h-7 mt-1" />
              </>
            }
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                _.uniq(Object.values(keyRequirements).flatMap(value => value?.map(_value => _value.key_role))).map((key_role, i) => (
                  <span key={i} className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
                    {key_role?.replace('KEY_ROLE_', '')}
                  </span>
                ))
                :
                null
              :
              <>
                <div className="skeleton w-20 h-4 mt-1" />
                <div className="skeleton w-20 h-4 mt-1" />
              </>
            }
          </div>
        </span>
      </Widget>
      <Widget
        title="Keygen Participation"
        className="xl:col-span-2 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
      >
        <span className="flex flex-col space-y-1 mt-1.5">
          <div className="flex flex-row space-x-1.5">
            {typeof successKeygens === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(successKeygens, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
            <span className="h-8 text-gray-600 dark:text-gray-400 text-3xl font-light">/</span>
            {typeof failedKeygens === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(failedKeygens, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
          </div>
          <div className="grid">
            <span className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
              Success / Failed
            </span>
          </div>
        </span>
      </Widget>
      <Widget
        title="Sign Attempts"
        className="xl:col-span-2 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
      >
        <span className="flex flex-col space-y-1 mt-1.5">
          <div className="flex flex-row space-x-1.5">
            {typeof signAttempts === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(signAttempts, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
            <span className="h-8 text-gray-600 dark:text-gray-400 text-3xl font-light">/</span>
            {typeof failedSignAttempts === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(failedSignAttempts, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
          </div>
          <div className="grid">
            <span className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
              Success / Failed
            </span>
          </div>
        </span>
      </Widget>
      {evmVotingThreshold ?
        evmVotingThreshold.map((_chain, i) => (
          <Widget
            key={i}
            title={<div className="flex items-center">
              <img
                src={chainImage(idFromEvmId(_chain?.chain))}
                alt=""
                className="w-6 h-6 rounded-full mr-1.5"
              />
              <span>{_chain?.chain}</span>
            </div>}
            className="xl:col-span-2 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
          >
            <span className="flex flex-col space-y-1 mt-1">
              <div className="grid grid-flow-row grid-cols-1 gap-4">
                <div className="col-span-1">
                  <div className="uppercase text-gray-400 dark:text-gray-600 text-xs">Threshold</div>
                  <div className="grid grid-flow-row grid-cols-2 gap-2">
                    <span key={i} className="h-8 text-3xl lg:text-2xl xl:text-3xl font-semibold">
                      {_chain.voting_threshold?.denominator > 0 ? numberFormat(_chain.voting_threshold.numerator * 100 / _chain.voting_threshold.denominator, '0,0.00') : '-'}
                      <span className="text-lg font-normal">%</span>
                    </span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="uppercase text-gray-400 dark:text-gray-600 text-xs">Stake Maintaining</div>
                  <div className="grid grid-flow-row grid-cols-1 gap-2">
                    {typeof _chain.staking_percentage === 'number' ?
                      <span className="h-8 flex items-center text-3xl lg:text-2xl xl:text-3xl font-semibold">
                        <span>{numberFormat(_chain.staking_percentage, '0,0.00')}</span>
                        <span className="text-lg font-normal mr-1 pt-2">%</span>
                        <span className="flex items-center text-gray-400 dark:text-gray-600 text-2xs space-x-1 pt-2">
                          (
                          <span>{numberFormat(_chain.num_maintain_validators, '0,0')} / {numberFormat(activeValidators?.length, '0,0')}</span>
                          <FiServer size={12} className="stroke-current" />
                          )
                        </span>
                      </span>
                      :
                      <div className="skeleton w-16 h-7 mt-1" />
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-flow-row grid-cols-2 gap-4">
                <div className="col-span-1">
                  {typeof _chain.staking_percentage === 'number' ?
                    <span className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
                      <span className="mr-1">{numberFormat(_chain.maintain_staking, '0,0.00a')}</span>
                      <span className="mr-1">/</span>
                      <span className="mr-1">{numberFormat(_chain.total_staking, '0,0.00a')}</span>
                      <span className="uppercase font-medium mr-1">{_chain.denom}</span>
                    </span>
                    :
                    <div className="skeleton w-20 h-4 mt-1" />
                  }
                </div>
              </div>
            </span>
          </Widget>
        ))
        :
        [...Array(6).keys()].map(i => (
          <Widget
            key={i}
            title="Chain Maintaining"
            className="xl:col-span-2 bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-900 p-0 sm:p-4"
          >
            <span className="flex flex-col space-y-1 mt-1">
              <div className="grid">
                <div className="skeleton w-16 h-7 mt-1" />
              </div>
              <div className="grid">
                <div className="skeleton w-20 h-4 mt-1" />
              </div>
            </span>
          </Widget>
        ))
      }
    </div>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
  successKeygens: PropTypes.any,
  failedKeygens: PropTypes.any,
  signAttempts: PropTypes.any,
  failedSignAttempts: PropTypes.any,
}

export default Summary