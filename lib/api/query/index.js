import { getRequestUrl } from '../../utils'

const rand = (diff, x = 100) => (diff || 0) + Math.ceil(Math.random(0,1)*x)

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
      {
        "hash":"BFeSKqVOqA6EjVd4u4Suqjs4vn3C2JXh41OzP74n69DmhkNCNh8dGhI5DM15GIAk",
        "proposer":{
          "key":"axelar3cvAMkj7cyWuMu63uQh3iGbyQgTNMbH72GUiTFWo",
          "name":"Validator-a"
        }
      },
      {
        "hash":"d1KnrrcevZttcTzjl4FaXFowXTkTx3EedqOWDwieTJeNFYP7UY92Tik0bfqp1C6s",
        "proposer":{
          "key":"axelarz2ioMOKl6zd9bV2S6cPAmBH8vlIV6jEzpF3AKCq2",
          "name":"Validator-b"
        }
      },
      {
        "hash":"sob4yikLzqZWBg7fKmmtCV8EZXZvctezuFSwj165ze5meEcg5zzgez1yaY0B6vca",
        "proposer":{
          "key":"axelaryuumx3RoRxWt45MwsLsZiGbyQgTNMbH72GUiTFWo",
          "name":"Validator-c"
        }
      },
      {
        "hash":"SZVAI9Jhd5saFGGlYFsf2ns5ywJONEo2t4NSl2CutUSwzgA2m6SLHVKOnoIFfCcj",
        "proposer":{
          "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
          "name":"Validator-d"
        }
      },
      {
        "hash":"JAfzIFOhjK0aE9TT9HHN6Xo47jk8B03uMWkvTDMYelHpZLSxo3nJEKCVN9j4BgLW",
        "proposer":{
          "key":"axelar7wqPJkkrdH2C2o4Gm42liGbyQgTNMbH72GUiTFWo",
          "name":"Validator-e"
        }
      },
      {
        "hash":"7wuimxpfZP6w02yVpF8yWacvS2lJSYKP41EBPCOmQDUuxZHJIeDlAMucOTZoFMfO",
        "proposer":{
          "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
          "name":"Validator-f"
        }
      },
      {
        "hash":"AExW0UMnBv0m0Q6kJdEoEwNA0vV1AH9EU8LhWf5Y14bb2s3Vd3ftKLngngRiWyrI",
        "proposer":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Validator-g"
        }
      },
      {
        "hash":"MwcAzEoiZcRTpXcUZtij8z7tGRjQ5r0aE3dx58o1s6DALXNfnOA4LGHUcwplFEfN",
        "proposer":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Validator-h"
        }
      },
      {
        "hash":"4fyJTb1pAv8rzlywTTpRFeu9I5xDakhtbqRYFf2FsXCqlIKjaM7eul4m9fas4Q0I",
        "proposer":{
          "key":"axelarz2ioMOKl6zd9bV2S6cPAOuez5mj1tL0Wwm6tq5rB",
          "name":"Validator-i"
        }
      },
      {
        "hash":"kR0kWgO2F3B1Bv0MbYmcgmlhCFBcDkg5Mggg8RcOKdylITbktmA7IUsPcn3PJnjM",
        "proposer":{
          "key":"axelardMp5NPaCOSVk3NCMOOMCa1if3VnMm7Fh1sk2CDST",
          "name":"Validator-j"
        }
      },
      {
        "hash":"OqoRwm5DTSg3061Hv26kG1GsrmY5mYhcn9LI4DeCZWNyJLSXB5Be0BtQiuNYOmWw",
        "proposer":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq2lmy91eSxcpoTCfq99bfX",
          "name":"Validator-k"
        }
      },
      {
        "hash":"21ypMSDHl3idCij6z2XJBahyqMprW0U38VQVEGi7QWSLYvSiRGlIRFwwJpQcIuS2",
        "proposer":{
          "key":"axelarbEw50izDR4X4D02Nme44jN7S2Lwms9pasIVkWekz",
          "name":"Validator-l"
        }
      },
      {
        "hash":"nMt4CgyHZltiM6gR564yXLvPhljjC8uJNqiGouQeteYqdiwtqu3Rj0zcnZWYtB4o",
        "proposer":{
          "key":"axelara1if3VnMm7Fh1sk2CDSTPQF7XYgpOlUrKIUyyAgh",
          "name":"Validator-m"
        }
      },
      {
        "hash":"CmUfcjOCZgtdcG8bZJcE1FGNLIvPq1qNqydfkD5EiWoeC4arDQvh5AlUkDqGoE2a",
        "proposer":{
          "key":"axelarFbWOYLqFbD4zm6HOUdPhPQF7XYgpOlUrKIUyyAgh",
          "name":"Validator-n"
        }
      },
      {
        "hash":"68ZRb7lmoSHQe2NKuOrOTVmQeVD5JkbtEJKsed0cZ4L2XWbBm17oH7CnfO1shxiG",
        "proposer":{
          "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
          "name":"Validator-o"
        }
      }
    ].map(b => {
      return { ...b, height: rand(7234324), txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000) }
    })
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
      { tx: '213213jkwdjsfw23iewjdf2j3po3rjef34asvasd', type: 'transfer', status: 'success', from: { key: 'aa30wsdc322324wre9dsfu23904erdsfdar', name: 'Address 1' }, to: { key: '0cxvre543esdfgh6534245654e3wqertdfghj', name: 'ETH Contract' }, symbol: 'axelar', value: 23.2323, fee: 0.00213, gas_price: 0.000034324, gas_used: 123256, gas_limit: 256432, height: 76543456, logs: [{ from: { key: 'aa30wsdc322324wre9dsfu23904erdsfdar', name: 'Address 1' }, to: { key: '7wd77ewd8ds8fd7sfds6f8dsf7dsf', name: 'Stake Pool' }, value: 23.2323 }, { from: { key: '7wd77ewd8ds8fd7sfds6f8dsf7dsf', name: 'Stake Pool' }, to: { key: '3s22c32s2zxc32z3jz2asdasedfgh324', name: 'Validator 1', type: 'validator' }, value: 1.34534 }, { from: { key: '3s22c32s2zxc32z3jz2asdasedfgh324', name: 'Validator 1', type: 'validator' }, to: { key: '0cxvre543esdfgh6534245654e3wqertdfghj', name: 'ETH Contract' }, value: 12.445678 }] }
    ].map(t => {
      return { ...t, time: -rand(-(new Date().getTime()), 10000) }
    })
  }
}

