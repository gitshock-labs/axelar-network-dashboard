import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { numberFormat, ellipseAddress } from '../../lib/utils'

export default function Uptime({ data }) {
  return (
    <Widget
      title={<span className="text-gray-900 dark:text-white text-lg font-semibold">Uptime</span>}
      description={data ?
        <span>
          {data.balances && data.balances[0] && data.balances[0].currency}
          {numberFormat(_.sumBy(data.balances, 'quote'), `0,0.000${Math.abs(_.sumBy(data.balances, 'quote')) < 0.001 ? '000' : ''}`)}
        </span>
        :
        <div className="skeleton w-20 h-3 mt-1" />
      }
    >
    </Widget>
  )
}