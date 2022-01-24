import { useSelector, shallowEqual } from 'react-redux'

import moment from 'moment'
import { FaHeart } from 'react-icons/fa'

export default function Footer() {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

  return (
    <div className={`footer flex flex-col md:flex-row items-center text-xs font-light space-y-2 sm:space-y-0 p-3 ${theme}`}>
      <span className="hidden md:block w-full md:w-1/3 flex items-center justify-center md:justify-start text-gray-400">
      </span>
      <span className="hidden md:block w-full md:w-1/3 flex items-center justify-center text-gray-400">
      </span>
      <span className="w-full md:w-1/3 flex items-center justify-center md:justify-end text-gray-400 space-x-1">
        <span>© {moment().format('YYYY')} made with</span>
        <FaHeart className="text-red-400 text-xl" />
        <span>by <span className="font-semibold">{process.env.NEXT_PUBLIC_TEAM_NAME}</span> team.</span>
      </span>
    </div>
  )
}