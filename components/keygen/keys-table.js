import Link from 'next/link'
import { useState } from 'react'

import _ from 'lodash'
import moment from 'moment'
import { FaSignature } from 'react-icons/fa'
import { FiKey } from 'react-icons/fi'
import { IoCaretUpOutline, IoCaretDownOutline } from 'react-icons/io5'

import Datatable from '../datatable'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

const COLLAPSE_VALIDATORS_SIZE = 5

export default function KeysTable({ data, corruption_signing_threshold, page }) {
  const [keyIdsSeeMore, setKeyIdsSeeMore] = useState([])

  return (
    <>
      <Datatable
        columns={[
          {
            Header: 'Key ID',
            accessor: 'key_id',
            sortType: (rowA, rowB) => rowA.original.key_id > rowB.original.key_id ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <>
                  <div className="flex items-center text-gray-900 dark:text-gray-100 space-x-1">
                    <FiKey size={16} />
                    <span className="font-medium">{ellipseAddress(props.value, ['validator'].includes(page) ? 10 : 20)}</span>
                    {props.value && (<Copy text={props.value} />)}
                  </div>
                  {['failed'].includes(page) && props.row.original.reason && (
                    <div className="max-w-lg text-gray-400 dark:text-gray-600 text-xs font-normal mt-2">
                      {props.row.original.reason}
                    </div>
                  )}
                  {['sign_attempts'].includes(page) && props.row.original.sig_id && (
                    <>
                      <div className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-2">Signature ID</div>
                      <div className="flex items-center text-gray-900 dark:text-gray-100 space-x-1">
                        <FaSignature size={16} />
                        <span className="font-medium">{ellipseAddress(props.row.original.sig_id, 16)}</span>
                        <Copy text={props.row.original.sig_id} />
                      </div>
                    </>
                  )}
                </>
                :
                <div className="skeleton w-48 h-4" />
            ),
          },
          {
            Header: 'Key Chain',
            accessor: 'key_chain',
            sortType: (rowA, rowB) => rowA.original.key_chain > rowB.original.key_chain ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-1.5 py-0.5" style={{ fontSize: ['validator'].includes(page) ? '.65rem' : '.85rem' }}>
                    {props.value}
                  </span>
                  :
                  '-'
                :
                <div className="skeleton w-12 h-4" />
            ),
          },
          {
            Header: 'Key Role',
            accessor: 'key_role',
            sortType: (rowA, rowB) => rowA.original.key_role > rowB.original.key_role ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                props.value ?
                  <span className="bg-gray-100 dark:bg-gray-800 rounded capitalize text-gray-900 dark:text-gray-100 font-semibold px-1.5 py-0.5" style={{ fontSize: ['validator'].includes(page) ? '.65rem' : '.85rem' }}>
                    {props.value.replace('KEY_ROLE_', '')}
                  </span>
                  :
                  '-'
                :
                <div className="skeleton w-12 h-4" />
            ),
          },
          {
            Header: 'Snapshot Block',
            accessor: 'snapshot_block_number',
            sortType: (rowA, rowB) => rowA.original.snapshot_block_number > rowB.original.snapshot_block_number ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value ?
                    <Link href={`/blocks/${props.value}`}>
                      <a className="text-blue-600 dark:text-blue-400">
                        {props.value}
                      </a>
                    </Link>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Height',
            accessor: 'height',
            sortType: (rowA, rowB) => rowA.original.original.timestamp === rowB.original.original.timestamp ? rowA.original.height > rowB.original.height ? 1 : -1 : rowA.original.original.timestamp > rowB.original.original.timestamp ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="text-right">
                  {props.value ?
                    <>
                      <Link href={`/blocks/${props.value}`}>
                        <a className="text-blue-600 dark:text-blue-400">
                          {props.value}
                        </a>
                      </Link>
                      {props.row.original.timestamp && (
                        <div className="text-gray-400 dark:text-gray-600 text-xs font-normal mt-1" style={{ fontSize: '.65rem' }}>
                          {moment(props.row.original.timestamp * 1000).format('MMM D, YYYY h:mm:ss A z')}
                        </div>
                      )}
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-16 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Share',
            accessor: 'num_validator_shares',
            sortType: (rowA, rowB) => rowA.original.num_validator_shares > rowB.original.num_validator_shares ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className="flex flex-col text-right space-y-0.5">
                  {typeof props.value === 'number' ?
                    <>
                      <span className="font-semibold">{numberFormat(props.value, '0,0')} / {numberFormat(props.row.original.num_total_shares, '0,0')}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs">({numberFormat(props.value * 100 / props.row.original.num_total_shares, '0,0.00')}%)</span>
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-12 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Signing Threshold',
            accessor: 'corruption_signing_threshold',
            disableSortBy: corruption_signing_threshold ? false : true,
            sortType: (rowA, rowB) => rowA.original.corruption_signing_threshold > rowB.original.corruption_signing_threshold ? 1 : -1,
            Cell: props => (
              !props.row.original.skeleton && corruption_signing_threshold ?
                <div className="flex flex-col text-right space-y-0.5">
                  {props.value > -1 ?
                    <>
                      <span className="font-semibold">{numberFormat(props.value, '0,0')} / {numberFormat(_.sumBy(props.row.original.validators, 'share'), '0,0')}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs">({numberFormat(props.value * 100 / _.sumBy(props.row.original.validators, 'share'), '0,0.00')}%)</span>
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="skeleton w-12 h-4 ml-auto" />
            ),
            headerClassName: 'justify-end text-right',
          },
          {
            Header: 'Participated Validators',
            accessor: 'validators',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className={`flex flex-col space-y-2 mb-${props.value && props.value.length > COLLAPSE_VALIDATORS_SIZE ? 0.5 : 4}`}>
                  {props.value && props.value.length > 0 ?
                    <>
                      {['failed', 'sign_attempts'].includes(page) && (
                        <div className="space-x-1.5">
                          <span className="font-medium">Participants:</span>
                          <span className="font-medium">{numberFormat(props.value.length, '0,0')}</span>
                          <span className="font-bold">[{numberFormat(_.sumBy(props.value, 'share'), '0,0')}]</span>
                        </div>
                      )}
                      {_.slice(props.value, 0, keyIdsSeeMore.includes(props.row.original.key_id) ? props.value.length : COLLAPSE_VALIDATORS_SIZE).map((validator, i) => (
                        <div key={i} className="flex items-center text-xs space-x-1.5">
                          <div className="flex flex-col space-y-0.5">
                            {validator.description && validator.description.moniker && (
                              <span className="flex items-center space-x-1.5">
                                <Link href={`/validator/${validator.address}`}>
                                  <a className="text-blue-600 dark:text-blue-400 font-medium">
                                    {validator.description.moniker}
                                  </a>
                                </Link>
                                {validator.status && !(['BOND_STATUS_BONDED'].includes(validator.status)) && (
                                  <span className={`bg-${validator.status.includes('UN') ? validator.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-1.5 py-0.5`} style={{ fontSize: '.65rem' }}>
                                    {validator.status.replace('BOND_STATUS_', '')}
                                  </span>
                                )}
                                {validator.deregistering && (
                                  <span className="bg-blue-300 dark:bg-blue-700 rounded capitalize text-white font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                                    De-registering
                                  </span>
                                )}
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Link href={`/validator/${validator.address}`}>
                                <a className={`${validator.description && validator.description.moniker ? 'text-gray-400 dark:text-gray-600' : 'text-blue-600 dark:text-blue-400 font-medium'}`}>
                                  {ellipseAddress(validator.address, 16)}
                                </a>
                              </Link>
                              <Copy text={validator.address} />
                            </span>
                            {!(validator.description && validator.description.moniker) && (
                              <span className="flex items-center space-x-1.5">
                                {validator.status && !(['BOND_STATUS_BONDED'].includes(validator.status)) && (
                                  <span className={`bg-${validator.status.includes('UN') ? validator.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-1.5 py-0.5`} style={{ fontSize: '.65rem' }}>
                                    {validator.status.replace('BOND_STATUS_', '')}
                                  </span>
                                )}
                                {validator.deregistering && (
                                  <span className="bg-blue-300 dark:bg-blue-700 rounded capitalize text-white font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                                    De-registering
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 font-semibold">[{numberFormat(validator.share, '0,0')}]</span>
                        </div>
                      ))}
                      {(props.value.length > COLLAPSE_VALIDATORS_SIZE || keyIdsSeeMore.includes(props.row.original.key_id)) && (
                        <div
                          onClick={() => setKeyIdsSeeMore(keyIdsSeeMore.includes(props.row.original.key_id) ? keyIdsSeeMore.filter(key_id => key_id !== props.row.original.key_id) : _.uniq(_.concat(keyIdsSeeMore, props.row.original.key_id)))}
                          className={`max-w-min flex items-center cursor-pointer rounded capitalize text-${keyIdsSeeMore.includes(props.row.original.key_id) ? 'red-500' : 'gray-500 dark:text-white'} text-xs font-medium space-x-0.5`}
                        >
                          <span>See {keyIdsSeeMore.includes(props.row.original.key_id) ? 'Less' : 'More'}</span>
                          {!(keyIdsSeeMore.includes(props.row.original.key_id)) && (
                            <span>({numberFormat(props.value.length - COLLAPSE_VALIDATORS_SIZE, '0,0')})</span>
                          )}
                          {keyIdsSeeMore.includes(props.row.original.key_id) ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                          {!(keyIdsSeeMore.includes(props.row.original.key_id)) && (
                            <span>[{numberFormat(_.sumBy(_.slice(props.value, COLLAPSE_VALIDATORS_SIZE), 'share'), '0,0')}]</span>
                          )}
                        </div>
                      )}
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="flex flex-col space-y-2 mb-4">
                  {[...Array(5).keys()].map(i => (
                    <div key={i} className="skeleton w-48 h-4" />
                  ))}
                </div>
            ),
          },
          {
            Header: 'Non-Participated Validators',
            accessor: 'non_participant_validators',
            disableSortBy: true,
            Cell: props => (
              !props.row.original.skeleton ?
                <div className={`flex flex-col space-y-2 mb-${props.value && props.value.length > COLLAPSE_VALIDATORS_SIZE ? 0.5 : 4}`}>
                  {props.value && props.value.length > 0 ?
                    <>
                      {['failed', 'sign_attempts'].includes(page) && (
                        <div className="space-x-1.5">
                          <span className="font-medium">Participants:</span>
                          <span className="font-medium">{numberFormat(props.value.length, '0,0')}</span>
                          <span className="font-bold">[{numberFormat(_.sumBy(props.value, 'share'), '0,0')}]</span>
                        </div>
                      )}
                      {_.slice(props.value, 0, keyIdsSeeMore.includes(props.row.original.key_id) ? props.value.length : COLLAPSE_VALIDATORS_SIZE).map((validator, i) => (
                        <div key={i} className="flex items-center text-xs space-x-1.5">
                          <div className="flex flex-col space-y-0.5">
                            {validator.description && validator.description.moniker && (
                              <span className="flex items-center space-x-1.5">
                                <Link href={`/validator/${validator.address}`}>
                                  <a className="text-blue-600 dark:text-blue-400 font-medium">
                                    {validator.description.moniker}
                                  </a>
                                </Link>
                                {validator.status && !(['BOND_STATUS_BONDED'].includes(validator.status)) && (
                                  <span className={`bg-${validator.status.includes('UN') ? validator.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-1.5 py-0.5`} style={{ fontSize: '.65rem' }}>
                                    {validator.status.replace('BOND_STATUS_', '')}
                                  </span>
                                )}
                                {validator.deregistering && (
                                  <span className="bg-blue-300 dark:bg-blue-700 rounded capitalize text-white font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                                    De-registering
                                  </span>
                                )}
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Link href={`/validator/${validator.address}`}>
                                <a className={`${validator.description && validator.description.moniker ? 'text-gray-400 dark:text-gray-600' : 'text-blue-600 dark:text-blue-400 font-medium'}`}>
                                  {ellipseAddress(validator.address, 16)}
                                </a>
                              </Link>
                              <Copy text={validator.address} />
                            </span>
                            {!(validator.description && validator.description.moniker) && (
                              <span className="flex items-center space-x-1.5">
                                {validator.status && !(['BOND_STATUS_BONDED'].includes(validator.status)) && (
                                  <span className={`bg-${validator.status.includes('UN') ? validator.status.endsWith('ED') ? 'gray-300 dark:bg-gray-600' : 'yellow-500' : 'green-500'} rounded capitalize text-white font-semibold px-1.5 py-0.5`} style={{ fontSize: '.65rem' }}>
                                    {validator.status.replace('BOND_STATUS_', '')}
                                  </span>
                                )}
                                {validator.deregistering && (
                                  <span className="bg-blue-300 dark:bg-blue-700 rounded capitalize text-white font-semibold px-1.5 py-0.5" style={{ fontSize: '.65rem' }}>
                                    De-registering
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 font-semibold">[{numberFormat(validator.share, '0,0')}]</span>
                        </div>
                      ))}
                      {(props.value.length > COLLAPSE_VALIDATORS_SIZE || keyIdsSeeMore.includes(props.row.original.key_id)) && (
                        <div
                          onClick={() => setKeyIdsSeeMore(keyIdsSeeMore.includes(props.row.original.key_id) ? keyIdsSeeMore.filter(key_id => key_id !== props.row.original.key_id) : _.uniq(_.concat(keyIdsSeeMore, props.row.original.key_id)))}
                          className={`max-w-min flex items-center cursor-pointer rounded capitalize text-${keyIdsSeeMore.includes(props.row.original.key_id) ? 'red-500' : 'gray-500 dark:text-white'} text-xs font-medium space-x-0.5`}
                        >
                          <span>See {keyIdsSeeMore.includes(props.row.original.key_id) ? 'Less' : 'More'}</span>
                          {!(keyIdsSeeMore.includes(props.row.original.key_id)) && (
                            <span>({numberFormat(props.value.length - COLLAPSE_VALIDATORS_SIZE, '0,0')})</span>
                          )}
                          {keyIdsSeeMore.includes(props.row.original.key_id) ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
                          {!(keyIdsSeeMore.includes(props.row.original.key_id)) && (
                            <span>[{numberFormat(_.sumBy(_.slice(props.value, COLLAPSE_VALIDATORS_SIZE), 'share'), '0,0')}]</span>
                          )}
                        </div>
                      )}
                    </>
                    :
                    '-'
                  }
                </div>
                :
                <div className="flex flex-col space-y-2 mb-4">
                  {[...Array(5).keys()].map(i => (
                    <div key={i} className="skeleton w-48 h-4" />
                  ))}
                </div>
            ),
          },
        ].filter(column => ['validator'].includes(page) ? !(['validators', 'corruption_signing_threshold', 'height', 'non_participant_validators'].includes(column.accessor)) : ['failed'].includes(page) ? !(['num_validator_shares', 'snapshot_block_number', 'corruption_signing_threshold'].includes(column.accessor)) : ['sign_attempts'].includes(page) ? !(['num_validator_shares', 'snapshot_block_number', 'corruption_signing_threshold'].includes(column.accessor)) : !(['num_validator_shares', 'height', 'non_participant_validators'].includes(column.accessor)))}
        data={data ?
          data.data && data.data.map((key, i) => { return { ...key, i, corruption_signing_threshold: corruption_signing_threshold && typeof corruption_signing_threshold[key.key_id] === 'number' ? corruption_signing_threshold[key.key_id] : -1 } })
          :
          [...Array(10).keys()].map(i => { return { i, skeleton: true } })
        }
        noPagination={data && data.data && data.data.length > 10 ? false : true}
        defaultPageSize={100}
      />
      {data && !(data.data && data.data.length > 0) && (
        <div className={`bg-${['validator'].includes(page) ? 'gray-50' : 'white'} dark:bg-gray-800 text-gray-300 dark:text-gray-500 text-base font-medium italic text-center my-4 py-2`}>
          No Keys
        </div>
      )}
    </>
  )
}