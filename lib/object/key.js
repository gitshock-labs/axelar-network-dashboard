import { bech32 } from 'bech32'

export const base64ToHex = s => {
  s = typeof s === 'string' ? s : ''
  const raw = atob(s)

  let result = ''

  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16)

    result = `${result}${hex.length === 2 ? '' : '0'}${hex}`
  }

  return result.toUpperCase()
}

export const hexToBech32 = (address, prefix) => bech32.encode(prefix, bech32.toWords(Buffer.from(address, 'hex')))

export const base64ToBech32 = (address, prefix) => hexToBech32(base64ToHex(address), prefix)

export const delegatorAddress = operator_address => bech32.encode(process.env.NEXT_PUBLIC_PREFIX_ACCOUNT, bech32.decode(operator_address).words)

