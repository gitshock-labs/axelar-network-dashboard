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

export const getValidators = async params => {
  const path = '/validators'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      {
        "key":"axelar3cvAMkj7cyWuMu63uQh3iGbyQgTNMbH72GUiTFWo",
        "name":"validator-a",
        "website":"www.validator-a.com",
        "status":"deregistering",
        "deregistering_state":"unbonding"
      },
      {
        "key":"axelarz2ioMOKl6zd9bV2S6cPAmBH8vlIV6jEzpF3AKCq2",
        "name":"validator-b",
        "website":"www.validator-b.com",
        "status":"active"
      },
      {
        "key":"axelaryuumx3RoRxWt45MwsLsZiGbyQgTNMbH72GUiTFWo",
        "name":"validator-c",
        "website":"www.validator-c.com",
        "status":"active"
      },
      {
        "key":"axelar7wqPJkkrdH2C2o4Gm42liGbyQgTNMbH72GUiTFWo",
        "name":"validator-d",
        "website":"www.validator-d.com",
        "status":"active"
      },
      {
        "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
        "name":"validator-e",
        "website":"www.validator-e.com",
        "status":"inactive"
      },
      {
        "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
        "name":"validator-f",
        "website":"www.validator-f.com",
        "status":"active"
      },
      {
        "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
        "name":"validator-g",
        "website":"www.validator-g.com",
        "status":"active"
      },
      {
        "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
        "name":"validator-h",
        "website":"www.validator-h.com",
        "status":"deregistering",
        "deregistering_state":"unbonding"
      },
      {
        "key":"axelarz2ioMOKl6zd9bV2S6cPAOuez5mj1tL0Wwm6tq5rB",
        "name":"validator-i",
        "website":"www.validator-i.com",
        "status":"deregistering",
        "deregistering_state":"unbonded"
      },
      {
        "key":"axelardMp5NPaCOSVk3NCMOOMCa1if3VnMm7Fh1sk2CDST",
        "name":"validator-j",
        "website":"www.validator-j.com",
        "status":"deregistering",
        "deregistering_state":"unbonded"
      },
      {
        "key":"axelarmBH8vlIV6jEzpF3AKCq2lmy91eSxcpoTCfq99bfX",
        "name":"validator-k",
        "website":"www.validator-k.com",
        "status":"active"
      },
      {
        "key":"axelarbEw50izDR4X4D02Nme44jN7S2Lwms9pasIVkWekz",
        "name":"validator-l",
        "website":"www.validator-l.com",
        "status":"inactive"
      },
      {
        "key":"axelara1if3VnMm7Fh1sk2CDSTPQF7XYgpOlUrKIUyyAgh",
        "name":"validator-m",
        "website":"www.validator-m.com",
        "status":"active"
      },
      {
        "key":"axelarFbWOYLqFbD4zm6HOUdPhPQF7XYgpOlUrKIUyyAgh",
        "name":"validator-n",
        "website":"www.validator-n.com",
        "status":"active"
      },
      {
        "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
        "name":"validator-o",
        "website":"www.validator-o.com",
        "status":"inactive"
      },
      {
        "key":"axelaraN6rghfhUQ2WFzmZ5uTuFbWOYLqFbD4zm6HOUdPh",
        "name":"validator-p",
        "website":"www.validator-p.com",
        "status":"deregistering",
        "deregistering_state":"waiting"
      },
      {
        "key":"axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
        "name":"validator-q",
        "website":"www.validator-q.com",
        "status":"inactive"
      },
      {
        "key":"axelarPQF7XYgpOlUrKIUyyAgh6YVR4NYKgDQT5gb3rExj",
        "name":"validator-r",
        "website":"www.validator-r.com",
        "status":"inactive"
      },
      {
        "key":"axelarvgS6085yYCTNAVo2VcMyVmYaiaOpCwGvuzy4ob9S",
        "name":"validator-s",
        "status":"deregistering",
        "deregistering_state":"waiting"
      },
      {
        "key":"axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
        "name":"validator-t",
        "website":"www.validator-t.com",
        "status":"active"
      },
      {
        "key":"axelarDyqbrGjUPISV711IHYTGHLiqRGjA198K2vw78h1M",
        "name":"validator-u",
        "website":"www.validator-u.com",
        "status":"active"
      },
      {
        "key":"axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
        "name":"validator-v",
        "website":"www.validator-v.com",
        "status":"inactive"
      },
      {
        "key":"axelard1AWeaKVDiFuV5wMItrGyTqbatF6sRKKDhsfxzrc",
        "name":"validator-w",
        "website":"www.validator-w.com",
        "status":"deregistering",
        "deregistering_state":"unbonding"
      }
    ].map((v, i) => {
      return {
        ...v,
        start_at: -rand(-(new Date().getTime()), 5000000000),
        image: randImage(),
        voting_power: Math.abs(rand(2134521 - (i * rand(50000)))),
        voting_power_percentage: Math.abs(rand(2134521 - (i * rand(50000))) * 100) / rand(2034521 * 10),
        commission_percenteage: rand() / 10 + rand() / 100,
        success_rate_percentage: rand(30, 30) + rand(0, 30) + rand() / 100,
        validator_pool_share_percentage: rand() / 10 + rand() / 100,
        network_share_percentage: rand() / 10 + rand() / 100,
        delegations: rand(100, 150),
        self_delegation_ratio: rand(30, 30) + rand(0, 30) + rand() / 100,
        self_delegation: rand(1000, 2000),
        symbol: 'axelar',
        delegator_shares: rand(14050490, 10203460) + rand() / 100,
        proposer_priority: rand(312990, 328360),
        tokens: rand(14012990, 14833460) + rand() / 100,
        uptime: rand(30, 30) + rand(0, 30) + rand() / 100,
      }
    })
  }
}

