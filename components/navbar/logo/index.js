import Link from 'next/link'
import { useSelector, shallowEqual } from 'react-redux'

export default function Logo() {
  const { data } = useSelector(state => ({ data: state.data }), shallowEqual)
  const { status_data } = { ...data }

  return (
    <div className="logo ml-2.5 mr-1 sm:mx-3">
      <Link href="/">
        <a className="w-full flex items-center space-x-0 sm:space-x-3 lg:space-x-0 xl:space-x-4">
          <img
            src="/logos/logo.png"
            alt=""
            className="w-8 xl:w-10 h-8 xl:h-10 rounded-full"
          />
          <div className="hidden sm:block lg:block xl:block">
            <div className="uppercase text-sm font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</div>
            {status_data?.chain_id && (
              <div className="text-gray-400 dark:text-gray-500 text-2xs">{status_data.chain_id}</div>
            )}
          </div>
        </a>
      </Link>
    </div>
  )
}