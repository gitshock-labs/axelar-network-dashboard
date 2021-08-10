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
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 49.6, status: 'deregistering', deregistering_state: 'unbonding' },
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
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'deregistering', deregistering_state: 'unbonded' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'inactive' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 75.5, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 50, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'inactive' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' },
      { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'deregistering', deregistering_state: 'waiting' },
    ]
  }
}

export const getBlocks = async params => {
  const path = '/blocks'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
      { height: 7234324 + Math.ceil(Math.random(0,1)*100), hash: '01asd7asdj9sadysa0dsa9ysad', txs: Math.ceil(Math.random(0,1)*100) % 10, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 1000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance', voting_power: 2134521, voting_power_percentage: 12.534, commission_percenteage: 10.5, uptime: 80, status: 'active' }, },
    ]
  }
}

export const getBlock = async (id, params) => {
  const path = `/blocks/${id}`
  // return await request(path, params)
  return {
    data: (await getBlocks()).data[0]
  }
}

export const getTransactions = async params => {
  const path = '/transactions'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { tx: '213213jkwdjsfw23iewjdf2j3po3rjef34asvasd', type: 'transfer', status: 'success', from: { key: 'aa30wsdc322324wre9dsfu23904erdsfdar', name: 'Address 1' }, to: { key: '0cxvre543esdfgh6534245654e3wqertdfghj', name: 'ETH Contract' }, symbol: 'axelar', value: 23.2323, fee: 0.00213, gas_price: 0.000034324, gas_used: 123256, gas_limit: 256432, height: 76543456, time: new Date().getTime() - ((Math.ceil(Math.random(0,1)*100) % 10) * 10000), logs: [{ from: { key: 'aa30wsdc322324wre9dsfu23904erdsfdar', name: 'Address 1' }, to: { key: '7wd77ewd8ds8fd7sfds6f8dsf7dsf', name: 'Stake Pool' }, value: 23.2323 }, { from: { key: '7wd77ewd8ds8fd7sfds6f8dsf7dsf', name: 'Stake Pool' }, to: { key: '3s22c32s2zxc32z3jz2asdasedfgh324', name: 'Validator 1', type: 'validator' }, value: 1.34534 }, { from: { key: '3s22c32s2zxc32z3jz2asdasedfgh324', name: 'Validator 1', type: 'validator' }, to: { key: '0cxvre543esdfgh6534245654e3wqertdfghj', name: 'ETH Contract' }, value: 12.445678 }] }
    ]
  }
}

export const getTransaction = async (id, params) => {
  const path = `/transaction/${id}`
  // return await request(path, params)
  return {
    data: (await getTransactions()).data[0]
  }
}