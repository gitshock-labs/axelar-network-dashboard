import { useState, useEffect } from 'react'

import { FaRegCopy, FaCheckCircle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Copy = ({ text, copyTitle, size = 16, onCopy, className = '' }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timeout = copied ? setTimeout(() => setCopied(false), 1 * 1000) : null
    return () => clearTimeout(timeout)
  }, [copied, setCopied])

  return copied ?
    <div className={`${copyTitle ? 'min-w-max' : ''} flex items-center space-x-1`}>
      {copyTitle && (
        <span className="text-gray-400 dark:text-gray-500 font-medium">{copyTitle}</span>
      )}
      <FaCheckCircle size={size} className={`text-green-400 dark:text-green-600 ${className}`} />
    </div>
    :
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true)
        if (onCopy) {
          onCopy()
        }
      }}
    >
      <div className={`${copyTitle ? 'min-w-max' : ''} flex items-center space-x-1`}>
        {copyTitle && (
          <span className="cursor-pointer text-gray-400 dark:text-gray-500 font-medium">{copyTitle}</span>
        )}
        <FaRegCopy size={size} className={`cursor-pointer text-gray-300 dark:text-gray-600 ${className}`} />
      </div>
    </CopyToClipboard>
}

Copy.propTypes = {
  text: PropTypes.string,
  copyTitle: PropTypes.string,
  size: PropTypes.number,
  className:PropTypes.string,
}

export default Copy