import { getRequestUrl } from '../../utils'

const rand = (diff, x = 100) => (diff || 0) + Math.ceil(Math.random(0,1)*x)

export const randImage = i => `/logos/addresses/${((i || rand()) % 8) + 1}.png`

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params }))
  return await res.json()
}

export const getSummary = async params => {
  const path = '/summary'
  // return await request(path, params)
  return {
    data: {
      block_height: rand(7234324),
      block_height_at: new Date().getTime(),
      avg_block_time: 5.19 + rand() / 100,
      active_validators: 18,
      total_validators: 32,
      online_voting_power_now: '35.02m',
      online_voting_power_now_percentage: 3.5,
      total_voting_power: '1.00b',
      corruption_signing_threshold: 5.1,
    }
  }
}

export const getUptime = async (id, params) => {
  const path = `/validators/${id}`
  // return await request(path, params)
  const latestBlock = rand(7234324)
  return {
    data: [...Array(250).keys()].map(i => {
      return {
        height: latestBlock - i,
        approved: rand() % 8,
        denied: rand() % 2,
      }
    })
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
          image: randImage(),
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
          image: randImage(),
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
    ].filter(key => params && params.address ? key.validators.findIndex(validator => validator.key === params.address) > -1 : true)
  }
}

export const getBridgeAccounts = async params => {
  const path = '/bridge-accounts'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      {
        "name":"bitcoin",
        "website":"https://bitcoin.org/en",
        "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
        "bridge_account":[
          {
            "master_key":"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
          },
          {
            "secondary_key":"bc1qhvy2kgdygjrsqty76n0yrf2493p83kkfjhx0w89i"
          }
        ]
      },
      {
        "name":"ethereum",
        "website":"https://ethereum.org/en",
        "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        "gateway_address":[
          {
            "contract":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy"
          }
        ],
        "token_address":[
          {
            "address":"0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
          }
        ]
      },
      {
        "name":"avalanche",
        "website":"https://www.avax.network",
        "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
        "gateway_address":[
          {
            "contract":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u"
          }
        ],
        "token_address":[
          {
            "address":"0x1ce0c2827e2ef14d5c4f29a091d735a204794041"
          }
        ]
      },
      {
        "name":"moonbeam",
        "website":"https://moonbeam.network/",
        "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png",
        "gateway_address":[
          {
            "contract":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy"
          }
        ],
        "token_address":[
          {
            "address":"0x111111111117dc0aa78b770fa6a738034120c302"
          }
        ]
      }
    ]
  }
}