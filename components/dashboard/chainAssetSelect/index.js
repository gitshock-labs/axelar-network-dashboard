import { useState, useEffect, useRef } from 'react'

import { MdExpandMore, MdExpandLess } from 'react-icons/md'

import ChainAssets from './chainAssets'

import { randImage } from '../../../lib/utils'

export default function DropdownChainAsset({ chainAssets, chainAssetSelect, setChainAssetSelect }) {
  const chainAsset = chainAssets?.find(_chainAsset => _chainAsset.id === chainAssetSelect) || chainAssets?.[0]

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
        {chainAsset && (
          <>
            {/*<img
              src={chainAsset.asset_image || randImage(i)}
              alt=""
              className="w-6 h-6 rounded-full"
            />*/}
            <span className="uppercase text-gray-900 dark:text-gray-100 text-xs font-semibold">
              ${chainAsset.asset_symbol}
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-xs font-normal">on</span>
            <img
              src={chainAsset.chain_image || randImage(i)}
              alt=""
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
              {chainAsset.chain_name}
            </span>
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
        <div className="dropdown-content w-48 bottom-start">
          <ChainAssets
            chainAssets={chainAssets}
            handleDropdownClick={chainAsset => {
              setChainAssetSelect(chainAsset)
              handleDropdownClick()
            }}
          />
        </div>
      </div>
    </div>
  )
}