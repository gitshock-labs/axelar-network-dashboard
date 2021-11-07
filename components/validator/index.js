import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import moment from 'moment'

import Information from './information'
import CosmosGeneric from './cosmos-generic'
import AxelarSpecific from './axelar-specific'
import VotingPower from './voting-power'
import Uptime from './uptime'
import KeysTable from '../participations/keys-table'
import TransactionsTable from '../transactions/transactions-table'
import DelegationsTable from './delegations-table'
import Widget from '../widget'

import { getUptime, uptimeForJailedInfo, keygens as getKeygens } from '../../lib/api/query'
import { status as getStatus } from '../../lib/api/rpc'
import { allValidators, validatorSets, slashingParams, allDelegations, distributionRewards, distributionCommission } from '../../lib/api/cosmos'
import { getKeygensByValidator } from '../../lib/api/executor'
import { signAttempts as getSignAttempts, successKeygens as getSuccessKeygens, failedKeygens as getFailedKeygens } from '../../lib/api/opensearch'
import { denomSymbol, denomAmount } from '../../lib/object/denom'
import { getName } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA } from '../../reducers/types'

export default function Validator({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data, status_data, validators_data } = { ...data }

  const [validator, setValidator] = useState(null)
  const [uptime, setUptime] = useState(null)
  const [jailed, setJailed] = useState(null)
  const [tab, setTab] = useState('key_share')
  const [keyShares, setKeyShares] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [signs, setSigns] = useState(null)
  const [delegations, setDelegations] = useState(null)
  const [health, setHealth] = useState(null)
  const [chainsSupported, setChainsSupported] = useState(null)
  const [rewards, setRewards] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getStatus()

        if (response) {
          dispatch({
            type: STATUS_DATA,
            value: response,
          })
        }
      }
    }

    getData()

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, address, Number(status_data.latest_block_height), denoms_data)

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data,
          })
        }
      }
    }

    if (address && status_data && denoms_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, status_data, denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let validatorData, response

      const validator_data = validators_data?.[validators_data.findIndex(validator_data => validator_data.operator_address === address)]

      if (validator_data) {
        validatorData = { ...validatorData, ...validator_data }
      
        if (!controller.signal.aborted) {
          response = await validatorSets()

          if (response?.result?.validators?.findIndex(validator_data => validator_data.address === validatorData.consensus_address) > -1) {
            const _validatorData = response.result.validators?.find(validator_data => validator_data.address === validatorData.consensus_address)

            validatorData = {
              ...validatorData,
              proposer_priority: _validatorData?.proposer_priority,
              voting_power: Number(_validatorData?.voting_power),
            }
          }
        }
      }

      setValidator({ data: validatorData || {}, address })

      const _health = {
        broadcaster_registration: !(validatorData?.tss_illegibility_info?.no_proxy_registered) && validatorData?.broadcaster_address ? true : false,
      }

      setHealth({ data: _health, address })

      if (!controller.signal.aborted) {
        response = await getUptime(Number(status_data.latest_block_height), validatorData?.consensus_address)

        if (response) {
          setUptime({ data: response.data || [], address })
        }
      }

      setChainsSupported({ data: {}, address })

      let _delegations

      if (!controller.signal.aborted) {
        response = await allDelegations(address)

        if (response) {
          _delegations = _.orderBy(response.data?.map(delegation => {
            return {
              ...delegation.delegation,
              self: validatorData && delegation.delegation.delegator_address === validatorData.delegator_address,
              shares: delegation.delegation && denomAmount(delegation.delegation.shares, delegation.balance?.denom, denoms_data),
              ...delegation.balance,
              denom: denomSymbol(delegation.balance?.denom, denoms_data),
              amount: delegation.balance && denomAmount(delegation.balance.amount, delegation.balance.denom, denoms_data),
            }
          }) || [], ['self', 'shares'], ['desc', 'desc'])

          setDelegations({ data: _delegations, address })
        }
      }

      if (!controller.signal.aborted) {
        let _rewards = []

        response = await distributionRewards(validatorData?.delegator_address)

        if (response && !response.error) {
          _rewards.push({
            ...response,
            name: 'Distribution Rewards',
            rewards: response.rewards && Object.entries(_.groupBy(response.rewards.flatMap(reward => reward.reward).map(reward => { return { ...reward, denom: denomSymbol(reward.denom, denoms_data), amount: reward.amount && (isNaN(reward.amount) ? -1 : denomAmount(reward.amount, reward.denom, denoms_data)) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
            total: response.total && Object.entries(_.groupBy(response.total.map(total => { return { ...total, denom: denomSymbol(total.denom, denoms_data), amount: total.amount && denomAmount(total.amount, total.denom, denoms_data) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
          })
        }

        response = await distributionCommission(validatorData?.operator_address)

        if (response && !response.error) {
          _rewards.push({
            ...response,
            name: 'Distribution Commission',
            total: response?.commission?.commission?.map(commission => {
              return {
                ...commission,
                denom: denomSymbol(commission.denom, denoms_data),
                amount: commission.amount && (isNaN(commission.amount) ? -1 : denomAmount(commission.amount, commission.denom, denoms_data)),
              }
            }),
          })
        }

        _rewards = _rewards.map(_reward => {
          return {
            ..._reward,
            rewards_per_stake: _reward.total?.map(_denom => {
              const stake = _.sumBy(_delegations?.filter(_delegation => _delegation.denom === _denom.denom) || [], 'amount')

              return {
                ..._denom,
                stake,
                amount_per_stake: _denom.amount / (stake > 0 ? stake : 1),
              }
            }),
          }
        })

        setRewards({ data: _rewards, address })
      }
    }

    if (address && denoms_data && status_data && validators_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 2 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address, denoms_data, status_data, validators_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const validatorData = validator?.data

        let jailedData, response

        if (validatorData?.jailed_until > 0) {
          response = await uptimeForJailedInfo(
            Number(status_data.latest_block_height) - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) > validatorData?.start_height ? Number(status_data.latest_block_height) - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) : validatorData?.start_height,
            validatorData?.consensus_address,
            status_data && (moment(status_data.latest_block_time).diff(moment(status_data.earliest_block_time), 'milliseconds') / Number(status_data.latest_block_height))
          )

          if (response?.data) {
            const uptimeData = response.data

            response = await slashingParams()

            const maxMissed = response?.params ? Number(response.params.signed_blocks_window) - (Number(response.params.min_signed_per_window) * Number(response.params.signed_blocks_window)) : Number(NEXT_PUBLIC_DEFAULT_MAX_MISSED)

            const _jailedData = []

            let numMissed = 0, _jailed = false

            for (let i = 0; i < uptimeData.length; i++) {
              const block = uptimeData[i]

              if (block?.up) {
                if (_jailed) {
                  if (_jailedData.length - 1 >= 0) {
                    _jailedData[_jailedData.length - 1].unjail_time = block.time
                  }
                }

                numMissed = 0
                _jailed = false
              }
              else {
                numMissed++
              }

              if (numMissed > maxMissed && !_jailed) {
                _jailedData.push(block)

                _jailed = true
              }
            }

            jailedData = {
              times_jailed: _jailedData.length,
              avg_jail_response_time: _jailedData.filter(_block => _block.unjail_time).length > 0 ? _.meanBy(_jailedData.filter(_block => _block.unjail_time).map(_block => { return { ..._block, response_time: _block.unjail_time - _block.time }}), 'response_time') : -1,
            }
          }
        }
        else {
          jailedData = {
            times_jailed: 0,
            avg_jail_response_time: 0,
          }
        }

        setJailed({ data: jailedData || {}, address })
      }
    }

    if (address && validator?.address === address) {
      getData()
    }

    return () => {
      controller?.abort()
    }
  }, [address, validator])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let response, keygensData, signsData

      if (!controller.signal.aborted) {
        response = await getKeygensByValidator(address)

        if (response) {
          setKeyShares({ data: response, address })
        }
      }

      if (!controller.signal.aborted) {
        response = await getSuccessKeygens({ size: 1000, sort: [{ height: 'desc' }] })

        let _data = response?.data || []

        for (let i = 0; i < _data.length; i++) {
          const _keygen = _data[i]

          _data[i] = {
            ..._keygen,
            key_chain: _keygen.key_chain || (_keygen?.key_id?.split('-').length > 1 && getName(_keygen.key_id.split('-')[0])),
            key_role: _keygen.key_role || (_keygen?.key_id?.split('-').length > 2 && `${_keygen.key_id.split('-')[1].toUpperCase()}_KEY`),
            participated: _keygen.snapshot_validators?.validators?.findIndex(_validator => _validator?.validator?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            not_participated: _keygen.snapshot_non_participant_validators?.validators?.findIndex(_validator => _validator?.validator?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            success: true,
          }
        }

        keygensData = _.orderBy(_.concat(keygensData || [], _data.filter(_keygen => _keygen.participated || _keygen.not_participated)), ['height'], ['desc'])

        response = await getFailedKeygens({ size: 1000, sort: [{ height: 'desc' }] })

        _data = response?.data || []

        for (let i = 0; i < _data.length; i++) {
          const _keygen = _data[i]

          _data[i] = {
            ..._keygen,
            key_chain: _keygen.key_chain || (_keygen?.key_id?.split('-').length > 1 && getName(_keygen.key_id.split('-')[0])),
            key_role: _keygen.key_role || (_keygen?.key_id?.split('-').length > 2 && `${_keygen.key_id.split('-')[1].toUpperCase()}_KEY`),
            participated: _keygen.snapshot_validators?.validators?.findIndex(_validator => _validator?.validator?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            not_participated: _keygen.snapshot_non_participant_validators?.validators?.findIndex(_validator => _validator?.validator?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            success: false,
          }
        }

        keygensData = _.orderBy(_.concat(keygensData || [], _data.filter(_keygen => _keygen.participated || _keygen.not_participated)), ['height'], ['desc'])

        setKeygens({ data: keygensData, total: keygensData.length, address })
      }

      if (!controller.signal.aborted) {
        response = await getSignAttempts({ size: 1000, query: { match: { result: true } }, sort: [{ height: 'desc' }] })

        let _data = response?.data || []

        for (let i = 0; i < _data.length; i++) {
          const _sign = _data[i]

          _data[i] = {
            ..._sign,
            key_chain: _sign.key_chain || (_sign?.key_id?.split('-').length > 1 && getName(_sign.key_id.split('-')[0])),
            key_role: _sign.key_role || (_sign?.key_id?.split('-').length > 2 && `${_sign.key_id.split('-')[1].toUpperCase()}_KEY`),
            participated: _sign.participants?.findIndex(_address => _address?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            not_participated: _sign.non_participants?.findIndex(_address => _address?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            success: true,
          }
        }

        signsData = _.orderBy(_.concat(signsData || [], _data.filter(_keygen => _keygen.participated || _keygen.not_participated)), ['height'], ['desc'])

        response = await getSignAttempts({ size: 1000, query: { match: { result: false } }, sort: [{ height: 'desc' }] })

        _data = response?.data || []

        for (let i = 0; i < _data.length; i++) {
          const _sign = _data[i]

          _data[i] = {
            ..._sign,
            key_chain: _sign.key_chain || (_sign?.key_id?.split('-').length > 1 && getName(_sign.key_id.split('-')[0])),
            key_role: _sign.key_role || (_sign?.key_id?.split('-').length > 2 && `${_sign.key_id.split('-')[1].toUpperCase()}_KEY`),
            participated: _sign.participants?.findIndex(_address => _address?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            not_participated: _sign.non_participants?.findIndex(_address => _address?.toLowerCase() === address?.toLowerCase()) > -1 ? true : false,
            success: false,
          }
        }

        signsData = _.orderBy(_.concat(signsData || [], _data.filter(_keygen => _keygen.participated || _keygen.not_participated)), ['height'], ['desc'])

        setSigns({ data: signsData, total: signsData.length, address })
      }
    }

    if (address) {
      getData()
    }

    const interval = setInterval(() => getData(), 4 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [address])

  return (
    <>
      <div className="my-4">
        <Information
          data={validator?.address === address && validator?.data}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        <CosmosGeneric
          data={validator?.address === address && validator?.data}
          health={health?.address === address && health?.data}
          jailed={jailed?.address === address && jailed?.data}
        />
        <AxelarSpecific
          data={validator?.address === address && validator?.data}
          keygens={keygens?.address === address && keygens?.data}
          signs={signs?.address === address && signs?.data}
          chainsSupported={chainsSupported?.address === address && chainsSupported?.data}
          rewards={rewards?.address === address && rewards?.data}
        />
        <VotingPower data={validator?.address === address && validator?.data} />
        <Uptime data={uptime?.address === address && uptime?.data} validator_data={validator?.address === address && validator?.data} />
        <Widget
          title={<div className="grid grid-flow-row grid-cols-3 sm:grid-cols-4 md:grid-cols-3 xl:flex flex-row items-center space-x-1">
            {['key_share', 'keygen', 'sign'].map((_tab, i) => (
              <div
                key={i}
                onClick={() => setTab(_tab)}
                className={`max-w-min sm:max-w-max md:max-w-min lg:max-w-max btn btn-default btn-rounded cursor-pointer whitespace-nowrap bg-trasparent ${_tab === tab ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 text-white dark:hover:text-gray-100'}`}
              >
                {getName(_tab)}
              </div>
            ))}
          </div>}
          className="px-2 md:px-4"
        >
          <div className="mt-1">
            {tab === 'keygen' ?
              <KeysTable data={keygens} page="validator-keygen" />
              :
              tab === 'sign' ?
                <KeysTable data={signs} page="validator-sign" />
                :
                <KeysTable data={keyShares} page="validator" />
            }
          </div>
        </Widget>
        <Widget
          title={<span className="text-lg font-medium">Delegations</span>}
        >
          <div className="mt-2">
            <DelegationsTable data={delegations?.address === address && delegations?.data} />
          </div>
        </Widget>
      </div>
    </>
  )
}