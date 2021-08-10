import { getRequestUrl } from '../../utils'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params }))
  return await res.json()
}

export const getCoinInfo = async params => {
  const path = '/coin'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: {
      symbol: 'axelar',
      currency: '$',
      price: 13.25,
      market_cap: 512256128.56,
      inflation_percentage: 7,
      community_supply: 10242048,
    }
  }
}

export const getValidators = async params => {
  const path = '/validators'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 49.6, status: 'deregistering' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'inactive' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 50.78, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'deregistering' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'inactive' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 75.5, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 50, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'inactive' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'deregistering' },
    ]
  }
}

export const getBlocks = async params => {
  const path = '/blocks'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { height: 7234324, hash: '01asd7asdj9sadysa0dsa9ysad' }
    ]
  }
}