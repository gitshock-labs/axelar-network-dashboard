import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import moment from 'moment'

import Information from './information'
import CosmosGeneric from './cosmos-generic'
import HealthCheck from './health-check'
import AxelarSpecific from './axelar-specific'
import VotingPower from './voting-power'
import Uptime from './uptime'
import Heartbeat from './heartbeat'
import KeysTable from '../participations/keys-table'
import TransactionsTable from '../transactions/transactions-table'
import DelegationsTable from './delegations-table'
import Widget from '../widget'

import { getUptime, uptimeForJailedInfo, uptimeForJailedInfoSync, jailedInfo, getHeartbeat, getIneligibilities, keygens as getKeygens } from '../../lib/api/query'
import { status as getStatus } from '../../lib/api/rpc'
import { allValidators, validatorSets, slashingParams, allBankBalances, allDelegations, distributionRewards, distributionCommissions } from '../../lib/api/cosmos'
import { axelard, getKeygensByValidator } from '../../lib/api/executor'
import { signAttempts as getSignAttempts, successKeygens as getSuccessKeygens, failedKeygens as getFailedKeygens, heartbeats as getHeartbeats } from '../../lib/api/opensearch'
import { feeDenom, denomSymbol, denomAmount } from '../../lib/object/denom'
import { blocksPerHeartbeat, blockFraction, lastHeartbeatBlock, firstHeartbeatBlock } from '../../lib/object/hb'
import { getName, rand, convertToJson } from '../../lib/utils'

import { STATUS_DATA, VALIDATORS_DATA, JAILED_SYNC_DATA } from '../../reducers/types'

