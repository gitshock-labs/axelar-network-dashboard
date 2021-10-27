import { FiServer, FiBox, FiFile, FiKey } from 'react-icons/fi'
import { BiWallet } from 'react-icons/bi'
import { RiRadioButtonLine } from 'react-icons/ri'
import { HiCode } from 'react-icons/hi'

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
    id: 'participations',
    title: 'Participations',
    path: '/participations',
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
    icon: <RiRadioButtonLine size={20} className="stroke-current" />,
    url: 'https://axelar.coinhippo.io',
    disabled: true,
  },
  {
    id: 'testnet',
    title: 'Testnet',
    icon: <HiCode size={20} className="stroke-current" />,
    url: 'https://axelar-testnet.coinhippo.io',
  },
]

export const exercises = [
  {
    id: '1',
    title: 'Exercise 1',
    description: 'Transfer BTC to Ethereum (as a wrapped asset) and back via Axelar Network CLI.',
  },
  {
    id: '3',
    title: 'Exercise 3',
    description: 'Transfer BTC to Axelar Network (as a wrapped asset) and back via Axelar Network CLI.',
  },
  {
    id: '4',
    title: 'Exercise 4',
    description: 'Transfer Asset from Cosmos Hub to Axelar Network via Gaia CLI and Axelar Network CLI.',
  },
  {
    id: '5',
    title: 'Exercise 5',
    description: 'Transfer assets from Axelar Network to Ethereum (as a wrapped asset) and back via Axelar Network CLI.',
  },
]