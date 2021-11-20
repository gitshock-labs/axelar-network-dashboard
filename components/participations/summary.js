import Link from 'next/link'
import PropTypes from 'prop-types'

import _ from 'lodash'

import Widget from '../widget'

import { numberFormat } from '../../lib/utils'

const Summary = ({ data, keygens, successKeygens, failedKeygens, signAttempts, failedSignAttempts }) => {
  const keyRequirements = _.groupBy(data?.tss?.params?.key_requirements || [], 'key_type')

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      <Widget
        title="Keygen Min Participation Requirement"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                Object.entries(keyRequirements).map(([key, value]) => (
                  <div key={key} className="col-span-2">
                    <div className="text-gray-400 dark:text-gray-600 text-xs">{key?.replace('KEY_TYPE_', '')}</div>
                    <div className="grid grid-flow-row grid-cols-2 gap-2">
                      {value.map((_key, i) => (
                        <span key={i} className="h-8 text-3xl lg:text-2xl xl:text-3xl font-semibold">
                          {_key.min_keygen_threshold?.denominator > 0 ? numberFormat(_key.min_keygen_threshold.numerator * 100 / _key.min_keygen_threshold.denominator, '0,0.00') : '-'}
                          <span className="text-lg font-normal">%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
                :
                <span className="h-8 text-3xl font-semibold">
                  {typeof data.active_keygen_threshold === 'number' ? numberFormat(data.active_keygen_threshold, '0,0.00') : 'N/A'}
                  <span className="text-lg font-normal">%</span>
                </span>
              :
              <>
                <div className="skeleton w-16 h-7 mt-1" />
                <div className="skeleton w-16 h-7 mt-1" />
              </>
            }
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                _.uniq(Object.values(keyRequirements).flatMap(value => value?.map(_value => _value.key_role))).map((key_role, i) => (
                  <span key={i} className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
                    {key_role?.replace('KEY_ROLE_', '')}
                  </span>
                ))
                :
                null
              :
              <>
                <div className="skeleton w-20 h-4 mt-1" />
                <div className="skeleton w-20 h-4 mt-1" />
              </>
            }
          </div>
        </span>
      </Widget>
      <Widget
        title="Sign Safety Threshold"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                Object.entries(keyRequirements).map(([key, value]) => (
                  <div key={key} className="col-span-2">
                    <div className="text-gray-400 dark:text-gray-600 text-xs">{key?.replace('KEY_TYPE_', '')}</div>
                    <div className="grid grid-flow-row grid-cols-2 gap-2">
                      {value.map((_key, i) => (
                        <span key={i} className="h-8 text-3xl lg:text-2xl xl:text-3xl font-semibold">
                          {_key.safety_threshold?.denominator > 0 ? numberFormat(_key.safety_threshold.numerator * 100 / _key.safety_threshold.denominator, '0,0.00') : '-'}
                          <span className="text-lg font-normal">%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
                :
                <span className="h-8 text-3xl font-semibold">N/A</span>
              :
              <>
                <div className="skeleton w-16 h-7 mt-1" />
                <div className="skeleton w-16 h-7 mt-1" />
              </>
            }
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4">
            {data ?
              Object.keys(keyRequirements).length > 0 ?
                _.uniq(Object.values(keyRequirements).flatMap(value => value?.map(_value => _value.key_role))).map((key_role, i) => (
                  <span key={i} className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
                    {key_role?.replace('KEY_ROLE_', '')}
                  </span>
                ))
                :
                null
              :
              <>
                <div className="skeleton w-20 h-4 mt-1" />
                <div className="skeleton w-20 h-4 mt-1" />
              </>
            }
          </div>
        </span>
      </Widget>
      <Widget
        title="Keygen Participation"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          <div className="flex flex-row space-x-1.5">
            {keygens || typeof successKeygens === 'number' ?
              keygens ?
                <span className="h-8 text-3xl font-semibold">{numberFormat(keygens.length, '0,0')}</span>
                :
                <span className="h-8 text-3xl font-semibold">{numberFormat(successKeygens, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
            <span className="h-8 text-gray-600 dark:text-gray-400 text-3xl font-light">/</span>
            {typeof failedKeygens === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(failedKeygens, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
          </div>
          <div className="grid">
            <span className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
              Success / Failed
            </span>
          </div>
        </span>
      </Widget>
      <Widget
        title="Sign Attempts"
        className="bg-transparent sm:bg-white sm:dark:bg-gray-900 border-0 sm:border border-gray-100 dark:border-gray-800 p-0 sm:p-4"
      >
        <span className="flex flex-col mt-1 space-y-1">
          <div className="flex flex-row space-x-1.5">
            {typeof signAttempts === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(signAttempts, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
            <span className="h-8 text-gray-600 dark:text-gray-400 text-3xl font-light">/</span>
            {typeof failedSignAttempts === 'number' ?
              <span className="h-8 text-3xl font-semibold">{numberFormat(failedSignAttempts, '0,0')}</span>
              :
              <div className="skeleton w-12 h-7 mt-1" />
            }
          </div>
          <div className="grid">
            <span className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1">
              Success / Failed
            </span>
          </div>
        </span>
      </Widget>
    </div>
  )
}

Summary.propTypes = {
  data: PropTypes.any,
  keygens: PropTypes.any,
  successKeygens: PropTypes.any,
  failedKeygens: PropTypes.any,
  signAttempts: PropTypes.any,
  failedSignAttempts: PropTypes.any,
}

export default Summary