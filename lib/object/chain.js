export const chains = [
  {
    id: 'axelarnet',
    name: 'Axelar',
    image: '/logos/chains/axelar.png',
    hidden: true,
    is_cosmos: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    image: '/logos/chains/bitcoin.png',
    denom: {
      divider: Math.pow(10, 8),
    },
    hidden: true,
  },
  {
    id: 'ethereum',
    evm_id: 'Ethereum',
    name: 'Ethereum',
    image: '/logos/chains/ethereum.png',
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'binance',
    evm_id: 'Binance',
    name: 'Binance',
    image: '/logos/chains/binance.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'terra',
    evm_id: 'Terra',
    name: 'Terra',
    image: '/logos/chains/terra.png',
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
    image: '/logos/chains/avalanche.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'polygon',
    evm_id: 'Polygon',
    name: 'Polygon',
    image: '/logos/chains/polygon.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'fantom',
    evm_id: 'Fantom',
    name: 'Fantom',
    image: '/logos/chains/fantom.png',
    threshold: true,
    denom: {
      divider: Math.pow(10, 6),
    },
  },
  {
    id: 'moonbeam',
    evm_id: 'Moonbeam',
    name: 'Moonbeam',
    image: '/logos/chains/moonbeam.png',
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
