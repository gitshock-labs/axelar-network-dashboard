import { networks } from '../../../lib/menus'

export default function Networks({ handleDropdownClick }) {
  return (
    <>
      <div className="dropdown-title">Change Network</div>
      <div className="flex flex-wrap pb-1">
        {networks.map((item, i) => (
          <a
            key={i}
            href={item.url}
            onClick={handleDropdownClick}
            className="dropdown-item w-1/2 flex items-center justify-start space-x-2 p-2"
          >
            <img
              src={item.image}
              alt=""
              className="w-4 h-4"
            />
            <span className="text-xs">{item.title}</span>
          </a>
        ))}
      </div>
    </>
  )
}