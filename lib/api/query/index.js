import { getRequestUrl, rand } from '../../utils'

const api_name = 'data'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_API_URL, path, { ...params, api_name }))
  return await res.json()
}

export const getSummary = async params => {
  const path = '/summary'
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

export const getKeygen = async params => {
  const path = '/keygen'
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

export const bridgeAccounts = async params => {
  const path = '/'

  params = { ...params, name: 'bridge_accounts' }

  return await request(path, params)
}