import Link from 'next/link'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import Loader from 'react-loader-spinner'

import ChainSelect from './chainSelect'
import TimelyTransactions from './charts/timely-transactions'
import TimelyVolume from './charts/timely-volume'
import TimelyHighestTransfer from './charts/timely-highest-transfer'
import Widget from '../widget'
import Copy from '../copy'
import { ProgressBarWithText } from '../progress-bars'

import { numberFormat, ellipseAddress, randImage } from '../../lib/utils'

const timeRanges = ['all-time', '30d', '7d', '24h']

const Summary = ({ data, crosschainData, tvlData, avgTransfersTimeRange, setAvgTransfersTimeRange, chainSelect, setChainSelect, chartData }) => {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const [timeFocus, setTimeFocus] = useState(moment().utc().startOf('day').valueOf())

  return (
    <>
      <div className="w-full">
        <Widget title="Consensus State">
          <div className="flex flex-wrap items-start mt-3">
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Height</span>
              {data ?
                data.latest_block ?
                  <Link href={`/block/${data.latest_block.height}`}>
                    <a className="text-blue-600 dark:text-blue-500 text-lg">
                      {numberFormat(data.latest_block.height, '0,0')}
                    </a>
                  </Link>
                  :
                  null
                :
                <div className="skeleton w-16 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Round</span>
              {data ?
                data.latest_block ?
                  <span className="text-lg">
                    {data.latest_block.round || 0}
                  </span>
                  :
                  null
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Step</span>
              {data ?
                data.latest_block ?
                  <span className="text-lg">
                    {data.latest_block.step || 1}
                  </span>
                  :
                  null
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 mt-6 mb-3 sm:my-0 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Proposer</span>
              {data?.latest_block?.operator_address ?
                <div className={`min-w-max flex items-${data.latest_block.proposer_name ? 'start' : 'center'}  space-x-2 pt-0.5`}>
                  <Link href={`/validator/${data.latest_block.operator_address}`}>
                    <a>
                      {data.latest_block.proposer_image ?
                        <img
                          src={data.latest_block.proposer_image}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        :
                        <div className="skeleton w-6 h-6 rounded-full" />
                      }
                    </a>
                  </Link>
                  <div className="flex flex-col">
                    {data.latest_block.proposer_name && (
                      <Link href={`/validator/${data.latest_block.operator_address}`}>
                        <a className="text-blue-600 dark:text-blue-500 font-medium">
                          {data.latest_block.proposer_name || data.latest_block.operator_address}
                        </a>
                      </Link>
                    )}
                    <span className="flex items-center space-x-1">
                      <Link href={`/validator/${data.latest_block.operator_address}`}>
                        <a className="text-gray-500 font-light">
                          {ellipseAddress(data.latest_block.operator_address, 16)}
                        </a>
                      </Link>
                      <Copy text={data.latest_block.operator_address} />
                    </span>
                  </div>
                </div>
                :
                data && !data.latest_block ?
                  <span className="w-24 text-lg">-</span>
                  :
                  <div className="flex items-start space-x-2">
                    <div className="skeleton w-6 h-6 rounded-full" />
                    <div className="flex flex-col space-y-1.5">
                      <div className="skeleton w-28 h-4" />
                      <div className="skeleton w-48 h-3" />
                    </div>
                  </div>
              }
            </div>
            <div className="flex flex-col space-y-1 my-3 sm:my-0 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Voting Power</span>
              {data ?
                <div className="w-64 flex flex-col">
                  <span className="text-base font-medium">
                    {numberFormat(data.latest_block.voting_power, '0,0')}
                  </span>
                  {typeof data.latest_block.voting_power_percentage === 'number' && (
                    <ProgressBarWithText
                      width={data.latest_block.voting_power_percentage}
                      text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
                        {numberFormat(data.latest_block.voting_power_percentage, '0,0.00')}%
                      </div>}
                      color="bg-green-500 dark:bg-green-700 rounded"
                      backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
                      className={`h-4 flex items-center justify-${data.latest_block.voting_power_percentage < 20 ? 'start' : 'end'}`}
                    />
                  )}
                </div>
                :
                <div className="flex flex-col space-y-1.5">
                  <div className="skeleton w-24 h-4" />
                  <div className="skeleton w-48 h-3 rounded" />
                </div>
              }
            </div>
          </div>
        </Widget>
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <Widget
          title="Latest Block Height"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1 mt-1">
            {data ?
              <span className="h-8 text-3xl font-semibold">{typeof data.block_height === 'number' && numberFormat(data.block_height, '0,0')}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="text-gray-400 dark:text-gray-600 text-sm font-normal">
              {data ?
                data.block_height_at ?
                  moment(data.block_height_at).format('MMM D, YYYY h:mm:ss A z')
                  :
                  null
                :
                <div className="skeleton w-32 h-3.5 mt-1" />
              }
            </span>
          </span>
        </Widget>
        <Widget
          title="Average Block Time"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col item space-y-1 mt-1">
            {data ?
              <span className="h-8 text-3xl font-semibold">{typeof data.avg_block_time === 'number' && numberFormat(data.avg_block_time, '0.00')}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="text-gray-400 dark:text-gray-600 text-sm font-normal">seconds</span>
          </span>
        </Widget>
        <Widget
          title="Active Validators"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1 mt-1">
            {typeof data?.active_validators === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(data.active_validators, '0,0')}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              <span>out of</span>
              {typeof data?.total_validators === 'number' ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{numberFormat(data.total_validators, '0,0')}</span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>validators</span>
            </span>
          </span>
        </Widget>
        <Widget
          title="Online Voting Power"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1 mt-1">
            {data?.online_voting_power_now ?
              <span className="h-8 text-3xl font-semibold">{data.online_voting_power_now}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              {typeof data?.online_voting_power_now_percentage === 'number' ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{numberFormat(data.online_voting_power_now_percentage, '0,0.00')}%</span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>from</span>
              {data?.total_voting_power ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{data.total_voting_power}</span>
                :
                <div className="skeleton w-8 h-3.5" />
              }
              <span className="uppercase text-gray-500">{data && ellipseAddress(data.denom)}</span>
            </span>
          </span>
        </Widget>
      </div>
      <div className="flex items-center text-gray-900 dark:text-gray-100 text-base font-semibold mt-8 sm:mx-3">
        Cross-chain transfer
        <span className="bg-gray-200 rounded-3xl capitalize text-2xs ml-2 px-1.5 py-1">
          Beta
        </span>
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 sm:gap-4 mt-1.5 mb-4">
        <Widget
          title="Number of Transactions"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1.5 mt-1">
            {crosschainData ?
              <div className="max-h-36 sm:max-h-60 flex flex-col overflow-y-auto space-y-2.5 mt-1">
                {crosschainData.total_transfers?.map((coinTransfer, i) => (
                  <div key={i} className="flex items-start">
                    <div>
                      <img
                        src={coinTransfer.image || randImage(i)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <div className="text-xs font-semibold mt-0.5">
                        {coinTransfer.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-auto">
                      <span className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">{numberFormat(coinTransfer.tx, coinTransfer.tx >= 1000000 ? '0,0.00a' : '0,0')}</span>
                      <span className="text-gray-400 dark:text-gray-600 text-xs">Txs</span>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3 mt-2">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className="flex items-start">
                    <div>
                      <div className="skeleton w-5 h-5 rounded-full" />
                      <div className="skeleton w-12 h-3 mt-1.5" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5 ml-auto">
              <span>total</span>
              {crosschainData ?
                <span className="font-mono text-gray-600 dark:text-gray-400 font-medium">{numberFormat(_.sumBy(crosschainData.total_transfers, 'tx'), '0,0')}</span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>Txs</span>
            </span>
          </span>
        </Widget>
        <Widget
          title="Transfer Volume"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1.5 mt-1">
            {crosschainData ?
              <div className="max-h-36 sm:max-h-60 flex flex-col overflow-y-auto space-y-2.5 mt-1">
                {crosschainData.total_transfers?.map((coinTransfer, i) => (
                  <div key={i} className="flex items-start">
                    <div>
                      <img
                        src={coinTransfer.image || randImage(i)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <div className="text-xs font-semibold mt-0.5">
                        {coinTransfer.name}
                      </div>
                    </div>
                    <div className="text-right ml-auto">
                      <div className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">{numberFormat(coinTransfer.amount, coinTransfer.amount >= 1000000 ? '0,0.00a' : '0,0.00000000')}</div>
                      <div className="uppercase text-gray-400 dark:text-gray-600 text-xs -mt-0.5">{coinTransfer.denom}</div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3 mt-2">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className="flex items-start">
                    <div>
                      <div className="skeleton w-5 h-5 rounded-full" />
                      <div className="skeleton w-12 h-3 mt-1.5" />
                    </div>
                    <div className="ml-auto">
                      <div className="skeleton w-16 h-5 ml-auto" />
                      <div className="skeleton w-8 h-3 mt-1.5 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5">
              <span>since</span>
              {crosschainData ?
                <span className="font-medium">{moment(_.minBy(crosschainData.total_transfers, 'since')?.since).format('MMM D, YYYY')}</span>
                :
                <div className="skeleton w-20 h-3.5" />
              }
            </span>
          </span>
        </Widget>
        <Widget
          title="Total Value Locked"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1.5 mt-1">
            {tvlData ?
              <div className="max-h-36 sm:max-h-60 flex flex-col overflow-y-auto space-y-2.5 mt-1">
                {tvlData.tvls?.map((coinTransfer, i) => (
                  <div key={i} className="flex items-start">
                    <div>
                      <img
                        src={coinTransfer.image || randImage(i)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <div className="text-xs font-semibold mt-0.5">
                        {coinTransfer.name}
                      </div>
                    </div>
                    <div className="text-right ml-auto">
                      <div className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">{numberFormat(coinTransfer.amount, coinTransfer.amount >= 1000000 ? '0,0.00a' : '0,0.00000000')}</div>
                      <div className="uppercase text-gray-400 dark:text-gray-600 text-xs -mt-0.5">{coinTransfer.denom}</div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3 mt-2">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className="flex items-start">
                    <div>
                      <div className="skeleton w-5 h-5 rounded-full" />
                      <div className="skeleton w-12 h-3 mt-1.5" />
                    </div>
                    <div className="ml-auto">
                      <div className="skeleton w-16 h-5 ml-auto" />
                      <div className="skeleton w-8 h-3 mt-1.5 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            }
            <div className="flex items-center">
              {tvlData ?
                tvlData.tvls_updated_at ?
                  <span className="text-gray-400 dark:text-gray-600 text-xs font-medium pt-0.5">
                    {moment(tvlData.tvls_updated_at).format('MMM D YYYY, h:mm A z')}
                  </span>
                  :
                  null
                :
                <div className="skeleton w-20 h-3.5" />
              }
            </div>
          </span>
        </Widget>
        <Widget
          title="Average size of Transfers"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1.5 mt-1">
            {crosschainData ?
              <div className="max-h-36 sm:max-h-60 flex flex-col overflow-y-auto space-y-2.5 mt-1">
                {crosschainData.avg_transfers?.map((coinTransfer, i) => (
                  <div key={i} className="flex items-start">
                    <div>
                      <img
                        src={coinTransfer.image || randImage(i)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <div className="text-xs font-semibold mt-0.5">
                        {coinTransfer.name}
                      </div>
                    </div>
                    <div className="text-right ml-auto">
                      <div className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">{numberFormat(coinTransfer.amount, coinTransfer.amount >= 1000000 ? '0,0.00a' : '0,0.00000000')}</div>
                      <div className="uppercase text-gray-400 dark:text-gray-600 text-xs -mt-0.5">{coinTransfer.denom}</div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3 mt-2">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className="flex items-start">
                    <div>
                      <div className="skeleton w-5 h-5 rounded-full" />
                      <div className="skeleton w-12 h-3 mt-1.5" />
                    </div>
                    <div className="ml-auto">
                      <div className="skeleton w-16 h-5 ml-auto" />
                      <div className="skeleton w-8 h-3 mt-1.5 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            }
            <span className="text-gray-400 dark:text-gray-600 text-sm font-normal mx-auto">
              {crosschainData ?
                <div className="flex items-center space-x-0.5 -mt-1">
                  {timeRanges.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => setAvgTransfersTimeRange(item)}
                      className={`bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer flex items-center uppercase text-xs p-1 ${avgTransfersTimeRange === item ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200 font-bold' : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 font-medium'}`}
                    >
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                :
                <div className="skeleton w-32 h-4 mt-1" />
              }
            </span>
          </span>
        </Widget>
        <Widget
          title={<div className="flex items-center space-x-1.5">
            <span>Highest Transfer</span>
            <span className="bg-gray-100 dark:bg-gray-800 rounded-lg uppercase text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-0.5">
              24h
            </span>
          </div>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col space-y-1.5 mt-1">
            {crosschainData ?
              <div className="max-h-36 sm:max-h-60 flex flex-col overflow-y-auto space-y-2.5 mt-1">
                {crosschainData.highest_transfer_24h?.map((coinTransfer, i) => (
                  <div key={i} className="flex items-start">
                    <div>
                      <img
                        src={coinTransfer.image || randImage(i)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                      <div className="text-xs font-semibold mt-0.5">
                        {coinTransfer.name}
                      </div>
                    </div>
                    <div className="text-right ml-auto">
                      <div className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">{numberFormat(coinTransfer.amount, coinTransfer.amount >= 1000000 ? '0,0.00a' : '0,0.00000000')}</div>
                      <div className="uppercase text-gray-400 dark:text-gray-600 text-xs -mt-0.5">{coinTransfer.denom}</div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3 mt-2">
                {[...Array(3).keys()].map(i => (
                  <div key={i} className="flex items-start">
                    <div>
                      <div className="skeleton w-5 h-5 rounded-full" />
                      <div className="skeleton w-12 h-3 mt-1.5" />
                    </div>
                    <div className="ml-auto">
                      <div className="skeleton w-16 h-5 ml-auto" />
                      <div className="skeleton w-8 h-3 mt-1.5 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5 ml-auto">
              <span>from</span>
              {crosschainData ?
                <span className="font-mono text-gray-600 dark:text-gray-400 font-medium">{numberFormat(_.sumBy(crosschainData.highest_transfer_24h, 'tx'), '0,0')}</span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>Txs</span>
            </span>
          </span>
        </Widget>
      </div>
      <div className="text-gray-900 dark:text-gray-100 text-base font-semibold mt-8 sm:mt-4 sm:mx-2">
        {chainSelect && chartData ?
          <div className="flex justify-start">
            <ChainSelect
              chains={crosschainData?.total_transfers}
              chainSelect={chainSelect}
              setChainSelect={chain => setChainSelect(chain)}
            />
          </div>
          :
          <div className="skeleton w-20 h-6 mb-0.5" />
        }
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 mb-4">
        <Widget
          title="Transactions"
          right={[chainSelect && chartData?.total_transfers?.find(transfer => transfer?.chain === chainSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
            <div key={i} className="min-w-max text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="font-mono text-base font-semibold">
                  {typeof _time.tx === 'number' ? numberFormat(_time.tx, '0,0') : '- '}
                </span>
                <span className="text-gray-400 dark:text-gray-600 text-xs">Txs</span>
              </div>
              <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
            </div>
          ))}
          contentClassName="items-start"
          className="pb-0 px-2 sm:px-4"
        >
          <div>
            <TimelyTransactions txsData={chartData && (chartData.total_transfers.find(transfer => transfer?.chain === chainSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
          </div>
        </Widget>
        <Widget
          title="Volume"
          right={[chainSelect && chartData?.total_transfers?.find(transfer => transfer?.chain === chainSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
            <div key={i} className="min-w-max text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="font-mono text-base font-semibold">
                  {typeof _time.amount === 'number' ? numberFormat(_time.amount, '0,0.00000000') : '- '}
                </span>
                <span className="uppercase text-gray-400 dark:text-gray-600 text-xs">{chartData.total_transfers.find(transfer => transfer?.chain === chainSelect)?.denom}</span>
              </div>
              <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
            </div>
          ))}
          contentClassName="items-start"
          className="pb-0 px-2 sm:px-4"
        >
          <div>
            <TimelyVolume volumeData={chartData && (chartData.total_transfers.find(transfer => transfer?.chain === chainSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
          </div>
        </Widget>
        <Widget
          title="Highest Transfer"
          right={[chainSelect && chartData?.highest_transfer_24h?.find(transfer => transfer?.chain === chainSelect)?.times?.find(_time => _time.time === timeFocus)].filter(_time => _time).map((_time, i) => (
            <div key={i} className="min-w-max text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="font-mono text-base font-semibold">
                  {typeof _time.amount === 'number' ? numberFormat(_time.amount, '0,0.00000000') : '- '}
                </span>
                <span className="uppercase text-gray-400 dark:text-gray-600 text-xs">{chartData.highest_transfer_24h.find(transfer => transfer?.chain === chainSelect)?.denom}</span>
              </div>
              <div className="text-gray-400 dark:text-gray-500 font-medium" style={{ fontSize: '.65rem' }}>{moment(_time.time).utc().format('MMM, D YYYY [(UTC)]')}</div>
            </div>
          ))}
          contentClassName="items-start"
          className="pb-0 px-2 sm:px-4"
        >
          <div>
            <TimelyHighestTransfer highestTransferData={chartData && (chartData.highest_transfer_24h.find(transfer => transfer?.chain === chainSelect) || {})} setTimeFocus={_timeFocus => setTimeFocus(_timeFocus)} />
          </div>
        </Widget>
      </div>
    </>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
}

export default Summary