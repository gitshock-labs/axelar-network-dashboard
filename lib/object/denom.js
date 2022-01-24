import BigNumber from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES: Number(process.env.NEXT_PUBLIC_MAX_BIGNUMBER_EXPONENTIAL_AT), EXPONENTIAL_AT: [-7, Number(process.env.NEXT_PUBLIC_MAX_BIGNUMBER_EXPONENTIAL_AT)] })

export const fee_denom = 'uaxl'

export const getDenom = (denom, denoms) => denoms?.find(_denom => [_denom?.id?.toLowerCase(), _denom?.ibc?.toLowerCase()].includes(denom?.toLowerCase()))

export const denomer = {
	id: (denom, denoms) => getDenom(denom, denoms)?.id || denom,
	symbol: (denom, denoms) => getDenom(denom, denoms)?.symbol || denom,
	title: (denom, denoms) => getDenom(denom, denoms)?.title || denom,
  image: (denom, denoms) => getDenom(denom, denoms)?.image,
	amount: (value, denom, denoms) => BigNumber(!isNaN(value) ? value : 0).shiftedBy(-(getDenom(denom, denoms)?.contract_decimals || 6)).toNumber(),
}