export const chains = [
  {
    id: 'axelarnet',
    name: 'Axelar',
    image: '/logos/logo.png',
    hidden: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    denom: {
      divider: Math.pow(10, 8),
    },
  },
  {
    id: 'ethereum',
    evm_id: 'Ethereum',
    name: 'Ethereum',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'terra',
    evm_id: 'Terra',
    name: 'Terra',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png',
    is_cosmos: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'avalanche',
    evm_id: 'Avalanche',
    maintainer_id: 'avalanche',
    name: 'Avalanche',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'polygon',
    evm_id: 'Polygon',
    name: 'Polygon',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'fantom',
    evm_id: 'Fantom',
    name: 'Fantom',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'moonbeam',
    evm_id: 'Moonbeam',
    name: 'Moonbeam',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
]

export const chainName = id => chains.find(chain => chain?.id === id?.toLowerCase())?.name

export const chainImage = id => chains.find(chain => chain?.id === id?.toLowerCase())?.image

export const chainMaintainerId = id => chains.find(chain => chain?.id === id?.toLowerCase())?.maintainer_id || id

export const idFromEvmId = evm_id => chains.find(chain => chain?.evm_id === evm_id)?.id

export const idFromMaintainerId = maintainer_id => chains.find(chain => [chain?.maintainer_id, chain?.id].includes(maintainer_id?.toLowerCase()))?.id

export const chainDenomDivider = id => chains.find(chain => chain?.id === id?.toLowerCase())?.denom?.divider || 1
