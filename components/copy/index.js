import { useState, useEffect } from 'react'

import { FaRegCopy, FaCheckCircle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Copy = ({ text, size = 16, className = '' }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timeout = copied ? setTimeout(() => setCopied(false), 1 * 1000) : null
    return () => clearTimeout(timeout)
  }, [copied, setCopied])

  return copied ? (
    <FaCheckCircle size={size} className={`text-green-400 dark:text-green-600 ${className}`} />
  ) : (
    <CopyToClipboard
      text={text}
      onCopy={() => setCopied(true)}
    >
      <FaRegCopy size={size} className={`cursor-pointer text-gray-400 dark:text-gray-600 ${className}`} />
    </CopyToClipboard>
  )
}

Copy.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number,
  className:PropTypes.string,
}

export default Copy