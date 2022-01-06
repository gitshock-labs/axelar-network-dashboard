import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import ProposalDetail from './proposal-detail'
import VotesTable from './votes-table'
import Widget from '../widget'

import { proposal as getProposal, allProposalVotes } from '../../lib/api/cosmos'
import { numberFormat } from '../../lib/utils'

export default function Proposal({ id }) {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data } = { ...data }

  const [proposal, setProposal] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        let response = await getProposal(id, null, denoms_data)

        const data = { ...response }     

        response = await allProposalVotes(id)

        data.votes = response?.data || []

        setProposal({ data, id })
      }
    }

    if (id && denoms_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [id, denoms_data])

  const votes = proposal?.id === id && Object.entries(_.groupBy(proposal?.data?.votes || [], 'option')).map(([key, value]) => { return { option: key, value: value?.length || 0 } })

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <ProposalDetail data={proposal?.id === id && proposal?.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-2.5 mt-3 md:ml-2">
          <span>Votes</span>
          <div className="flex items-center space-x-1.5">
            {Array.isArray(votes) && votes.map((vote, i) => (
              <span className={`bg-${['YES'].includes(vote?.option) ? 'green-600 dark:bg-green-700' : ['NO'].includes(vote?.option) ? 'red-600 dark:bg-red-700' : 'gray-400 dark:bg-gray-900'} rounded-xl capitalize whitespace-nowrap text-white text-sm font-semibold px-2 py-1`}>
                {numberFormat(vote.value, '0,0')} {vote?.option?.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>}
        className="bg-transparent border-0 p-0 md:pt-4 md:pb-8 md:px-8"
      >
        <VotesTable data={proposal?.id === id && proposal?.data?.votes} />
      </Widget>
    </div>
  )
}