export const getValidator = async (id, params) => {
  const path = `/validators/${id}`
  // return await request(path, params)
  return {
    data: (await getValidators()).data.filter(validator => validator.key === id)[0] || (await getValidators()).data[0]
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

export const getTransactions = async params => {
  const path = '/transactions'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      {
        "tx": "10252A472BAA4E2E91735F047284BB6CAF95CE3A8B4301F4661BF207E503F81E",
        "type": "btc transfer",
        "status": "success",
        "vote": "approved",
        "from": {
          "key": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
          "name": "Address 1"
        },
        "to": {
          "key": "axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name": "Address 2"
        },
        "symbol": "axelar",
        "value": 23.2323,
        "fee": 0.00213,
        "gas_price": 0.000034324,
        "gas_used": 123256,
        "gas_limit": 256432,
        "height": 76543456,
        "logs": [
          {
            "from": {
              "key": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name": "Address 1"
            },
            "to": {
              "key": "axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name": "bridge account address"
            },
            "value": 23.2323
          },
          {
            "from":{
              "key": "axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name": "bridge account address"
            },
            "to": {
              "key": "axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name": "Validator 1",
              "type": "validator"
            },
            "value": 1.34534
          },
          {
            "from": {
              "key": "axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name": "Validator 1",
              "type": "validator"
            },
            "to": {
              "key": "axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name": "Address 2"
            },
            "value": 12.445678
          }
        ]
      },
      {
        "tx": "14E25368B56864812AB2074A95EDDF7EED8ACE419F1D1787DEA2552C94E885B8",
        "type": "delegate",
        "status": "success",
        "vote": "approved",
        "from": {
          "key": "axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name": "Address 3"
        },
        "to": {
          "key": "axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name": "Address 4"
        },
        "symbol": "axelar",
        "value": 223.34323,
        "fee": 0.00233,
        "gas_price": 0.00023724,
        "gas_used": 123236,
        "gas_limit": 253432,
        "height": 4343456,
        "logs": [
          {
            "from": {
              "key": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name": "Delegator Address"
            },
            "to": {
              "key": "axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name": "Validator Address"
            },
            "value": 23.2323
          }
        ]
      },
      {
        "tx": "3FEEC13566645818F08707F194A61277E61A70CFF13DE05756751AF9719D5951",
        "type": "undelegate",
        "status": "fail",
        "vote": "denied",
        "from": {
          "key": "axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name": "Delegator Address"
        },
        "to": {
          "key": "axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name": "Validator Address"
        },
        "symbol": "axelar",
        "value": 723.34323,
        "fee": 0.00233,
        "gas_price": 0.00023324,
        "gas_used": 123236,
        "gas_limit": 253432,
        "height": 5343456,
        "logs": [
          {
            "from": {
              "key": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name": "Validator Address"
            },
            "to": {
              "key": "axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name": "Delegator Address"
            },
            "value": 132.875
          }
        ]
      },
      {
        "tx": "2FD3F6395C5544CE4234CCDD1C282270EA354FD3D4A531DFD8A294224DF52199",
        "type": "get reward",
        "status": "success",
        "vote": "approved",
        "from": {
          "key": "axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
          "name": "Delegator Address"
        },
        "to": {
          "key": "axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name": "Validator Address"
        },
        "symbol": "axelar",
        "value": 73.2523,
        "fee": 0.00183,
        "gas_price": 0.000054324,
        "gas_used": 123256,
        "gas_limit": 256432,
        "height": 76543456,
        "logs": [
          {
            "from": {
              "key": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name": "Delegator Address"
            },
            "to": {
              "key": "axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name": "Validator Address"
            },
            "value": 132.875
          }
        ]
      },
      {
        "tx": "D2D537A3D10A54363F2BA1AD3DF79E33D3E3DECA9AE5776A28275D8CF954DDA0",
        "type": "btc transfer",
        "status": "success",
        "vote": "approved",
        "from": {
          "key": "axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
          "name": "Address 6"
        },
        "to": {
          "key": "axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
          "name": "Address 7"
        },
        "symbol": "axelar",
        "value": 23.2323,
        "fee": 0.00213,
        "gas_price": 0.000034324,
        "gas_used": 123256,
        "gas_limit": 256432,
        "height": 76543456,
        "logs": [
          {
            "from": {
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"10252A472BAA4E2E91735F047284BB6CAF95CE3A8B4301F4661BF207E503F81E",
        "type":"btc transfer",
        "status":"success",
        "vote": "denied",
        "from":{
          "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
          "name":"Address 1"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Address 2"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"14E25368B56864812AB2074A95EDDF7EED8ACE419F1D1787DEA2552C94E885B8",
        "type":"delegate",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Address 3"
        },
        "to":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Address 4"
        },
        "symbol":"axelar",
        "value":223.34323,
        "fee":0.00233,
        "gas_price":0.00023724,
        "gas_used":123236,
        "gas_limit":253432,
        "height":4343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":23.2323
          }
        ]
      },
      {
        "tx":"3FEEC13566645818F08707F194A61277E61A70CFF13DE05756751AF9719D5951",
        "type":"undelegate",
        "status":"fail",
        "vote": "approved",
        "from":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":723.34323,
        "fee":0.00233,
        "gas_price":0.00023324,
        "gas_used":123236,
        "gas_limit":253432,
        "height":5343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Validator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Delegator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"2FD3F6395C5544CE4234CCDD1C282270EA354FD3D4A531DFD8A294224DF52199",
        "type":"get reward",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":73.2523,
        "fee":0.00183,
        "gas_price":0.000054324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"D2D537A3D10A54363F2BA1AD3DF79E33D3E3DECA9AE5776A28275D8CF954DDA0",
        "type":"btc transfer",
        "status":"success",
        "vote": "denied",
        "from":{
          "key":"axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
          "name":"Address 6"
        },
        "to":{
          "key":"axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
          "name":"Address 7"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"10252A472BAA4E2E91735F047284BB6CAF95CE3A8B4301F4661BF207E503F81E",
        "type":"btc transfer",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
          "name":"Address 1"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Address 2"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"14E25368B56864812AB2074A95EDDF7EED8ACE419F1D1787DEA2552C94E885B8",
        "type":"delegate",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Address 3"
        },
        "to":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Address 4"
        },
        "symbol":"axelar",
        "value":223.34323,
        "fee":0.00233,
        "gas_price":0.00023724,
        "gas_used":123236,
        "gas_limit":253432,
        "height":4343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":23.2323
          }
        ]
      },
      {
        "tx":"3FEEC13566645818F08707F194A61277E61A70CFF13DE05756751AF9719D5951",
        "type":"undelegate",
        "status":"fail",
        "vote": "denied",
        "from":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":723.34323,
        "fee":0.00233,
        "gas_price":0.00023324,
        "gas_used":123236,
        "gas_limit":253432,
        "height":5343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Validator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Delegator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"2FD3F6395C5544CE4234CCDD1C282270EA354FD3D4A531DFD8A294224DF52199",
        "type":"get reward",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":73.2523,
        "fee":0.00183,
        "gas_price":0.000054324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"D2D537A3D10A54363F2BA1AD3DF79E33D3E3DECA9AE5776A28275D8CF954DDA0",
        "type":"btc transfer",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
          "name":"Address 6"
        },
        "to":{
          "key":"axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
          "name":"Address 7"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"10252A472BAA4E2E91735F047284BB6CAF95CE3A8B4301F4661BF207E503F81E",
        "type":"btc transfer",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
          "name":"Address 1"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Address 2"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"14E25368B56864812AB2074A95EDDF7EED8ACE419F1D1787DEA2552C94E885B8",
        "type":"delegate",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Address 3"
        },
        "to":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Address 4"
        },
        "symbol":"axelar",
        "value":223.34323,
        "fee":0.00233,
        "gas_price":0.00023724,
        "gas_used":123236,
        "gas_limit":253432,
        "height":4343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":23.2323
          }
        ]
      },
      {
        "tx":"3FEEC13566645818F08707F194A61277E61A70CFF13DE05756751AF9719D5951",
        "type":"undelegate",
        "status":"fail",
        "vote": "approved",
        "from":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":723.34323,
        "fee":0.00233,
        "gas_price":0.00023324,
        "gas_used":123236,
        "gas_limit":253432,
        "height":5343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Validator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Delegator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"2FD3F6395C5544CE4234CCDD1C282270EA354FD3D4A531DFD8A294224DF52199",
        "type":"get reward",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":73.2523,
        "fee":0.00183,
        "gas_price":0.000054324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"D2D537A3D10A54363F2BA1AD3DF79E33D3E3DECA9AE5776A28275D8CF954DDA0",
        "type":"btc transfer",
        "status":"success",
        "vote": "denied",
        "from":{
          "key":"axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
          "name":"Address 6"
        },
        "to":{
          "key":"axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
          "name":"Address 7"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"10252A472BAA4E2E91735F047284BB6CAF95CE3A8B4301F4661BF207E503F81E",
        "type":"btc transfer",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
          "name":"Address 1"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Address 2"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      },
      {
        "tx":"14E25368B56864812AB2074A95EDDF7EED8ACE419F1D1787DEA2552C94E885B8",
        "type":"delegate",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Address 3"
        },
        "to":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Address 4"
        },
        "symbol":"axelar",
        "value":223.34323,
        "fee":0.00233,
        "gas_price":0.00023724,
        "gas_used":123236,
        "gas_limit":253432,
        "height":4343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":23.2323
          }
        ]
      },
      {
        "tx":"3FEEC13566645818F08707F194A61277E61A70CFF13DE05756751AF9719D5951",
        "type":"undelegate",
        "status":"fail",
        "vote": "denied",
        "from":{
          "key":"axelarv4oOwzVuac8gJykpyBZJFcTovyTWD2tIgcF8uGK0",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":723.34323,
        "fee":0.00233,
        "gas_price":0.00023324,
        "gas_used":123236,
        "gas_limit":253432,
        "height":5343456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Validator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Delegator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"2FD3F6395C5544CE4234CCDD1C282270EA354FD3D4A531DFD8A294224DF52199",
        "type":"get reward",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelar6UX1JKVmcSq6RNYn5pG5uobmZ7X7LPcwCXaHBl9s",
          "name":"Delegator Address"
        },
        "to":{
          "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
          "name":"Validator Address"
        },
        "symbol":"axelar",
        "value":73.2523,
        "fee":0.00183,
        "gas_price":0.000054324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Delegator Address"
            },
            "to":{
              "key":"axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
              "name":"Validator Address"
            },
            "value":132.875
          }
        ]
      },
      {
        "tx":"D2D537A3D10A54363F2BA1AD3DF79E33D3E3DECA9AE5776A28275D8CF954DDA0",
        "type":"btc transfer",
        "status":"success",
        "vote": "approved",
        "from":{
          "key":"axelarKg9cao8KYcy54cmqCly8iGbyQgTNMbH72GUiTFWo",
          "name":"Address 6"
        },
        "to":{
          "key":"axelar4hWrv3kxZgeKHpQMrnSGdFGRYy4RxbH3TTr8Awwt",
          "name":"Address 7"
        },
        "symbol":"axelar",
        "value":23.2323,
        "fee":0.00213,
        "gas_price":0.000034324,
        "gas_used":123256,
        "gas_limit":256432,
        "height":76543456,
        "logs":[
          {
            "from":{
              "key":"axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
              "name":"Address 1"
            },
            "to":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "value":23.2323
          },
          {
            "from":{
              "key":"axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
              "name":"bridge account address"
            },
            "to":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "value":1.34534
          },
          {
            "from":{
              "key":"axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
              "name":"Validator 1",
              "type":"validator"
            },
            "to":{
              "key":"axelarxxkueklal9vejv9unqu80w9vptyepfa95pd53u",
              "name":"Address 2"
            },
            "value":12.445678
          }
        ]
      }
    ].map(t => {
      return { ...t, time: -rand(-(new Date().getTime()), 10000), from: { ...t.from, image: randImage() }, to: { ...t.to, image: randImage() }, logs: t.logs.map(l => { return { ...l, image: randImage() } }) }
    })
  }
}

export const getDelegations = async params => {
  const path = '/delegations'
  // return await request(path, params)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    data: [
      {
        "address": "axelar15v50ymp6n5dn73erkqtmq0u8adpl8d3ujv2e74",
        "amount": 123.324,
        "symbol": "axelar"
      },
      {
        "address": "axelarmBH8vlIV6jEzpF3AKCq23cvAMkj7cyWuMu63uQh3",
        "amount": 13.394,
        "symbol": "axelar"
      },
      {
        "address": "axelardMp5NPaCOSVk3NCMOOMCjN7S2Lwms9pasIVkWekz",
        "amount": 23.18,
        "symbol": "axelar"
      },  
      {
        "address": "axelarD4Wap9tfzMKENH3g2POdFcTovyTWD2tIgcF8uGK0",
        "amount": 38.24,
        "symbol": "axelar"
      },
      {
        "address": "axelarwy2x1TeW9TyhNbLAngS7DpgnNzALTVMsIcvOzRFy",
        "amount": 93.26,
        "symbol": "axelar"
      }
    ]
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