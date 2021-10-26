import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import _ from 'lodash'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

import Copy from '../copy'

import { transactionsByEvents, transaction } from '../../lib/api/cosmos'
import { axelard } from '../../lib/api/executor'
import { transaction as btcTx } from '../../lib/api/btc_explorer'
import { convertToJson, sleep } from '../../lib/utils'

export default function Exercise3() {
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
      label: 'Axelar burn Tx ID',
      name: 'tx_axelar_burn',
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

	  	if (!(data.axelar_address?.match(accountRegEx))) {
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

    	if (!data.tx_axelar_burn) {
    		setError('tx_axelar_burn', {
          type: 'manual',
          message: 'Burn Tx ID is required',
        })

	  		if (!error) {
	      	setFocus('tx_axelar_burn')
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
    		}
    		else {
    			_processing[_processing.length - 1].commands[0].result = 'Invalid address'
    			_processing[_processing.length - 1].status = false
    			error = true
    		}

    		setProcessing(_.cloneDeep(_processing))

    		if (!error) {
    			// cmd = `axelard q bitcoin deposit-address axelar ${data.axelar_address}`

    			_processing[_processing.length - 1].commands[1] = {
    				// message: `>_ ${cmd}`,
    				message: 'Get linked bitcoin deposit address',
    			}

    			setProcessing(_.cloneDeep(_processing))

    			await sleep(0.5 * 1000)

    			// response = await axelard({ cmd: `${cmd} -oj` })
    			response = await transactionsByEvents(`message.destinationAddress='${data.axelar_address}'`)
    			response = response?.filter(tx => tx?.logs?.[0].events?.[0]?.attributes?.findIndex(attr => attr?.key === 'action' && attr.value === 'Link') > -1).map(tx => tx.logs[0].events[0].attributes.find(attr => attr?.key === 'depositAddress' && attr.value)?.value).filter(address => address) || []

    			// if (response?.data?.stdout) {
	    		// 	_processing[_processing.length - 1].commands[1].result = response.data.stdout
	    		if (response?.length > 0) {
	    			data.btc_addresses = response
	    			_processing[_processing.length - 1].commands[1].result = response.join('\n')
	    			_processing[_processing.length - 1].status = true
	    			_processing[_processing.length - 1].answer = data.axelar_address
	    		}
	    		else {
	    			_processing[_processing.length - 1].commands[1].result = 'No linked address'
	    			_processing[_processing.length - 1].status = false
	    			error = true
	    		}

	    		setProcessing(_.cloneDeep(_processing))
    		}

    		if (!error) {
    			_processing.push({
	    			label: `Check ${items?.[1]?.label}`,
	    			commands: [
	    				{
	    					message: `GET blockstream.info /tx/${data.tx_btc_deposit}`,
	    				}
	    			],
	    		})

	    		setProcessing(_.cloneDeep(_processing))

	    		await sleep(0.5 * 1000)

	    		response = await btcTx(data.tx_btc_deposit)

	    		if (response?.vout?.findIndex(vout => data.btc_addresses.includes(vout?.scriptpubkey_address)) > -1) {
	    			_processing[_processing.length - 1].commands[0].result = `Valid deposit transaction ID (vout[${response.vout.findIndex(vout => data.btc_addresses.includes(vout?.scriptpubkey_address))}])`
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
    			_processing.push({
	    			label: `Check ${items?.[2]?.label}`,
	    			commands: [
	    				{
	    					message: `GET Axelar transaction /tx/${data.tx_axelar_burn}`,
	    				}
	    			],
	    		})

	    		setProcessing(_.cloneDeep(_processing))

	    		await sleep(0.5 * 1000)

	    		response = await transaction(data.tx_axelar_burn)

	    		if (response?.data?.status === 'success' && response.data.logs?.findIndex(log => log?.events?.findIndex(event => event?.type === 'outpointConfirmation' && event.attributes?.findIndex(attr => attr?.key === 'outPointInfo' && attr.value && data.btc_addresses.includes(JSON.parse(attr.value)?.address) && Number(JSON.parse(attr.value)?.amount) > 0) > -1) > -1) > -1) {
	    			_processing[_processing.length - 1].commands[0].result = response.data
	    			_processing[_processing.length - 1].status = true
	    			_processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_SITE_URL}/tx/${data.tx_axelar_burn}`
	    		}
	    		else {
	    			_processing[_processing.length - 1].commands[0].result = 'Wrong burn transaction ID'
	    			_processing[_processing.length - 1].status = false
	    			error = true
	    		}

	    		setProcessing(_.cloneDeep(_processing))
    		}

    		if (!error) {
    			_processing.push({
	    			label: `Check ${items?.[3]?.label}`,
	    			commands: [
	    				{
	    					message: `GET blockstream.info /tx/${data.tx_btc_burn_transfer}`,
	    				}
	    			],
	    		})

	    		setProcessing(_.cloneDeep(_processing))

	    		await sleep(0.5 * 1000)

	    		response = await btcTx(data.tx_btc_burn_transfer)

	    		if (response?.vout?.findIndex(vout => data.btc_addresses.includes(vout?.scriptpubkey_address)) > -1) {
	    			_processing[_processing.length - 1].commands[0].result = `Valid burn transaction ID (vout[${response.vout.findIndex(vout => data.btc_addresses.includes(vout?.scriptpubkey_address))}])`
	    			_processing[_processing.length - 1].status = true
	    			_processing[_processing.length - 1].answer = `${process.env.NEXT_PUBLIC_BITCOIN_EXPLORER_URL}/tx/${data.tx_btc_burn_transfer}`
	    		}
	    		else {
	    			_processing[_processing.length - 1].commands[0].result = 'Wrong burn transaction ID'
	    			_processing[_processing.length - 1].status = false
	    			error = true
	    		}

	    		setProcessing(_.cloneDeep(_processing))

	    		if (!error) {
    				resultRef?.current?.scrollIntoView()
    			}
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