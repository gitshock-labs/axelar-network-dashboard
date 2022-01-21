import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

import { Img } from 'react-image'

export default function Logo() {
  const { data, preferences } = useSelector(state => ({ data: state.data, preferences: state.preferences }), shallowEqual)
  const { status_data } = { ...data }
  const { theme } = { ...preferences }

  return (
    <div className="logo ml-2.5 mr-1 sm:mx-3">
      <Link href="/">
        <a className="w-full flex items-center">
          <div className="sm:mr-3">
            <Img
              src={`/logos/logo${theme === 'dark' ? '_white' : ''}.png`}
              alt=""
              className="w-8 h-8"
            />
          </div>
          <div className="hidden sm:block lg:block xl:block">
            <div className="normal-case text-sm font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</div>
            {status_data?.chain_id && (
              <div className="text-gray-400 dark:text-gray-600 text-xs">{status_data.chain_id}</div>
            )}
          </div>
        </a>
      </Link>
    </div>
  )
}