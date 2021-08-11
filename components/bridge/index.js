import { useState, useEffect } from 'react'

import Widget from '../widget'
import Copy from '../copy'

import { getBridgeAccounts } from '../../lib/api/query'
import { getName, numberFormat, ellipseAddress } from '../../lib/utils'

export default function Bridge() {
  const [bridgeAccounts, setBridgeAccounts] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await getBridgeAccounts()

      if (response) {
        setBridgeAccounts({ data: response.data || [] })
      }
    }

    getData()

    const interval = setInterval(() => getBridgeAccounts(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-6xl grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4 xl:my-6 mx-auto">
      {(bridgeAccounts ?
        bridgeAccounts.data.map((bridgeAccount, i) => { return { ...bridgeAccount, i } })
        :
        [...Array(10).keys()].map(i => { return { i, skeleton: true } })
      ).map((bridgeAccount, i) => (
        <Widget key={i}>
          {!bridgeAccount.skeleton ?
            <div className="min-w-max flex items-start space-x-2">
              <img
                src={bridgeAccount.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col space-y-1">
                <span className="capitalize text-lg font-semibold">{bridgeAccount.name}</span>
                {bridgeAccount.website && (
                  <a href={bridgeAccount.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400">
                    {bridgeAccount.website}
                  </a>
                )}
                <div className="flex flex-col space-y-2">
                  {['bridge_account', 'gateway_address', 'token_address'].filter(addressField => bridgeAccount[addressField] && bridgeAccount[addressField].length > 0).map((addressField, j) => (
                    <div key={j} className="flex flex-col">
                      <span className="font-semibold">{getName(addressField)}</span>
                      {bridgeAccount[addressField].map(key => (
                        Object.entries(key).map(([field, value]) => (
                          <div key={field} className="flex flex-col">
                            <span className="flex items-center space-x-1">
                              <span className="text-sm">{ellipseAddress(value)}</span>
                              <Copy text={value} />
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-light">{getName(field)}</span>
                          </div>
                        ))
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            :
            <div className="flex items-start space-x-2">
              <div className="skeleton w-8 h-8 rounded-full" />
              <div className="flex flex-col space-y-1.5">
                <div className="skeleton w-20 h-4" />
                <div className="skeleton w-40 h-3" />
                <div className="skeleton w-48 h-4" />
                <div className="skeleton w-48 h-4" />
              </div>
            </div>}
        </Widget>
      ))}
    </div>
  )
}