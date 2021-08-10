import { useState, useEffect } from 'react'

import { getCoinInfo } from '../../lib/api/query'
import { numberFormat } from '../../lib/utils'

export default function CoinInfo() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getCoinInfo()

      setData(response.data)
    }

    getData()

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 rounded grid grid-flow-row grid-cols-2 sm:flex items-center gap-2 sm:gap-8 lg:gap-6 mt-2 sm:mt-auto py-3 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Price:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {data ?
            <>{data.currency}{numberFormat(data.price, '0,0.00000000')}</>
            :
            <div className="skeleton w-8 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Market Cap:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {data ?
            <>{data.currency}{numberFormat(data.market_cap, '0,0')}</>
            :
            <div className="skeleton w-20 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Inflation:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {data ?
            <>{numberFormat(data.inflation_percentage, '0,0.00')}%</>
            :
            <div className="skeleton w-8 h-3" />
          }
        </span>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-2">
        <span className="text-gray-700 dark:text-gray-500 font-semibold">Community Pool:</span>
        <span className="text-gray-900 dark:text-gray-300 font-light">
          {data ?
            <>{numberFormat(data.community_supply, '0,0')} <span className="uppercase font-medium">{data.symbol}</span></>
            :
            <div className="skeleton w-20 h-3" />
          }
        </span>
      </div>
    </div>
  )
}