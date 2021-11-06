import { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import _ from 'lodash'

import BlockDetail from './block-detail'
import TransactionsTable from '../transactions/transactions-table'
import Widget from '../widget'

import { allValidators, block as getBlock, transactions as getTransactions, validatorProfile } from '../../lib/api/cosmos'
import { numberFormat, randImage } from '../../lib/utils'

import { VALIDATORS_DATA } from '../../reducers/types'

export default function Block({ height }) {
  const dispatch = useDispatch()
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { denoms_data, validators_data } = { ...data }

  const [block, setBlock] = useState(null)
  const [transactions, setTransactions] = useState(null)
  const [loadValsProfile, setLoadValsProfile] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getValidators = async () => {
      if (!controller.signal.aborted) {
        const response = await allValidators({}, validators_data, null, null, null, denoms_data)

        if (response) {
          dispatch({
            type: VALIDATORS_DATA,
            value: response.data
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
            value: data
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
        const response = await getBlock(height)

        if (response) {
          setBlock({ data: response.data || {}, height })
        }
      }
    }

    if (height) {
      getData()
    }

    const interval = setInterval(() => getData(), 1 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [height])

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      // const response = await getTransactions({ query: { match: { height } }, size: 100, sort: [{ timestamp: 'desc' }] }, null, denoms_data)
      let response

      let data = []

      let pageKey = true

      while (pageKey) {
        if (!controller.signal.aborted) {
          response = await getTransactions({ events: `tx.height=${height}`, 'pagination.key': pageKey && typeof pageKey === 'string' ? pageKey : undefined }, null, denoms_data)

          data = _.orderBy(_.uniqBy(_.concat(data, response?.data || []), 'txhash'), ['timestamp'], ['desc'])

          pageKey = response?.pagination?.next_key
        }
        else {
          pageKey = null
        }
      }

      setTransactions({ data, total: response?.total, height })
    }

    if (height && denoms_data) {
      getData()
    }

    const interval = setInterval(() => getData(), 3 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [height, denoms_data])

  const validator_data = block?.height === height && block?.data?.proposer_address && validators_data && _.head(validators_data.filter(validator_data => validator_data?.consensus_address === block.data.proposer_address))

  return (
    <div className="max-w-6xl my-4 xl:my-6 mx-auto">
      <BlockDetail data={block?.height === height && block?.data} validator_data={validator_data} />
      <Widget
        title={<div className="flex items-center text-gray-900 dark:text-white text-lg font-semibold space-x-1 mt-3">
          <span>Transactions</span>
          {transactions && transactions.height === height && (
            <span>({transactions.total || transactions.data.length})</span>
          )}
        </div>}
        className="mt-4"
      >
        <div className="mt-3">
          <TransactionsTable data={transactions} noLoad={true} location="blocks" />
        </div>
      </Widget>
    </div>
  )
}