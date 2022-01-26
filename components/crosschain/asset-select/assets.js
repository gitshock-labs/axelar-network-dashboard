import { randImage } from '../../../lib/utils'

export default function Assets({ assets, handleDropdownClick }) {
  return (
    <div className="flex flex-wrap py-1">
      {assets?.map((item, i) => (
        <div
          key={i}
          onClick={() => handleDropdownClick(item.id)}
          className="dropdown-item w-full cursor-pointer flex items-center justify-start space-x-1.5 p-2"
        >
          <span className="uppercase text-gray-900 dark:text-gray-100 text-xs font-semibold">
            ${item.asset_symbol}
          </span>
          <span className="text-gray-400 dark:text-gray-600 text-xs font-normal">on</span>
          <img
            src={item.chain_image || randImage(i)}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
            {item.chain_name}
          </span>
        </div>
      ))}
    </div>
  )
}