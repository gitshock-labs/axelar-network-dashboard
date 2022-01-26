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
    url: 'https://axelarscan.io',
    disabled: true,
  },
  {
    id: 'testnet',
    title: 'Testnet',
    icon: <HiCode size={20} className="stroke-current" />,
    url: 'https://testnet.axelarscan.io',
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

export const exercises = [
  {
    id: '4',
    title: 'Exercise 4',
    description: 'Transfer UST tokens from Terra to EVM-compatible chains and back via Terra CLI and Axelar Network CLI.',
  },
  {
    id: '5',
    title: 'Exercise 5',
    description: 'Transfer AXL tokens from Axelar Network to EVM-compatible chains and back via Axelar CLI.',
  },
].map(ex => { return { ...ex, doc_url: `https://docs.axelar.dev/#/Exercises/exercise-${ex?.id}`, submission_url: `https://axelar.knack.com/${process.env.NEXT_PUBLIC_NETWORK}-portal#${process.env.NEXT_PUBLIC_NETWORK}-exercise-${ex?.id}-submission-form/` } })




