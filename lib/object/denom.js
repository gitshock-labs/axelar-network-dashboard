export const denoms = [
  {
    denom: 'uaxl',
    name: 'axl',
    contract_symbol: 'uaxl',
    divider: Math.pow(10, 6),
    image: '/logos/logo.png',
  },
  {
    denom: 'satoshi',
    name: 'satoshi',
    contract_symbol: 'satoshi',
    divider: Math.pow(10, 0),
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    denom: 'ibc/287EE075B7AADDEB240AFE74FA2108CDACA50A7CCD013FA4C1FCD142AFA9CA9A',
    name: 'photon',
    contract_symbol: 'uphoton',
    divider: Math.pow(10, 6),
  },
]

export const feeDenom = 'uaxl'

export const denomName = denom => denoms.find(_denom => _denom.denom === denom)?.name || denom

export const denomAmount = (amount, denom) => denoms.findIndex(_denom => _denom.denom === denom) > -1 ? Number(amount) / denoms[denoms.findIndex(_denom => _denom.denom === denom)].divider : Number(amount)

export const denomSymbol = denom => denoms.find(_denom => _denom.denom === denom)?.contract_symbol || denom

export const denomImage = denom => denoms.find(_denom => _denom.denom === denom)?.image