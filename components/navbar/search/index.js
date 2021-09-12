import { useRouter } from 'next/router'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { FiSearch } from 'react-icons/fi'

export default function Search() {
  const router = useRouter()

  const [inputSearch, setInputSearch] = useState('')

  const { handleSubmit } = useForm()

  const onSubmit = () => {
    if (inputSearch) {
      const hashRegEx = new RegExp(/[0-9A-F]{64}$/, 'igm')
      const validatorRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_VALIDATOR}.*$`, 'igm')
      const accountRegEx = new RegExp(`${process.env.NEXT_PUBLIC_PREFIX_ACCOUNT}.*$`, 'igm')

      const type = !isNaN(inputSearch) ? 'blocks' : inputSearch.match(validatorRegEx) ? 'validator' : inputSearch.match(accountRegEx) ? 'account' : 'tx'

      router.push(`/${type}/${inputSearch}`)
    }
  }

  return (
    <div className="navbar-search mr-1.5 sm:mx-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <input
            value={inputSearch}
            onChange={event => setInputSearch(event.target.value)}
            type="search"
            placeholder="Search by Address / Block / TxHash"
            className="w-60 sm:w-72 xl:w-96 h-8 sm:h-10 appearance-none rounded text-xs pl-2 sm:pl-8 pr-0 sm:pr-3 focus:outline-none"
          />
          <div className="hidden sm:block absolute top-0 left-0 mt-3 ml-2.5">
            <FiSearch size={14} className="stroke-current" />
          </div>
        </div>
      </form>
    </div>
  )
}