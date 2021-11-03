import { randImage } from '../../../lib/utils'

export default function Contracts({ contracts, handleDropdownClick }) {
  return (
    <div className="flex flex-wrap py-1">
      {contracts?.map((item, i) => (
        <div
          key={i}
          onClick={() => handleDropdownClick(item.contract_name)}
          className="dropdown-item w-full cursor-pointer flex items-center justify-start space-x-1.5 p-2"
        >
          <img
            src={item.image || randImage(i)}
            alt=""
            className="w-5 h-5 rounded-full"
          />
          <span className="uppercase text-xs font-semibold">{item.name}</span>
        </div>
      ))}
    </div>
  )
}