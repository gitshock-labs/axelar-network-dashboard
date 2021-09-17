import Link from 'next/link'

import PropTypes from 'prop-types'
import moment from 'moment'

import Widget from '../widget'
import Copy from '../copy'
import { ProgressBarWithText } from '../progress-bars'

import { numberFormat, ellipseAddress } from '../../lib/utils'

const Summary = ({ data }) => {
  return (
    <>
      <div className="w-full">
        <Widget title="Consensus State">
          <div className="flex flex-wrap items-start mt-3">
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Height</span>
              {data ?
                <Link href={`/blocks/${data.latest_block.height}`}>
                  <a className="text-blue-600 dark:text-blue-400 text-lg">
                    {data.latest_block.height}
                  </a>
                </Link>
                :
                <div className="skeleton w-16 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Round</span>
              {data ?
                <span className="text-lg">
                  {data.latest_block.round || 0}
                </span>
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Step</span>
              {data ?
                <span className="text-lg">
                  {data.latest_block.step || 1}
                </span>
                :
                <div className="skeleton w-12 h-4" />
              }
            </div>
            <div className="flex flex-col space-y-1 my-3 sm:my-0 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Proposer</span>
              {data ?
                <div className="min-w-max flex items-start space-x-2">
                  <Link href={`/validator/${data.latest_block.proposer.key}`}>
                    <a>
                      <img
                        src={data.latest_block.proposer.image}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    </a>
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/validator/${data.latest_block.proposer.key}`}>
                      <a className="text-blue-600 dark:text-blue-400 text-base font-medium">
                        {data.latest_block.proposer.name || data.latest_block.proposer.key}
                      </a>
                    </Link>
                    <span className="flex items-center space-x-1">
                      <span className="font-light">{ellipseAddress(data.latest_block.proposer.key)}</span>
                      <Copy text={data.latest_block.proposer.key} />
                    </span>
                  </div>
                </div>
                :
                <div className="flex items-start space-x-2">
                  <div className="skeleton w-6 h-6 rounded-full" />
                  <div className="flex flex-col space-y-1.5">
                    <div className="skeleton w-24 h-4" />
                    <div className="skeleton w-32 h-3" />
                  </div>
                </div>
              }
            </div>
            <div className="flex flex-col space-y-1 my-3 sm:my-0 mr-8 lg:mr-32">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Voting Power</span>
              {data ?
                <div className="w-64 flex flex-col">
                  <span className="text-base font-medium">
                    {numberFormat(data.latest_block.proposer.voting_power, '0,0')}
                  </span>
                  <ProgressBarWithText
                    width={data.latest_block.proposer.voting_power_percentage}
                    text={<div className="text-white mx-1" style={{ fontSize: '.55rem' }}>
                      {numberFormat(data.latest_block.proposer.voting_power_percentage, '0,0.00')}%
                    </div>}
                    color="bg-green-500 dark:bg-green-600 rounded"
                    backgroundClassName="h-4 bg-gray-200 dark:bg-gray-800 rounded"
                    className={`h-4 flex items-center justify-${data.latest_block.proposer.voting_power_percentage < 20 ? 'start' : 'end'}`}
                  />
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
          <span className="flex flex-col mt-1 space-y-1">
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
                <div className="skeleton w-32 h-3 mt-1" />
              }
            </span>
          </span>
        </Widget>
        <Widget
          title="Average Block Time (All)"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col item mt-1 space-y-1">
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
          <span className="flex flex-col mt-1 space-y-1">
            {data ?
              <span className="h-8 text-3xl font-semibold">{typeof data.active_validators === 'number' && numberFormat(data.active_validators, '0,0')}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              <span>out of</span>
              {data ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{typeof data.total_validators === 'number' && numberFormat(data.total_validators, '0,0')}</span>
                :
                <div className="skeleton w-6 h-3" />
              }
              <span>validators</span>
            </span>
          </span>
        </Widget>
        <Widget
          title="Online Voting Power (Now)"
          className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
        >
          <span className="flex flex-col mt-1 space-y-1">
            {data ?
              <span className="h-8 text-3xl font-semibold">{data.online_voting_power_now}</span>
              :
              <div className="skeleton w-24 h-7 mt-1" />
            }
            <span className="flex items-center text-gray-400 dark:text-gray-600 text-sm font-normal space-x-1">
              {data ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{typeof data.online_voting_power_now_percentage === 'number' && numberFormat(data.online_voting_power_now_percentage, '0,0.00')}%</span>
                :
                <div className="skeleton w-6 h-3" />
              }
              <span>from</span>
              {data ?
                <span className="text-gray-600 dark:text-gray-400 font-medium">{data.total_voting_power}</span>
                :
                <div className="skeleton w-8 h-3" />
              }
              <span className="uppercase text-gray-500">{data && data.denom}</span>
            </span>
          </span>
        </Widget>
      </div>
    </>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
}

export default Summary