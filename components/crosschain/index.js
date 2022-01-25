import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'

import NetworkGraph from './network-graph'
import TransfersTable from './transfers-table'

import { crosschainTxs } from '../../lib/api/opensearch'
import { getChain } from '../../lib/object/chain'
import { getDenom, denomer } from '../../lib/object/denom'
import { currency } from '../../lib/object/currency'

export default function Crosschain() {
  const { chains, cosmos_chains, denoms } = useSelector(state => ({ chains: state.chains, cosmos_chains: state.cosmos_chains, denoms: state.denoms }), shallowEqual)
  const { chains_data } = { ...chains }
  const { cosmos_chains_data } = { ...cosmos_chains }
  const { denoms_data } = { ...denoms }

  const [transfersData, setTransfersData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (chains_data && cosmos_chains_data && denoms_data) {
        let response, data

        if (!controller.signal.aborted) {
          response = await crosschainTxs({
            aggs: {
              from_chains: {
                terms: { field: 'send.sender_chain.keyword', size: 10000 },
                aggs: {
                  to_chains: {
                    terms: { field: 'send.recipient_chain.keyword', size: 10000 },
                    aggs: {
                      assets: {
                        terms: { field: 'send.denom.keyword', size: 10000 },
                        aggs: {
                          amounts: {
                            sum: {
                              field: 'send.amount',
                            },
                          },
                          avg_amounts: {
                            avg: {
                              field: 'send.amount',
                            },
                          },
                          since: {
                            min: {
                              field: 'send.created_at.ms',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          })
        }

        data = _.orderBy(response?.data?.map(t => {
          return {
            ...t,
            from_chain: getChain(t?.from_chain, chains_data) || getChain(t?.from_chain, cosmos_chains_data),
            to_chain: getChain(t?.to_chain, chains_data) || getChain(t?.to_chain, cosmos_chains_data),
            asset: getDenom(t?.asset, denoms_data),
            amount: denomer.amount(t?.amount, t?.asset, denoms_data),
            avg_amount: denomer.amount(t?.avg_amount, t?.asset, denoms_data),
          }
        }).map(t => {
          return {
            ...t,
            value: (t?.asset?.token_data?.[currency] && (t.asset.token_data[currency] * t.amount)) || -1,
            avg_value: (t?.asset?.token_data?.[currency] && (t.asset.token_data[currency] * t.avg_amount)) || -1,
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
  }, [chains_data, cosmos_chains_data, denoms_data])

  return (
    <div className="max-w-full my-4 xl:my-6 mx-auto">
      <NetworkGraph data={transfersData?.data} />
      <TransfersTable data={transfersData} />
    </div>
  )
}