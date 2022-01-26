import Link from 'next/link'

import _ from 'lodash'
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { BiNetworkChart, BiCode } from 'react-icons/bi'
import { TiArrowRight } from 'react-icons/ti'

import Widget from '../widget'
import Copy from '../copy'
import Popover from '../popover'

import { chainTitle } from '../../lib/object/chain'
import { currency_symbol } from '../../lib/object/currency'
import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Summary({ data, crosschainData, tvlData }) {
  return (
    <>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2 sm:mt-4">
        <Widget
          title={<div className="flex items-center justify-between space-x-1.5">
            <span>Consensus State</span>
            {data?.latest_block?.height && (
              <span className="font-mono text-gray-400 dark:text-gray-600">{numberFormat(data.latest_block.height, '0,0')}</span>
            )}
          </div>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-1 mt-1">
            {data ?
              <span className="h-8">
                {data?.latest_block?.operator_address ?
                  <div className={`flex items-${data.latest_block.proposer_name ? /*'start'*/'center' : 'center'} space-x-2.5`}>
                    <Link href={`/validator/${data.latest_block.operator_address}`}>
                      <a>
                        {data.latest_block.proposer_image ?
                          <img
                            src={data.latest_block.proposer_image}
                            alt=""
                            className="w-8 h-8 rounded-full"
                            style={{ minWidth: '2rem' }}
                          />
                          :
                          <div className="skeleton w-8 h-8 rounded-full" />
                        }
                      </a>
                    </Link>
                    <div className="flex flex-col">
                      {data.latest_block.proposer_name && (
                        <Link href={`/validator/${data.latest_block.operator_address}`}>
                          <a className="leading-4 text-base text-blue-600 dark:text-white font-semibold">
                            {data.latest_block.proposer_name || ellipseAddress(data.latest_block.operator_address, 8)}
                          </a>
                        </Link>
                      )}
                      {/*<span className="flex items-center space-x-1">
                        <Link href={`/validator/${data.latest_block.operator_address}`}>
                          <a className="text-3xs text-gray-600 dark:text-gray-200 font-normal">
                            {ellipseAddress(data.latest_block.operator_address, 16)}
                          </a>
                        </Link>
                        <Copy size={14} text={data.latest_block.operator_address} />
                      </span>*/}
                    </div>
                  </div>
                  :
                  data && !data.latest_block ?
                    <span className="text-3xl">-</span>
                    :
                    <div className="flex items-center space-x-2.5">
                      <div className="skeleton w-8 h-8 rounded-full" />
                      <div className="flex flex-col space-y-1">
                        <div className="skeleton w-24 h-6" />
                        {/*<div className="skeleton w-32 h-3.5" />*/}
                      </div>
                    </div>
                }
              </span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center justify-between text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              <span>Proposer</span>
              <div className="flex items-center space-x-1.5">
                <span>VP:</span>
                {data?.latest_block?.voting_power ?
                  <span className="font-mono text-gray-600 dark:text-gray-200 font-semibold">
                    {numberFormat(data.latest_block.voting_power, '0,0')}
                  </span>
                  :
                  <div className="skeleton w-6 h-3.5" />
                }
              </div>
            </span>
          </div>
        </Widget>
        <Widget
          title="Latest Block Height"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-1 mt-1">
            {data ?
              <span className="h-8 font-mono text-3xl font-semibold">
                {typeof data.block_height === 'number' && numberFormat(data.block_height, '0,0')}
              </span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="text-gray-400 dark:text-gray-600 text-sm font-normal">
              {data ?
                data.block_height_at && moment(data.block_height_at).format('MMM D, YYYY h:mm:ss A z')
                :
                <div className="skeleton w-32 h-3.5 mt-0.5" />
              }
            </span>
          </div>
        </Widget>
        <Widget
          title="Average Block Time"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col item space-y-1 mt-1">
            {data ?
              <span className="h-8 font-mono text-3xl font-semibold">
                {typeof data.avg_block_time === 'number' && numberFormat(data.avg_block_time, '0.00')}
              </span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="text-gray-400 dark:text-gray-600 text-sm font-normal">seconds</span>
          </div>
        </Widget>
        <Widget
          title="Active Validators"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-1 mt-1">
            {typeof data?.active_validators === 'number' ?
              <span className="h-8 font-mono text-3xl font-semibold">
                {numberFormat(data.active_validators, '0,0')}
              </span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              <span>out of</span>
              {typeof data?.total_validators === 'number' ?
                <span className="text-gray-600 dark:text-gray-200 font-medium">
                  {numberFormat(data.total_validators, '0,0')}
                </span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>validators</span>
            </span>
          </div>
        </Widget>
        <Widget
          title="Online Voting Power"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-1 mt-1">
            {data?.online_voting_power_now ?
              <span className="h-8 font-mono text-3xl font-semibold">
                {data.online_voting_power_now}
              </span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              {typeof data?.online_voting_power_now_percentage === 'number' ?
                <span className="text-gray-600 dark:text-gray-200 font-medium">
                  {numberFormat(data.online_voting_power_now_percentage, '0,0.000000')}%
                </span>
                :
                <div className="skeleton w-6 h-3.5" />
              }
              <span>from</span>
              {data?.total_voting_power ?
                <span className="text-gray-600 dark:text-gray-200 font-medium">
                  {data.total_voting_power}
                </span>
                :
                <div className="skeleton w-8 h-3.5" />
              }
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {data && ellipseAddress(data.denom)}
              </span>
            </span>
          </div>
        </Widget>
      </div>
      <div className="flex items-center text-base mt-8 sm:mx-3">
        <span className="font-mono text-gray-400 dark:text-gray-600">Cross-chain Transfers</span>
        <Link href="/crosschain">
          <a className="flex items-center text-blue-600 dark:text-white text-sm font-normal space-x-1 ml-auto">
            <span>Explore More</span>
            <BiNetworkChart size={20} />
          </a>
        </Link>
      </div>
      <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-2 mb-4">
        <Widget
          title={<span className="text-black dark:text-white text-base font-semibold">Transactions</span>}
          description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Number of cross-chain transactions</span>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-2 mt-1">
            {crosschainData ?
              <div className="max-h-48 sm:max-h-52 flex flex-col overflow-y-auto space-y-3">
                {crosschainData.total_transfers?.map((t, i) => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={t.from_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <img
                          src={t.asset?.image}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                      <img
                        src={t.to_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-mono text-gray-800 dark:text-gray-100 text-base font-semibold">
                        {numberFormat(t.tx, t.tx >= 100000 ? '0,0.00a' : '0,0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <div className="skeleton w-7 h-7 rounded-full" />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <div className="skeleton w-4 h-4 rounded-full" />
                      </div>
                      <div className="skeleton w-7 h-7 rounded-full" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5 ml-auto">
              <span>total</span>
              {crosschainData ?
                <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{numberFormat(_.sumBy(crosschainData.total_transfers, 'tx'), '0,0')}</span>
                :
                <div className="skeleton w-6 h-4" />
              }
              <span>transactions</span>
            </span>
          </div>
        </Widget>
        <Widget
          title={<span className="text-black dark:text-white text-base font-semibold">Volume</span>}
          description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Transfer volume across chain</span>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-2 mt-1">
            {crosschainData ?
              <div className="max-h-48 sm:max-h-52 flex flex-col overflow-y-auto space-y-3">
                {_.orderBy(crosschainData.total_transfers || [], ['value', 'amount', 'tx'], ['desc', 'desc', 'desc']).map((t, i) => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={t.from_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <img
                          src={t.asset?.image}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                      <img
                        src={t.to_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                    </div>
                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="text-2xs space-x-1">
                        <span className="font-mono font-semibold">{numberFormat(t.amount, t.amount >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                        <span className="text-gray-400 dark:text-gray-600">{t.asset?.symbol}</span>
                      </span>
                      {t.value > 0 && (
                        <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                          {currency_symbol}{numberFormat(t.value, '0,0.00')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <div className="skeleton w-7 h-7 rounded-full" />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <div className="skeleton w-4 h-4 rounded-full" />
                      </div>
                      <div className="skeleton w-7 h-7 rounded-full" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5">
              <span>since</span>
              {crosschainData ?
                <span className="text-gray-700 dark:text-gray-300 font-medium">{moment(_.minBy(crosschainData.total_transfers, 'since')?.since).format('MMM D, YYYY')}</span>
                :
                <div className="skeleton w-20 h-4" />
              }
            </span>
          </div>
        </Widget>
        <Widget
          title={<span className="text-black dark:text-white text-base font-semibold">TVL</span>}
          description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Total Value Locked on Axelar Network</span>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-2 mt-1">
            {tvlData ?
              <div className="max-h-48 sm:max-h-52 flex flex-col overflow-y-auto space-y-3">
                {_.orderBy(Object.entries(_.groupBy(tvlData.data || [], 'asset.id')).map(([key, value]) => {
                  return {
                    asset: _.head(value)?.asset,
                    denom: _.head(value)?.denom,
                    amount: _.sumBy(value, 'amount'),
                    value: _.sumBy(value, 'value'),
                    contracts: value.map(v => {
                      return {
                        chain: v.chain,
                        contract: v.asset?.contracts?.find(c => c.chain_id === v.chain?.chain_id),
                        denom: v.denom,
                        amount: v.amount,
                        value: v.value,
                      }
                    })
                  }
                }), ['value', 'amount'], ['desc', 'desc']).map((t, i) => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={t.asset?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex flex-col space-y-1.5">
                        <span className="text-2xs font-semibold">
                          {t.denom?.title}
                        </span>
                        <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                          {t.denom?.symbol}
                        </span>
                      </div>
                    </div>
                    <Popover
                      placement="top"
                      title={<span className="normal-case">Supply on EVMs</span>}
                      content={<div className="w-60 space-y-2">
                        {_.orderBy(t.contracts || [], ['amount'], ['desc']).map((c, j) => (
                          <div key={j} className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col">
                              <span className="font-semibold">{chainTitle(c.chain)}</span>
                              <div className="flex items-center space-x-1">
                                {c.contract?.contract_address ?
                                  <>
                                    <Copy
                                      text={c.contract.contract_address}
                                      copyTitle={<span className="text-xs font-normal">
                                        {ellipseAddress(c.contract.contract_address, 6)}
                                      </span>}
                                    />
                                    {c.chain?.explorer?.url && (
                                      <a
                                        href={`${c.chain.explorer.url}${c.chain.explorer.contract_path?.replace('{address}', c.contract.contract_address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-white"
                                      >
                                        {c.chain.explorer.icon ?
                                          <img
                                            src={c.chain.explorer.icon}
                                            alt=""
                                            className="w-3.5 h-3.5 rounded-full opacity-60 hover:opacity-100"
                                          />
                                          :
                                          <TiArrowRight size={16} className="transform -rotate-45" />
                                        }
                                      </a>
                                    )}
                                  </>
                                  :
                                  '-'
                                }
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1.5">
                              <span className="text-2xs space-x-1">
                                <span className="font-mono font-semibold">{numberFormat(c.amount, c.amount >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                                <span className="text-gray-400 dark:text-gray-600">{c.denom?.symbol}</span>
                              </span>
                              {c.value > 0 && (
                                <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                                  {currency_symbol}{numberFormat(c.value, '0,0.00')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>}
                    >
                      <div className="flex flex-col items-end space-y-1.5">
                        <span className="text-2xs space-x-1">
                          <span className="font-mono font-semibold">{numberFormat(t.amount, t.amount >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                          <span className="text-gray-400 dark:text-gray-600">{t.asset?.symbol}</span>
                        </span>
                        {t.value > 0 && (
                          <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                            {currency_symbol}{numberFormat(t.value, '0,0.00')}
                          </span>
                        )}
                      </div>
                    </Popover>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <div className="skeleton w-7 h-7 rounded-full" />
                      <div className="skeleton w-16 h-5" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center justify-between text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5">
              <span>last updated on</span>
              {tvlData ?
                <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{moment(tvlData.updated_at).format('MMM D, h:mm:ss A')}</span>
                :
                <div className="skeleton w-20 h-4" />
              }
            </span>
          </div>
        </Widget>
        <Widget
          title={<span className="text-black dark:text-white text-base font-semibold">Size</span>}
          description={<span className="text-gray-400 dark:text-gray-500 text-xs font-normal">Average size of cross-chain transfers</span>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-2 mt-1">
            {crosschainData ?
              <div className="max-h-48 sm:max-h-52 flex flex-col overflow-y-auto space-y-3">
                {_.orderBy(crosschainData.total_transfers || [], ['avg_value', 'avg_amount', 'tx'], ['desc', 'desc', 'desc']).map((t, i) => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={t.from_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <img
                          src={t.asset?.image}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                      <img
                        src={t.to_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                    </div>
                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="text-2xs space-x-1">
                        <span className="font-mono font-semibold">{numberFormat(t.avg_amount, t.avg_amount >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                        <span className="text-gray-400 dark:text-gray-600">{t.asset?.symbol}</span>
                      </span>
                      {t.avg_value > 0 && (
                        <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                          {currency_symbol}{numberFormat(t.avg_value, '0,0.00')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <div className="skeleton w-7 h-7 rounded-full" />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <div className="skeleton w-4 h-4 rounded-full" />
                      </div>
                      <div className="skeleton w-7 h-7 rounded-full" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5 ml-auto">
              <span>from</span>
              {crosschainData ?
                <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{numberFormat(_.sumBy(crosschainData.total_transfers, 'tx'), '0,0')}</span>
                :
                <div className="skeleton w-6 h-4" />
              }
              <span>transactions</span>
            </span>
          </div>
        </Widget>
        <Widget
          title={<span className="text-black dark:text-white text-base font-semibold">Highest Transfer</span>}
          description={<span className="flex items-center text-gray-400 dark:text-gray-500 text-xs font-normal space-x-1">
            <span>The highest transfer size in last</span>
            <span className="bg-gray-100 dark:bg-gray-800 rounded-lg uppercase text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-0.5">
              24h
            </span>
          </span>}
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 shadow border-0 px-4 sm:py-4"
        >
          <div className="flex flex-col space-y-2 mt-1">
            {crosschainData ?
              <div className="max-h-48 sm:max-h-52 flex flex-col overflow-y-auto space-y-3">
                {_.orderBy(crosschainData.highest_transfer_24h || [], ['max_value', 'max_amount', 'tx'], ['desc', 'desc', 'desc']).map((t, i) => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <img
                        src={t.from_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <img
                          src={t.asset?.image}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                      <img
                        src={t.to_chain?.image}
                        alt=""
                        className="w-7 h-7 rounded-full"
                      />
                    </div>
                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="text-2xs space-x-1">
                        <span className="font-mono font-semibold">{numberFormat(t.max_amount, t.max_amount >= 100000 ? '0,0.00a' : '0,0.000')}</span>
                        <span className="text-gray-400 dark:text-gray-600">{t.asset?.symbol}</span>
                      </span>
                      {t.max_value > 0 && (
                        <span className="font-mono text-gray-400 dark:text-gray-600 text-3xs font-medium">
                          {currency_symbol}{numberFormat(t.max_value, '0,0.00')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="flex flex-col space-y-3">
                {[...Array(5).keys()].map(i => (
                  <div key={i} className="flex items-center justify-between my-1">
                    <div className="flex items-center space-x-2">
                      <div className="skeleton w-7 h-7 rounded-full" />
                      <div className="flex items-center space-x-0.5">
                        <BiCode size={20} />
                        <div className="skeleton w-4 h-4 rounded-full" />
                      </div>
                      <div className="skeleton w-7 h-7 rounded-full" />
                    </div>
                    <div className="skeleton w-16 h-5 ml-auto" />
                  </div>
                ))}
              </div>
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1.5 ml-auto">
              <span>from</span>
              {crosschainData ?
                <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{numberFormat(_.sumBy(crosschainData.highest_transfer_24h, 'tx'), '0,0')}</span>
                :
                <div className="skeleton w-6 h-4" />
              }
              <span>transactions</span>
            </span>
          </div>
        </Widget>
      </div>
    </>
  )
}