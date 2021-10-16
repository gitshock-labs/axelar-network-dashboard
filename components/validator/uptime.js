import Link from 'next/link'

import { BsArrowRightShort } from 'react-icons/bs'
import { IoArrowUpCircle } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'

import Widget from '../widget'
import Popover from '../popover'

import { numberFormat } from '../../lib/utils'

export default function Uptime({ data, validator_data }) {
  return (
    <Widget
      title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Uptime <span className="text-gray-500 text-sm font-light italic">(Mock Data)</span></span>}
      description={<div className="flex items-center mt-2">
        <span className="text-gray-500 dark:text-gray-300">Last {numberFormat(process.env.NEXT_PUBLIC_NUM_UPTIME_BLOCKS, '0,0')} Blocks</span>
        {data ?
          <span className="ml-auto">{validator_data && numberFormat(validator_data.uptime, '0,0.00')}%</span>
          :
          <div className="skeleton w-10 h-4 ml-auto" />
        }
      </div>}
    >
      <div className="flex flex-wrap items-center">
        {(data ?
          data
          :
          [...Array(Number(process.env.NEXT_PUBLIC_NUM_UPTIME_DISPLAY_BLOCKS)).keys()].map(i => { return { i, skeleton: true } })
        ).map((block, i) => (
          !block.skeleton ?
            <Popover
              key={i}
              placement="top"
              title={<div className="flex items-center">
                <span className="font-bold">Block: {numberFormat(block.height, '0,0')}</span>
                <Link href={`/blocks/${block.height}`}>
                  <a className="flex items-center text-blue-600 dark:text-blue-400 ml-auto">
                    <span className="text-xs">Go to Block</span>
                    <BsArrowRightShort size={16} />
                  </a>
                </Link>
              </div>}
              content={<div className="flex flex-col space-y-2">
                {block.approved > 0 || block.denied > 0 ?
                  <>
                    <span className="flex items-center space-x-2">
                      <span className="bg-green-500 rounded capitalize text-white font-semibold px-2 py-1">approved</span>
                      <span className="text-base font-medium">{numberFormat(block.approved, '0,0')}</span>
                      <span>Event{block.approved > 1 ? 's' : ''}</span>
                      <span className="text-gray-500 text-sm font-light italic">(Mock Data)</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <span className="bg-red-500 rounded capitalize text-white font-semibold px-2 py-1">denied</span>
                      <span className="text-base font-medium">{numberFormat(block.denied, '0,0')}</span>
                      <span>Event{block.denied > 1 ? 's' : ''}</span>
                      <span className="text-gray-500 text-sm font-light italic">(Mock Data)</span>
                    </span>
                  </>
                  :
                  block.up ?
                    <span className="flex items-center text-green-600 dark:text-green-400 text-lg space-x-1">
                      <IoArrowUpCircle size={24} />
                      <span>Up</span>
                    </span>
                    :
                    <span className="flex items-center text-red-600 dark:text-red-400 text-lg space-x-1">
                      <MdCancel size={24} />
                      <span>Down</span>
                    </span>
                }
              </div>}
            >
              <div
                title={block.height}
                className={`w-6 md:w-8 h-6 md:h-8 ${block.up ? block.approved > block.denied ? 'bg-green-600' : block.denied > block.approved ? 'bg-red-500' : block.approved > 0 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-300 dark:bg-gray-500'} rounded m-1`}
              />
            </Popover>
            :
            <div key={i} className={`skeleton w-6 md:w-8 h-6 md:h-8 rounded m-1`} />
        ))}
      </div>
    </Widget>
  )
}