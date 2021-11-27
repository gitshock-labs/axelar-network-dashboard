export const chains = [
  { id: 'axelarnet', name: 'Axelar', image: '/logos/logo.png', hidden: true },
  { id: 'bitcoin', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', evm_id: 'Ethereum', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'terra', evm_id: 'Terra', name: 'Terra', image: 'https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png' },
  { id: 'avalanche', evm_id: 'Avalanche', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png', threshold: true },
  { id: 'fantom', evm_id: 'Fantom', name: 'Fantom', image: 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png' },
  { id: 'polygon', evm_id: 'Fantom', name: 'Polygon', image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
]

export const idFromEvmId = evm_id => chains.find(chain => chain?.evm_id === evm_id)?.id

export const chainName = id => chains.find(chain => chain?.id === id)?.name

export const chainImage = id => chains.find(chain => chain?.id === id)?.image