export default function Validator({ address }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, chain_data, status_data, validators_data, jailed_sync_data } = { ...data }

  const [validator, setValidator] = useState(null)
  const [uptime, setUptime] = useState(null)
  const [maxMissed, setMaxMissed] = useState(Number(process.env.NEXT_PUBLIC_DEFAULT_MAX_MISSED))
  const [jailed, setJailed] = useState(null)
  const [heartbeat, setHeartbeat] = useState(null)
  const [tab, setTab] = useState('key_share')
  const [keyShares, setKeyShares] = useState(null)
  const [keygens, setKeygens] = useState(null)
  const [signs, setSigns] = useState(null)
  const [delegations, setDelegations] = useState(null)
  const [health, setHealth] = useState(null)
  const [supportedChains, setSupportedChains] = useState(null)
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

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
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

    return () => {
      controller?.abort()
    }
  }, [address, status_data, denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      let response, validatorData

      const validator_data = validators_data?.[validators_data.findIndex(validator_data => validator_data.operator_address === address)]

      if (validator_data?.start_proxy_height || validator_data?.start_height/* || !['BOND_STATUS_BONDED'].includes(validator_data?.status)*/ || validator_data?.deregistering) {
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

        setValidator({ data: validatorData || {}, address })

        const _health = {
          broadcaster_registration: !(validatorData?.tss_illegibility_info?.no_proxy_registered) && validatorData?.broadcaster_address ? true : false,
        }

        _health.num_block_before_registered = validatorData && 'tss_illegibility_info' in validatorData && _health ? _health.broadcaster_registration ? typeof validatorData?.start_proxy_height === 'number' && typeof validatorData?.start_height === 'number' ? validatorData.start_proxy_height >= validatorData.start_height ? validatorData.start_proxy_height - validatorData.start_height : 0 : '-' : 'No Proxy' : null

        if (validatorData?.broadcaster_address) {
          response = await allBankBalances(validatorData.broadcaster_address)

          if (response?.data) {
            _health.broadcaster_funded = _.head(response.data.filter(balance => balance?.denom === feeDenom).map(balance => { return { amount: denomAmount(balance.amount, balance.denom, denoms_data), denom: denomSymbol(balance.denom, denoms_data) } }))
          }
        }
        else {
          _health.broadcaster_funded = 'No Proxy'
        }

        response = await getHeartbeats({
          aggs: {
            heartbeats: {
              terms: { field: 'sender.keyword' },
              aggs: {
                heightgroup: {
                  terms: { field: 'height_group', size: 1000 },
                },
              },
            },
          },
          query: {
            bool: {
              must: [
                { match: { sender: validatorData?.broadcaster_address } },
                { range: { height: { gte: validatorData?.start_proxy_height || validatorData?.start_height, lte: Number(status_data.latest_block_height) } } },
              ],
            },
          },
        })

        const _last = lastHeartbeatBlock(Number(status_data.latest_block_height))
        const _first = firstHeartbeatBlock(validatorData?.start_proxy_height || validatorData?.start_height)

        const totalHeartbeats = Math.floor((_last - _first) / Number(process.env.NEXT_PUBLIC_NUM_BLOCKS_PER_HEARTBEAT)) + 1
        _health.total_heartbeats = totalHeartbeats

        _health.missed_heartbeats = totalHeartbeats - response?.data?.[validatorData?.broadcaster_address]
        _health.missed_heartbeats = _health.missed_heartbeats < 0 ? 0 : _health.missed_heartbeats

        _health.heartbeats_uptime = totalHeartbeats > 0 ? response?.data?.[validatorData?.broadcaster_address] * 100 / totalHeartbeats : 0
        _health.heartbeats_uptime = _health.heartbeats_uptime > 100 ? 100 : _health.heartbeats_uptime

        setHealth({ data: _health, address })

        if (!controller.signal.aborted) {
          response = await getUptime(Number(status_data.latest_block_height), validatorData?.consensus_address)

          if (response) {
            setUptime({ data: response.data || [], address })
          }
        }

        if (!controller.signal.aborted) {
          const latestBlock = Number(status_data.latest_block_height)
          let beginBlock = latestBlock - Number(process.env.NEXT_PUBLIC_NUM_HEARTBEAT_BLOCKS)
          beginBlock = beginBlock > (validatorData?.start_proxy_height || 0) ? beginBlock : (validatorData?.start_proxy_height || 0)
          beginBlock = firstHeartbeatBlock(beginBlock)

          let heartbeats = []

          for (let height = latestBlock; height >= beginBlock; height--) {
            if (height % Number(process.env.NEXT_PUBLIC_NUM_BLOCKS_PER_HEARTBEAT) === 1 && heartbeats.length < Number(process.env.NEXT_PUBLIC_NUM_HEARTBEAT_BLOCKS) / Number(process.env.NEXT_PUBLIC_NUM_BLOCKS_PER_HEARTBEAT)) {
              heartbeats.push({ height })
            }
          }

          if (validatorData?.broadcaster_address) {
            response = await getHeartbeat(beginBlock, latestBlock, validatorData.broadcaster_address)

            if (response?.data) {
              heartbeats = heartbeats.map(_heartbeat => response.data.find(__heartbeat => (__heartbeat?.height - (__heartbeat?.height % blocksPerHeartbeat) + blockFraction) === (_heartbeat?.height - (_heartbeat?.height % blocksPerHeartbeat) + blockFraction)) || _heartbeat)
            }

            response = await getIneligibilities({ query: `{__name__=~"axelar_tss_heartbeat",address="${validatorData?.operator_address}"}` })

            const ineligibilities = response?.filter(metric => metric?.address && metric.address === validatorData?.operator_address)

            heartbeats = heartbeats.map(_heartbeat => {
              const _ineligibilities = ineligibilities?.find(_block => (_block?.height - (_block?.height % blocksPerHeartbeat) + blockFraction) === (_heartbeat?.height - (_heartbeat?.height % blocksPerHeartbeat) + blockFraction))

              return {
                ..._heartbeat,
                up: (_heartbeat?.sender && _heartbeat.sender === validatorData.broadcaster_address) || _ineligibilities,
                height: _ineligibilities?.height ? Number(_ineligibilities?.height) : _heartbeat.height,
                key_ids: _ineligibilities?.key_IDs?.split(',') || _heartbeat.key_ids,
                ineligibilities: {
                  ..._ineligibilities?.ineligibilities,
                },
              }
            })
          }

          setHeartbeat({ data: heartbeats, address })
        }
      }
    }

    if (address && denoms_data && status_data && validators_data) {
      getData()
    }

    return () => {
      controller?.abort()
    }
  }, [address, denoms_data, status_data, validators_data])

  useEffect(() => {
    const controller = new AbortController()

    const getDataSync = async (beginBlock, address, from, i) => {
      const _data = await uptimeForJailedInfoSync(beginBlock, address, from)

      dispatch({
        type: JAILED_SYNC_DATA,
        value: _data,
        i,
      })
    }

    const getData = async () => {
      if (address && validator?.address === address) {
        if (!controller.signal.aborted) {
          const validatorData = validator?.data

          let jailedData, response

          if (validatorData?.jailed_until > 0) {
            response = await slashingParams()

            const _maxMissed = response?.params ? Number(response.params.signed_blocks_window) - (Number(response.params.min_signed_per_window) * Number(response.params.signed_blocks_window)) : Number(process.env.NEXT_PUBLIC_DEFAULT_MAX_MISSED)
            setMaxMissed(_maxMissed)

            const beginBlock = Number(status_data.latest_block_height) - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) > validatorData?.start_height ? Number(status_data.latest_block_height) - Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) : validatorData?.start_height

            const numBlock = Number(status_data.latest_block_height) - beginBlock

            if (!(validatorData?.uptime)) {
              jailedData = {
                times_jailed: -1,
                avg_jail_response_time: -1,
              }
            }
            else if (numBlock * (1 - (validatorData?.uptime / 100)) > _maxMissed) {
              const chunkSize = _.head([...Array(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS)).keys()].map(i => i + 1).filter(i => Math.ceil(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS) / i) <= Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS_CHUNK))) || Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS)
              _.chunk([...Array(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS)).keys()], chunkSize).forEach((chunk, i) => getDataSync(beginBlock, validatorData?.consensus_address, i * chunkSize, i))
            }
            else {
              jailedData = {
                times_jailed: 0,
                avg_jail_response_time: 0,
              }
            }
          }
          else {
            jailedData = {
              times_jailed: 0,
              avg_jail_response_time: 0,
            }
          }

          if (jailedData) {
            setJailed({ data: jailedData, address })
          }
        }
      }
    }

    getData()

    return () => {
      controller?.abort()
      dispatch({
        type: JAILED_SYNC_DATA,
        value: null,
      })
    }
  }, [address, validator])

  useEffect(() => {
    if (jailed_sync_data && Object.keys(jailed_sync_data).length >= Number(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS_CHUNK)) {

      const uptimeData = jailedInfo(Object.values(jailed_sync_data).flatMap(_uptime => _uptime), status_data && (moment(status_data.latest_block_time).diff(moment(status_data.earliest_block_time), 'milliseconds') / Number(status_data.latest_block_height)))?.data

      let jailedData

      if (uptimeData) {
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

      dispatch({
        type: JAILED_SYNC_DATA,
        value: null,
      })

      setJailed({ data: jailedData || {}, address })
    }
  }, [jailed_sync_data])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (address && denoms_data && validator?.address === address) {
        if (!controller.signal.aborted) {
          let response, _delegations

          if (!controller.signal.aborted) {
            response = await allDelegations(address)

            if (response) {
              _delegations = _.orderBy(response.data?.map(delegation => {
                return {
                  ...delegation.delegation,
                  self: delegation.delegation.delegator_address === validator.data?.delegator_address,
                  shares: delegation.delegation && denomAmount(delegation.delegation.shares, delegation.balance?.denom, denoms_data),
                  ...delegation.balance,
                  denom: denomSymbol(delegation.balance?.denom, denoms_data),
                  amount: delegation.balance && denomAmount(delegation.balance.amount, delegation.balance.denom, denoms_data),
                }
              }) || [], ['self', 'shares'], ['desc', 'desc'])

              setDelegations({ data: _delegations, address })
            }
          }

          /*if (!controller.signal.aborted) {
            let _rewards = []

            response = await distributionRewards(validator.data?.delegator_address)

            if (response && !response.error) {
              _rewards.push({
                ...response,
                name: 'Distribution Rewards',
                rewards: response.rewards && Object.entries(_.groupBy(response.rewards.flatMap(reward => reward.reward).map(reward => { return { ...reward, denom: denomSymbol(reward.denom, denoms_data), amount: reward.amount && (isNaN(reward.amount) ? -1 : denomAmount(reward.amount, reward.denom, denoms_data)) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
                total: response.total && Object.entries(_.groupBy(response.total.map(total => { return { ...total, denom: denomSymbol(total.denom, denoms_data), amount: total.amount && denomAmount(total.amount, total.denom, denoms_data) } }), 'denom')).map(([key, value]) => { return { denom: key, amount: _.sumBy(value, 'amount') } }),
              })
            }

            response = await distributionCommissions(validator.data?.operator_address)

            if (response && !response.error) {
              _rewards.push({
                ...response,
                name: 'Distribution Commissions',
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
          }*/
        }
      }
    }

    getData()

    return () => {
      controller?.abort()
    }
  }, [address, validator, denoms_data])

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

        let _data = Array.isArray(response?.data) ? response.data : []

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

        _data = Array.isArray(response?.data) ? response.data : []

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

        let _data = Array.isArray(response?.data) ? response.data : []

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

        _data = Array.isArray(response?.data) ? response.data : []

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

    return () => {
      controller?.abort()
    }
  }, [address])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (address) {
        const chains = ['axelarnet', 'bitcoin', 'ethereum', 'terra', 'avalanche', 'fantom', 'polygon']

        const _supportedChains = []

        for (let i = 0; i < chains.length; i++) {
          if (!controller.signal.aborted) {
            const chain = chains[i]

            const response = await axelard({ cmd: `axelard q nexus chain-maintainers ${chain} -oj` })

            if (convertToJson(response?.data?.stdout)?.maintainers?.includes(address)) {
              _supportedChains.push(chain)
            }
          }
        }

        setSupportedChains({ data: _supportedChains, address })
      }
    }

    if (address) {
      getData()
    }

    return () => {
      controller?.abort()
    }
  }, [address])

  return (
    <>
      <div className="my-4">
        <Information
          data={validator?.address === address && validator?.data}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <VotingPower data={validator?.address === address && validator?.data} />
        <Widget
          title={<span className="text-lg font-medium">Delegations</span>}
        >
          <div className="mt-2">
            <DelegationsTable data={delegations?.address === address && delegations?.data} />
          </div>
        </Widget>
      </div>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 my-4">
        <div className="space-y-4">
          <CosmosGeneric
            data={validator?.address === address && validator?.data}
            jailed={jailed?.address === address && jailed?.data}
          />
          <Uptime data={uptime?.address === address && uptime?.data} validator_data={validator?.address === address && validator?.data} />
        </div>
        <div className="space-y-4">
          <HealthCheck
            data={validator?.address === address && validator?.data}
            health={health?.address === address && health?.data}
          />
          <Heartbeat data={heartbeat?.address === address && heartbeat?.data} validator_data={validator?.address === address && validator?.data} />
        </div>
        <div className="space-y-4">
          <AxelarSpecific
            data={validator?.address === address && validator?.data}
            keygens={keygens?.address === address && keygens?.data}
            signs={signs?.address === address && signs?.data}
            supportedChains={supportedChains?.address === address && supportedChains?.data}
            rewards={rewards?.address === address && rewards?.data}
          />
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
        </div>
      </div>
    </>
  )
}