export const getTransaction = async (id, params) => {
  const path = `/transaction/${id}`
  // return await request(path, params)
  return {
    data: (await getTransactions()).data[0]
  }
}

export const getAccount = async (id, params) => {
  const path = `/account/${id}`
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: {
      balances: [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          contract_address: 'x342x2xsd5654wqwdfg345678uhgfds',
          contract_decimals: 18,
          image: null,
          currency: '$',
          balance: 0.2123,
          quote: 9560.34310836,
          quote_rate: 45032.2332,
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'eth',
          contract_address: '0xxfweferge34354224567876543yuiy',
          contract_decimals: 18,
          image: null,
          currency: '$',
          balance: 1.34,
          quote: 4065.872488,
          quote_rate: 3034.2332,
        },
      ]
    }
  }
}

export const getKeygen = async params => {
  const path = '/keygen'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: {
      keygen_participation_threshold: 10,
      active_keygen_threshold: 84.75,
      signing_participation_threshold: 128,
      corruption_signing_threshold: 5.1,
    }
  }
}

export const getKeys = async params => {
  const path = '/keys'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      {
        key: 'axelarkeyOuez5mj1tL0Wwm6tq5rB8djRy',
        time: new Date().getTime() - ((rand() % 10) * 1000000),
        block: rand(7234324),
        validators: [
          {
            key: 'axelar3cvAMkj7cyWuMu63uQh3iGbyQgTNMbH72GUiTFWo',
            share: 24
          },
          {
            key: 'axelarz2ioMOKl6zd9bV2S6cPAmBH8vlIV6jEzpF3AKCq2',
            share: 12
          },      
          {
            key: 'axelaryuumx3RoRxWt45MwsLsZiGbyQgTNMbH72GUiTFWo',
            share: 2
          },    
          {
            key: 'axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0',
            share: 5
          },
          {
            key: 'axelar7wqPJkkrdH2C2o4Gm42liGbyQgTNMbH72GUiTFWo',
            share: 14
          },{
            key: 'axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy',
            share: 12
          },
          {
            key: 'axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3',
            share: 24
          },
          {
            key: 'axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0',
            share: 25
          },
        ],
      },
      {
        key: 'axelarkeyHokoqZenvvJPKE3RKToA8UnfY',
        time: new Date().getTime() - ((rand() % 10) * 1000000),
        block: rand(7234324),
        validators: [
          {
            key: 'axelarz2ioMOKl6zd9bV2S6cPAOuez5mj1tL0Wwm6tq5rB',
            share: 2
          },
          {
            key: 'axelardMp5NPaCOSVk3NCMOOMCa1if3VnMm7Fh1sk2CDST',
            share: 6
          },
          {
            key: 'axelarmBH8vlIV6jEzpF3AKCq2lmy91eSxcpoTCfq99bfX',
            share: 24
          },
          {
            key: 'axelarbEw50izDR4X4D02Nme44jN7S2Lwms9pasIVkWekz',
            share: 25
          },
          {
            key: 'axelara1if3VnMm7Fh1sk2CDSTPQF7XYgpOlUrKIUyyAgh',
            share: 5
          },
          {
            key: 'axelarFbWOYLqFbD4zm6HOUdPhPQF7XYgpOlUrKIUyyAgh',
            share: 5
          },
        ],
      },
      {
        key: 'axelarkeySfE67gnIqfbMEsREpUwwerCt',
        time: new Date().getTime() - ((rand() % 10) * 1000000),
        block: rand(7234324),
        validators: [
          {
            key: 'axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz',
            share: 10
          },
          {
            key: 'axelaraN6rghfhUQ2WFzmZ5uTuFbWOYLqFbD4zm6HOUdPh',
            share: 12
          },
          {
            key: 'axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo',
            share: 20
          },
          {
            key: 'axelarPQF7XYgpOlUrKIUyyAgh6YVR4NYKgDQT5gb3rExj',
            share: 14
          },
          {
            key: 'axelarvgS6085yYCTNAVo2VcMyVmYaiaOpCwGvuzy4ob9S',
            share: 2
          },
          {
            key: 'axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt',
            share: 5
          },
          {
            key: 'axelarDyqbrGjUPISV711IHYTGHLiqRGjA198K2vw78h1M',
            share: 8
          },
          {
            key: 'axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s',
            share: 22
          },
          {
            key: 'axelard1AWeaKVDiFuV5wMItrGyTqbatF6sRKKDhsfxzrc',
            share: 25
          },
        ],
      }
    ]
  }
}

export const getBridgeAccounts = async params => {
  const path = '/bridge-accounts'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      { height: rand(7234324), hash: '01asd7asdj9sadysa0dsa9ysad', txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance' }, },
      { height: rand(7234324), hash: '01asd7asdj9sadysa0dsa9ysad', txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance' }, },
      { height: rand(7234324), hash: '01asd7asdj9sadysa0dsa9ysad', txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance' }, },
      { height: rand(7234324), hash: '01asd7asdj9sadysa0dsa9ysad', txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance' }, },
      { height: rand(7234324), hash: '01asd7asdj9sadysa0dsa9ysad', txs: rand() % 10, time: -rand(-(new Date().getTime()), 10000), proposer: { key: '324esacxz4324vsdkfdsf2f323fs4dsf324', name: 'Binance' }, },
    ]
  }
}