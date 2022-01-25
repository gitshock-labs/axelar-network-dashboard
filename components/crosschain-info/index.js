import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

import { status as getStatus } from '../../lib/api/rpc'
import { transfers } from '../../lib/api/opensearch'
import { denomSymbol, denomName, denomAmount, denomImage } from '../../lib/object/denom'
import { chainName, chainImage, idFromMaintainerId } from '../../lib/object/chain'
import { numberFormat } from '../../lib/utils'

import { STATUS_DATA } from '../../reducers/types'

export default function TransferInfo() {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data } = { ...data }

  const [transferData, setTransferData] = useState(null)

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

    return () => {
      controller?.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data) {
        let response

        if (!controller.signal.aborted) {
          response = await transfers({
            aggs: {
              transfers: {
                terms: { field: 'chain.keyword', size: 10000 },
                aggs: {
                  assets: {
                    terms: { field: 'contract.name.keyword', size: 10000 },
                    aggs: {
                      amounts: {
                        sum: {
                          field: 'amount',
                        },
                      },
                      since: {
                        min: {
                          field: 'created_at.ms',
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        const data = _.orderBy(response?.data?.map(transfer => {
          return {
            ...transfer,
            chain_name: chainName(idFromMaintainerId(transfer.chain)),
            chain_image: chainImage(idFromMaintainerId(transfer.chain)),
            asset_name: denomName(transfer.asset, denoms_data),
            asset_image: denomImage(transfer.asset, denoms_data),
            asset_symbol: denomSymbol(transfer.asset, denoms_data),
            amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
          }
        }), ['tx'], ['desc'])

        setTransferData({
          data,
          tx: _.sumBy(data, 'tx'),
          chains: _.uniqBy(data, 'chain'),
          assets: _.uniqBy(data, 'asset'),
        })
      }
    }

    getData()

    const interval = setInterval(() => getData(), 30 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  return (
    <div className="w-full bg-gray-100 dark:bg-black rounded grid grid-flow-row grid-cols-3 sm:flex items-start text-2xs lg:text-xs gap-3 sm:gap-4 lg:gap-6 mt-0 sm:mt-auto mb-4 sm:mb-auto ml-0 sm:ml-2 py-3 px-4">
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Chains</span>
        <span className="text-gray-900 dark:text-gray-100 text-xs font-light">
          {transferData ?
            transferData.chains?.length > 0 ?
              <>{numberFormat(transferData.chains.length, '0,0')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Assets</span>
        <span className="text-gray-900 dark:text-gray-100 text-xs font-light">
          {transferData ?
            transferData.assets?.length > 0 ?
              <>{numberFormat(transferData.assets.length, '0,0')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
      <div className="flex flex-col text-center space-y-1 lg:space-y-0.5">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">Transactions</span>
        <span className="text-gray-900 dark:text-gray-100 text-xs font-light">
          {transferData ?
            transferData.tx ?
              <>{numberFormat(transferData.tx, '0,0')}</>
              :
              '-'
            :
            <div className="skeleton w-8 h-4 mx-auto" />
          }
        </span>
      </div>
    </div>
  )
}