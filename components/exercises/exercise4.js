import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import _ from 'lodash'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

import Copy from '../copy'

import { transaction } from '../../lib/api/cosmos'
import { axelard, gaiad } from '../../lib/api/executor'
import { convertToJson, sleep } from '../../lib/utils'

export default function Exercise4() {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  const { handleSubmit, register, setFocus, formState: { errors }, setError, clearErrors } = useForm()

  const [processing, setProcessing] = useState([])

  const processingRef = useRef()

  const resultRef = useRef()

  const items = [
    {
      label: 'Axelar address',
      name: 'axelar_address',
      type: 'text',
      placeholder: 'Enter Axelar address',
    },
    {
      label: 'Cosmos IBC transfer Tx hash',
      name: 'tx_cosmos_transfer',
      type: 'text',
      placeholder: 'Enter transfer transaction hash',
    },
    {
      label: 'Axelar IBC transfer Tx ID',
      name: 'tx_axelar_transfer',
      type: 'text',
      placeholder: 'Enter transfer transaction ID',
    },
  ]

  const onSubmit = async data => {
    setProcessing([])
    clearErrors()

    if (data) {
      let error = false

      const accountRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT}.*$`, 'igm')
      const accountATOMRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT.replace('axelar', 'cosmos')}.*$`, 'igm')

      if (!(data.axelar_address?.toLowerCase().match(accountRegEx))) {
        setError('axelar_address', {
          type: 'manual',
          message: data.axelar_address ? `Axelar address must start with ${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT}...` : 'Axelar address is required',
        })

        if (!error) {
          setFocus('axelar_address')
          error = true
        }
      }

      if (!data.tx_cosmos_transfer) {
        setError('tx_cosmos_transfer', {
          type: 'manual',
          message: 'IBC transfer Tx hash is required',
        })

        if (!error) {
          setFocus('tx_cosmos_transfer')
          error = true
        }
      }

      if (!data.tx_axelar_transfer) {
        setError('tx_axelar_transfer', {
          type: 'manual',
          message: 'IBC transfer Tx ID is required',
        })

        if (!error) {
          setFocus('tx_axelar_transfer')
          error = true
        }
      }

      if (!error) {
        processingRef?.current?.scrollIntoView()

        const _processing = []

        let cmd = `axelard q bank balances ${data.axelar_address}`

        _processing.push({
          label: `Query ${items?.[0]?.label}`,
          commands: [
            {
              message: `>_ ${cmd}`,
            }
          ],
        })

        setProcessing(_.cloneDeep(_processing))

        await sleep(0.5 * 1000)

        let response = await axelard({ cmd: `${cmd} -oj` })

        if (response?.data?.stdout) {
          _processing[_processing.length - 1].commands[0].result = response.data.stdout
          _processing[_processing.length - 1].status = true
          _processing[_processing.length - 1].answer = data.axelar_address
        }
        else {
          _processing[_processing.length - 1].commands[0].result = 'Invalid address'
          _processing[_processing.length - 1].status = false
          error = true
        }

        setProcessing(_.cloneDeep(_processing))

        if (!error) {
          cmd = `gaiad q tx ${data.tx_cosmos_transfer}`

          _processing.push({
            label: `Check ${items?.[1]?.label}`,
            commands: [
              {
                message: `>_ ${cmd}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await gaiad({ cmd: `${cmd} -oj` })

          if (response?.data?.stdout && !(convertToJson(response.data.stdout)?.code) && convertToJson(response.data.stdout)?.logs?.findIndex(log => log?.events?.findIndex(event => event?.type === 'ibc_transfer' && event.attributes?.findIndex(attr => attr?.key === 'receiver' && attr.value === data.axelar_address.toLowerCase()) > -1 && event.attributes?.findIndex(attr => attr?.key === 'sender' && attr.value?.match(accountATOMRegEx)) > -1) > -1) > -1) {
            _processing[_processing.length - 1].commands[0].result = response.data.stdout
            _processing[_processing.length - 1].status = true
            _processing[_processing.length - 1].answer = data.tx_cosmos_transfer
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'Wrong IBC transfer transaction hash'
            _processing[_processing.length - 1].status = false
            error = true
          }

          setProcessing(_.cloneDeep(_processing))
        }

        if (!error) {
          _processing.push({
            label: `Check ${items?.[2]?.label}`,
            commands: [
              {
                message: `GET Axelar transaction /tx/${data.tx_axelar_transfer}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await transaction(data.tx_axelar_transfer)

          if (response?.data?.status === 'success' && response.data.activities?.findIndex(activity => activity.action === 'transfer' && activity.sender === data.axelar_address.toLowerCase() && activity.receiver?.match(accountATOMRegEx) && activity.amount > 0 && activity.symbol === 'photon') > -1) {
            _processing[_processing.length - 1].commands[0].result = response.data
            _processing[_processing.length - 1].status = true
            _processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_SITE_URL}/tx/${data.tx_axelar_transfer}`
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'Wrong IBC transfer transaction ID'
            _processing[_processing.length - 1].status = false
            error = true
          }

          setProcessing(_.cloneDeep(_processing))
        }

        if (!error) {
          resultRef?.current?.scrollIntoView()
        }
      }
    }
  }

  const ReactJson = typeof window !== 'undefined' && dynamic(import('react-json-view'))

  return (
    <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 my-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form w-full max-w-lg flex flex-wrap"
        style={{ height: 'fit-content' }}
      >
        <div className="w-full">
          {items.map((item, i) => (
            <div key={i} className="form-element">
              {item.label && (
                <div className="form-label">{item.label}</div>
              )}
              <input
                {...register(item.name)}
                type={item.type}
                placeholder={item.placeholder}
                disabled={processing?.findIndex(process => typeof process?.status !== 'boolean') > -1}
                className={`form-input ${errors?.[item.name] ? 'border-red-500' : ''}`}
              />
              {errors?.[item.name] && (
                <div className="form-error">{errors[item.name].message}</div>
              )}
            </div>
          ))}
        </div>
        <input
          type="submit"
          value="Validate"
          disabled={processing?.findIndex(process => typeof process?.status !== 'boolean') > -1}
          className="btn btn-default btn-rounded max-h-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-900"
        />
      </form>
      <form
        ref={processingRef}
        className="form w-full max-w-2xl flex flex-wrap mt-4 sm:mt-0"
        style={{ height: 'fit-content' }}
      >
        <div className="w-full">
          {processing?.map((process, i) => (
            <div key={i} className="form-element">
              <div className="form-label flex items-center space-x-2">
                <span>{process.label}</span>
                {typeof process.status === 'boolean' ?
                  process.status ?
                    <FaCheckCircle size={20} className="text-green-500" />
                    :
                    <FaTimesCircle size={20} className="text-red-500" />
                  :
                  <Loader type="TailSpin" color={theme === 'dark' ? 'white' : '#acacac'} width="16" height="16" />
                }
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 text-gray-400 space-y-3 py-2 px-3">
                {process.commands?.map((command, j) => (
                  <div key={j} className="break-words">
                    {command.message}
                    {command.result ?
                      convertToJson(command.result) ?
                        <ReactJson src={convertToJson(command.result)} collapsed={true} theme={theme === 'dark' ? 'harmonic' : 'rjv-default'} />
                        :
                        <div className="text-gray-900 dark:text-gray-100 font-medium mt-0.5">{command.result}</div>
                      :
                      <Loader type="ThreeDots" color={theme === 'dark' ? 'white' : '#acacac'} width="24" height="24" />
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
      {processing?.filter(process => process.answer).length >= items.length && (
        <form
          ref={resultRef}
          className="col-span-1 sm:col-span-2 form w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-wrap mt-4 mx-auto py-1 px-4 sm:px-6"
          style={{ height: 'fit-content' }}
        >
          <div className="text-2xl font-semibold mt-4">Result</div>
          <div className="w-full pt-8 pb-12">
            <FaCheckCircle size={60} className="text-green-500 dark:text-white mx-auto" />
          </div>
          <div className="w-full">
            {items.map((item, i) => (
              <div key={i} className="form-element">
                {item.label && (
                  <div className="form-label text-gray-400 dark:text-gray-600" style={{ marginBottom: '.125rem' }}>{item.label}</div>
                )}
                <div className="flex items-start break-all space-x-1">
                  {processing?.[i]?.answer.startsWith('http') ?
                    <a
                      href={processing?.[i]?.answer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-500 font-medium"
                    >
                      {processing?.[i]?.answer}
                    </a>
                    :
                    <span className="font-medium">{processing?.[i]?.answer}</span>
                  }
                  <Copy text={processing?.[i]?.answer} />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}
    </div>
  )
}