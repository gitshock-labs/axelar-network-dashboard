import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import _ from 'lodash'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

import Copy from '../copy'

import { axelard } from '../../lib/api/executor'
import { transaction as btcTx } from '../../lib/api/btc_explorer'
import { ethTx } from '../../lib/api/cryptoapis'
import { convertToJson, sleep } from '../../lib/utils'

export default function Exercise1() {
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
      label: 'Bitcoin deposit Tx ID',
      name: 'tx_btc_deposit',
      type: 'text',
      placeholder: 'Enter deposit transaction ID',
    },
    {
      label: 'ETH transfer Tx ID',
      name: 'tx_eth_transfer',
      type: 'text',
      placeholder: 'Enter transfer transaction ID',
    },
    {
      label: 'ETH burn Tx ID',
      name: 'tx_eth_burn',
      type: 'text',
      placeholder: 'Enter burn transaction ID',
    },
    {
      label: 'Bitcoin burn transfer Tx ID',
      name: 'tx_btc_burn_transfer',
      type: 'text',
      placeholder: 'Enter burn transfer transaction ID',
    },
  ]

  const onSubmit = async data => {
    setProcessing([])
    clearErrors()

    if (data) {
      let error = false

      const accountRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT}.*$`, 'igm')

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

      if (!data.tx_btc_deposit) {
        setError('tx_btc_deposit', {
          type: 'manual',
          message: 'Deposit Tx ID is required',
        })

        if (!error) {
          setFocus('tx_btc_deposit')
          error = true
        }
      }

      if (!data.tx_eth_transfer) {
        setError('tx_eth_transfer', {
          type: 'manual',
          message: 'transfer Tx ID is required',
        })

        if (!error) {
          setFocus('tx_eth_transfer')
          error = true
        }
      }

      if (!data.tx_eth_burn) {
        setError('tx_eth_burn', {
          type: 'manual',
          message: 'burn Tx ID is required',
        })

        if (!error) {
          setFocus('tx_eth_burn')
          error = true
        }
      }

      if (!data.tx_btc_burn_transfer) {
        setError('tx_btc_burn_transfer', {
          type: 'manual',
          message: 'Burn transfer Tx ID is required',
        })

        if (!error) {
          setFocus('tx_btc_burn_transfer')
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
          _processing.push({
            label: `Check ${items?.[1]?.label}`,
            commands: [
              {
                message: `GET ${new URL(process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_URL).hostname} /tx/${data.tx_btc_deposit}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await btcTx(data.tx_btc_deposit)

          if (response?.vout) {
            _processing[_processing.length - 1].commands[0].result = response
            _processing[_processing.length - 1].status = true
            _processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_URL}/tx/${data.tx_btc_deposit}`
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'Wrong deposit transaction ID'
            _processing[_processing.length - 1].status = false
            error = true
          }

          setProcessing(_.cloneDeep(_processing))
        }

        if (!error) {
          cmd = 'axelard q evm gateway-address ethereum'

          _processing.push({
            label: `Check ${items?.[2]?.label}`,
            commands: [
              {
                message: `>_ ${cmd}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await axelard({ cmd: `${cmd}` })

          if (response?.data?.stdout) {
            data.eth_gateway_contract = response.data.stdout
            _processing[_processing.length - 1].commands[0].result = response.data.stdout
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'N/A'
          }

          setProcessing(_.cloneDeep(_processing))

          _processing[_processing.length - 1].commands[1] = {
            message: `GET ${new URL(process.env.NEXT_PUBLIC_ETHEREUM_EXPLORER_URL).hostname} /tx/${data.tx_eth_transfer}`,
          }

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await ethTx(data.tx_eth_transfer)

          if (response?.data?.item?.isConfirmed === 'true') {
            if (response.data.item.recipients?.findIndex(recipient => !data.eth_gateway_contract || recipient?.address?.toLowerCase() === data.eth_gateway_contract.toLowerCase()) > -1) {
              data.eth_addresses = response?.data?.item.senders?.map(sender => sender?.address?.toLowerCase()) || []
              _processing[_processing.length - 1].commands[1].result = response.data.item
              _processing[_processing.length - 1].status = true
              _processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_ETHEREUM_EXPLORER_URL}/tx/${data.tx_eth_transfer}`
            }
            else {
              _processing[_processing.length - 1].commands[1].result = `Wrong recipient (ETH gateway contract${data.eth_gateway_contract ? `: ${data.eth_gateway_contract}` : ''})`
              _processing[_processing.length - 1].status = false
              error = true
            }
          }
          else {
            _processing[_processing.length - 1].commands[1].result = 'Wrong transfer transaction ID'
            _processing[_processing.length - 1].status = false
            error = true
          }

          setProcessing(_.cloneDeep(_processing))
        }

        if (!error) {
          cmd = 'axelard q evm token-address ethereum satoshi'

          _processing.push({
            label: `Check ${items?.[3]?.label}`,
            commands: [
              {
                message: `>_ ${cmd}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await axelard({ cmd: `${cmd}` })

          if (response?.data?.stdout) {
            data.eth_satoshi_contract = response.data.stdout
            _processing[_processing.length - 1].commands[0].result = response.data.stdout
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'N/A'
          }

          setProcessing(_.cloneDeep(_processing))

          _processing[_processing.length - 1].commands[1] = {
            message: `GET ${new URL(process.env.NEXT_PUBLIC_ETHEREUM_EXPLORER_URL).hostname} /tx/${data.tx_eth_burn}`,
          }

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await ethTx(data.tx_eth_burn)

          if (response?.data?.item?.isConfirmed === 'true') {
            if (response.data.item.recipients?.findIndex(recipient => !data.eth_satoshi_contract || recipient?.address?.toLowerCase() === data.eth_satoshi_contract.toLowerCase()) > -1) {
              if (response.data.item.senders?.findIndex(sender => !(data.eth_addresses?.length > 0) || data.eth_addresses.includes(sender?.address?.toLowerCase())) > -1) {
                _processing[_processing.length - 1].commands[1].result = response.data.item
                _processing[_processing.length - 1].status = true
                _processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_ETHEREUM_EXPLORER_URL}/tx/${data.tx_eth_burn}`
              }
              else {
                _processing[_processing.length - 1].commands[1].result = `Wrong sender address${data.eth_addresses?.length > 0 ? `(should be ${data.eth_addresses.join(' | ')})` : ''}`
                _processing[_processing.length - 1].status = false
                error = true
              }
            }
            else {
              _processing[_processing.length - 1].commands[1].result = `Wrong contract (axelarBTC contract${data.eth_satoshi_contract ? `: ${data.eth_satoshi_contract}` : ''})`
              _processing[_processing.length - 1].status = false
              error = true
            }
          }
          else {
            _processing[_processing.length - 1].commands[1].result = 'Wrong burn transaction ID'
            _processing[_processing.length - 1].status = false
            error = true
          }

          setProcessing(_.cloneDeep(_processing))
        }

        if (!error) {
          _processing.push({
            label: `Check ${items?.[4]?.label}`,
            commands: [
              {
                message: `GET ${new URL(process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_URL).hostname} /tx/${data.tx_btc_burn_transfer}`,
              }
            ],
          })

          setProcessing(_.cloneDeep(_processing))

          await sleep(0.5 * 1000)

          response = await btcTx(data.tx_btc_burn_transfer)

          if (response?.vout) {
            _processing[_processing.length - 1].commands[0].result = response
            _processing[_processing.length - 1].status = true
            _processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_URL}/tx/${data.tx_btc_burn_transfer}`
          }
          else {
            _processing[_processing.length - 1].commands[0].result = 'Wrong burn transfer transaction ID'
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