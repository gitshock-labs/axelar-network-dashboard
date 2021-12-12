import Link from 'next/link'
import { useRouter } from 'next/router'

import { navigations } from '../../../lib/menus'

export default function Navigation() {
  const router = useRouter()
  const { pathname } = { ...router }

  return (
    <div className="hidden lg:flex items-center space-x-0 xl:space-x-2 mx-auto">
      {navigations.map((item, i) => (
        <Link key={i} href={item.path}>
          <a className={`bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 rounded flex items-center uppercase text-xs lg:text-2xs xl:text-xs space-x-1 p-2 ${pathname === item.path ? 'text-gray-900 hover:text-gray-800 dark:text-gray-100 dark:hover:text-gray-200 font-bold' : 'text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100 font-medium'}`}>
            <span className="mb-0.5">{item.icon}</span>
            <span>{item.title}</span>
          </a>
        </Link>
      ))}
    </div>
  )
}