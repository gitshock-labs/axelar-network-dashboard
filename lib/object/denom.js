export const denoms = [
  {
    denom: 'uaxl',
    contract: 'uaxl',
    symbol: 'axl',
    name: 'Axelar',
    divider: Math.pow(10, 6),
    image: '/logos/logo.png',
  },
  {
    denom: 'satoshi',
    contract: 'satoshi',
    symbol: 'btc',
    name: 'Bitcoin',
    divider: Math.pow(10, 8),
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    denom: 'ibc/287EE075B7AADDEB240AFE74FA2108CDACA50A7CCD013FA4C1FCD142AFA9CA9A',
    contract: 'uphoton',
    symbol: 'photon',
    name: 'Photon',
    divider: Math.pow(10, 6),
  },
]

export const feeDenom = 'uaxl'

export const denomContract = denom => denoms.find(_denom => _denom.denom === denom)?.contract || denom

export const denomSymbol = denom => denoms.find(_denom => _denom.denom === denom)?.symbol || denom

export const denomName = denom => denoms.find(_denom => _denom.denom === denom)?.name || denom

export const denomImage = denom => denoms.find(_denom => _denom.denom === denom)?.image

export const denomAmount = (amount, denom) => denoms.findIndex(_denom => _denom.denom === denom) > -1 ? Number(amount) / denoms[denoms.findIndex(_denom => _denom.denom === denom)].divider : Number(amount)