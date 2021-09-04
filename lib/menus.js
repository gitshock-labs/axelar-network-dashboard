import { FiServer, FiBox, FiFile, FiKey } from 'react-icons/fi'
import { BiWallet } from 'react-icons/bi'

export const navigations = [
  {
    id: 'validators',
    title: 'Validators',
    path: '/validators',
    icon: <FiServer size={16} className="stroke-current" />,
  },
  {
    id: 'blocks',
    title: 'Blocks',
    path: '/blocks',
    icon: <FiBox size={16} className="stroke-current" />,
  },
  {
    id: 'transactions',
    title: 'Transactions',
    path: '/transactions',
    icon: <FiFile size={16} className="stroke-current" />,
  },
  {
    id: 'keygen',
    title: 'Keygen',
    path: '/keygen',
    icon: <FiKey size={16} className="stroke-current" />,
  },
  {
    id: 'bridge',
    title: 'Bridge Accounts',
    path: '/bridge',
    icon: <BiWallet size={16} className="stroke-current" />,
  },
]

export const networks = [
  {
    id: 'mainnet',
    title: 'Mainnet',
    image: '/logos/networks/mainnet.png',
    url: '/',
  },
  {
    id: 'testnet',
    title: 'Testnet',
    image: '/logos/networks/testnet.png',
    url: '/',
  },
]