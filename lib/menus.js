import { FiBox, FiHardDrive } from 'react-icons/fi'
import { AiOutlineTrophy } from 'react-icons/ai'
import { BiServer, BiFileBlank, BiNetworkChart, BiWallet } from 'react-icons/bi'
import { RiRadioButtonLine } from 'react-icons/ri'
import { MdOutlineHowToVote } from 'react-icons/md'
import { HiCode } from 'react-icons/hi'

export const navigations = [
  {
    id: 'validators',
    title: 'Validators',
    path: '/validators',
    icon: <BiServer size={16} className="stroke-current" />,
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
    icon: <BiFileBlank size={16} className="stroke-current -mr-0.5" />,
  },
  {
    id: 'crosschain',
    title: 'Cross-chain',
    path: '/crosschain',
    icon: <BiNetworkChart size={16} className="stroke-current" />,
  },
  {
    id: 'participations',
    title: 'Participations',
    path: '/participations',
    icon: <MdOutlineHowToVote size={16} className="stroke-current" />,
  },
  {
    id: 'bridge',
    title: 'Bridge Accounts',
    path: '/bridge-accounts',
    icon: <BiWallet size={16} className="stroke-current" />,
  },
]

export const networks = [
  {
    id: 'mainnet',
    title: 'Mainnet',
    icon: <RiRadioButtonLine size={20} className="stroke-current" />,
    url: process.env.NEXT_PUBLIC_SITE_URL?.replace('testnet.', ''),
  },
  {
    id: 'testnet',
    title: 'Testnet',
    icon: <HiCode size={20} className="stroke-current" />,
    url: process.env.NEXT_PUBLIC_SITE_URL?.replace('://', `://${process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'testnet.' : ''}`),
  },
]

export const leaderboardNavigations = [
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    path: '/validators/leaderboard',
    icon: <AiOutlineTrophy size={16} className="stroke-current" />,
  },
  {
    id: 'snapshots',
    title: 'Snapshots',
    path: '/validators/snapshots',
    icon: <FiHardDrive size={16} className="stroke-current" />,
  },
]
