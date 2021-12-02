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
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    denom: {
      divider: Math.pow(10, 8),
    },
  },
  {
    id: 'ethereum',
    evm_id: 'Ethereum',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'terra',
    evm_id: 'Terra',
    name: 'Terra',
    image: 'https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png',
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'avalanche',
    evm_id: 'Avalanche',
    maintainer_id: 'avalanche2',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'polygon',
    evm_id: 'Polygon',
    name: 'Polygon',
    image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'fantom',
    evm_id: 'Fantom',
    name: 'Fantom',
    image: 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png',
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

export const chainName = id => chains.find(chain => chain?.id === id)?.name

export const chainImage = id => chains.find(chain => chain?.id === id)?.image

export const chainMaintainerId = id => chains.find(chain => chain?.id === id)?.maintainer_id || id

export const idFromEvmId = evm_id => chains.find(chain => chain?.evm_id === evm_id)?.id

export const idFromMaintainerId = maintainer_id => chains.find(chain => [chain?.maintainer_id, chain?.id].includes(maintainer_id))?.id

export const chainDenomDivider = id => chains.find(chain => chain?.id === id)?.denom?.divider || 1
