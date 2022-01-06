import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'

import ProposalDetail from './proposal-detail'
import VotesTable from './votes-table'
import Widget from '../widget'

import { allValidators, proposal as getProposal, allProposalVotes, allProposalTally, validatorProfile } from '../../lib/api/cosmos'
import { numberFormat, randImage, getName } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Proposal({ id }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, validators_data } = { ...data }

  const [proposal, setProposal] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)
  const [validatorsSet, setValidatorsSet] = useState(false)
  const [validatorProfilesSet, setValidatorProfilesSet] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, null, null, denoms_data)

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data,
          })

          setLoadValsProfile(true)
        }
      }
    }

    if (denoms_data) {
      getValidators()
    }

    const interval = setInterval(() => getValidators(), 10 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [denoms_data])

  useEffect(() => {
    const controller = new AbortController()

    const getValidatorsProfile = async () => {
      if (loadValsProfile && validators_data?.findIndex(validator_data => validator_data?.description && !validator_data.description.image) > -1) {
        const data = _.cloneDeep(validators_data)

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const validator_data = data[i]

            if (validator_data?.description) {
              if (validator_data.description.identity && !validator_data.description.image) {
                const responseProfile = await validatorProfile({ key_suffix: validator_data.description.identity })

                if (responseProfile?.them?.[0]?.pictures?.primary?.url) {
                  validator_data.description.image = responseProfile.them[0].pictures.primary.url
                }
              }

              validator_data.description.image = validator_data.description.image || randImage(i)

              data[i] = validator_data
            }
          }
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: VALIDATORS_DATA,
            value: data,
          })
        }
      }
    }

    getValidatorsProfile()

    return () => {
      controller?.abort()
    }
  }, [loadValsProfile])

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

  useEffect(() => {
    if (validators_data && proposal?.data?.votes?.length > 0 && (!validatorsSet || !validatorProfilesSet)) {
      const votes = proposal.data.votes.map(vote => {
        return {
          ...vote,
          validator_data: validators_data?.find(_validator_data => _validator_data?.delegator_address?.toLowerCase() === vote?.voter?.toLowerCase()),
        }
      })

      setProposal({ data: { ...proposal.data, votes }, id })
      setValidatorsSet(true)
      if (votes.findIndex(_vote => _vote?.validator_data?.description?.identity && !_vote?.validator_data?.description?.image) < 0) {
        setValidatorProfilesSet(loadValsProfile)
      }
    }
  }, [proposal, validators_data, loadValsProfile, validatorsSet, validatorProfilesSet])

  const votes = proposal?.id === id && Object.entries(_.groupBy(proposal?.data?.votes || [], 'option')).map(([key, value]) => { return { option: key, value: value?.length || 0 } })

  const end = proposal?.data?.voting_end_time && proposal.data.voting_end_time < moment().valueOf()

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <ProposalDetail data={proposal?.id === id && proposal?.data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-2.5 mt-3 md:ml-2">
          <span>{end ? 'Final Tally' : 'Votes'}</span>
          <div className="flex items-center space-x-1.5">
            {end ?
              proposal?.id === id && Object.entries(proposal?.data?.final_tally_result).map(([key, value]) => (
                <span key={key} className="max-w-min bg-gray-100 dark:bg-gray-900 rounded-xl capitalize whitespace-nowrap text-gray-900 dark:text-gray-200 text-xs font-semibold px-2 py-1">
                  {getName(key)}: {numberFormat(value, '0,0')}
                </span>
              ))
              :
              Array.isArray(votes) && votes.map((vote, i) => (
                <span className={`bg-${['YES'].includes(vote?.option) ? 'green-600 dark:bg-green-700' : ['NO'].includes(vote?.option) ? 'red-600 dark:bg-red-700' : 'gray-400 dark:bg-gray-900'} rounded-xl capitalize whitespace-nowrap text-white text-sm font-semibold px-2 py-1`}>
                  {numberFormat(vote.value, '0,0')} {vote?.option?.replace('_', ' ')}
                </span>
              ))
            }
          </div>
        </div>}
        className="bg-transparent border-0 p-0 md:pt-4 md:pb-8 md:px-8"
      >
        {!end && (
          <VotesTable data={proposal?.id === id && proposal?.data?.votes} />
        )}
      </Widget>
    </div>
  )
}