import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import NetworkGraph from './network-graph'
import TransfersTable from './transfers-table'

import { transfers } from '../../lib/api/opensearch'
import { denomSymbol, denomName, denomAmount, denomImage } from '../../lib/object/denom'
import { chainName, chainImage, idFromMaintainerId } from '../../lib/object/chain'

export default function Crosschain() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data } = { ...data }

  const [summaryData, setSummaryData] = useState(null)
  const [transfersData, setTransfersData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        // const response = await keygenSummary()

        // setSummaryData({ data: response || {}})
      }
    }

    getData()

    const interval = setInterval(() => getData(), 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (denoms_data) {
        let data

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
                      avg_amounts: {
                        avg: {
                          field: 'amount',
                        },
                      },
                      since: {
                        min: {
                          field: 'created_at.ms',
                        },
                      },
                      token_address: {
                        terms: { field: 'contract.address.keyword', size: 10000 },
                      },
                      transfer_action: {
                        terms: { field: 'transfer_action.keyword', size: 10000 },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        data = _.orderBy(response?.data?.map(transfer => {
          return {
            ...transfer,
            chain_name: chainName(idFromMaintainerId(transfer.chain)),
            chain_image: chainImage(idFromMaintainerId(transfer.chain)),
            asset_name: denomName(transfer.asset, denoms_data),
            asset_image: denomImage(transfer.asset, denoms_data),
            asset_symbol: denomSymbol(transfer.asset, denoms_data),
            amount: denomAmount(transfer.amount, transfer.asset, denoms_data),
            avg_amount: denomAmount(transfer.avg_amount, transfer.asset, denoms_data),
          }
        }), ['tx'], ['desc'])

        setTransfersData({ data })
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
    <div className="max-w-full my-4 xl:my-6 mx-auto">
      <NetworkGraph data={summaryData?.data} />
      <TransfersTable data={transfersData} />
    </div>
  )
}