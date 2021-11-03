import { useState, useEffect, useRef } from 'react'

import { MdExpandMore, MdExpandLess } from 'react-icons/md'

import Contracts from './contracts'

import { randImage } from '../../../lib/utils'

export default function DropdownContract({ contracts, contractSelect, setContractSelect }) {
  const contract = contracts?.find(_contract => _contract.contract_name === contractSelect) || contracts?.[0]

  const [hidden, setHidden] = useState(true)

  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [hidden, buttonRef, dropdownRef])

  const handleDropdownClick = () => setHidden(!hidden)

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleDropdownClick}
        className="flex items-center justify-start space-x-1.5 mx-1"
      >
        {contract && (
          <>
            <img
              src={contract.image || randImage(contracts.findIndex(_contract => _contract.contract_name === contractSelect))}
              alt=""
              className="w-6 h-6 rounded-full"
            />
            <span className="uppercase text-sm font-semibold">{contract.name}</span>
            {hidden ?
              <MdExpandMore className="bg-gray-200 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400 -ml-0.5 mb-0.5" />
              :
              <MdExpandLess className="bg-gray-100 dark:bg-gray-900 rounded text-gray-600 dark:text-gray-400 -ml-0.5 mb-0.5" />
            }
          </>
        )}
      </button>
      <div
        ref={dropdownRef} 
        className={`dropdown ${hidden ? '' : 'open'} absolute top-0 left-0 mt-6`}
      >
        <div className="dropdown-content w-32 bottom-start">
          <Contracts
            contracts={contracts}
            handleDropdownClick={contract => {
              setContractSelect(contract)
              handleDropdownClick()
            }}
          />
        </div>
      </div>
    </div>
  )
}