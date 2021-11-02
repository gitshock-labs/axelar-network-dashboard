import { useState, useEffect } from 'react'

import StackGrid from 'react-stack-grid'
import moment from 'moment'
import _ from 'lodash'

import Widget from '../widget'
import Copy from '../copy'

import { bridgeAccounts as getBridgeAccounts } from '../../lib/api/query'
import { axelard } from '../../lib/api/executor'
import { randImage } from '../../lib/utils'

export default function Bridge() {
  const [bridgeAccounts, setBridgeAccounts] = useState(null)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      if (!controller.signal.aborted) {
        const response = await getBridgeAccounts()

        let data = (response || []).map((bridgeAccount, i) => {
          return {
            ...bridgeAccount,
            image: bridgeAccount.image || randImage(i),
            exec_cmds: bridgeAccount.cmds && bridgeAccount.cmds.filter(cmd => cmd).map((cmd, j) => {
              return {
                cmd,
                result: bridgeAccounts && bridgeAccounts.data && bridgeAccounts.data.findIndex(_bridgeAccount => _bridgeAccount.id === bridgeAccount.id) > -1 ?
                  bridgeAccounts.data[bridgeAccounts.data.findIndex(_bridgeAccount => _bridgeAccount.id === bridgeAccount.id)].exec_cmds[j].result
                  :
                  null,
              }
            }),
          }
        })

        setBridgeAccounts({ data })

        for (let i = 0; i < data.length; i++) {
          if (!controller.signal.aborted) {
            const bridgeAccount = data[i]

            if (bridgeAccount && bridgeAccount.exec_cmds) {
              for (let j = 0; j < bridgeAccount.exec_cmds.length; j++) {
                const exec_cmd = bridgeAccount.exec_cmds[j]

                const execResponse = await axelard({ cmd: exec_cmd.cmd, cache: true })

                if (execResponse && execResponse.data && execResponse.data.stdout) {
                  exec_cmd.result = execResponse.data.stdout
                }
                else if (execResponse && execResponse.data && execResponse.data.stderr) {
                  exec_cmd.result = execResponse.data.stderr
                }
                else {
                  exec_cmd.result = ''
                }

                bridgeAccount.exec_cmds[j] = exec_cmd
                data[i] = bridgeAccount

                setBridgeAccounts({ data })
              }
            }
          }
        }
      }
    }

    getData()

    const interval = setInterval(() => getBridgeAccounts(), 5 * 60 * 1000)
    return () => {
      controller?.abort()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const run = async () => setTimer(moment().unix())

    if (!timer) {
      run()
    }

    const interval = setInterval(() => run(), 0.5 * 1000)
    return () => clearInterval(interval)
  }, [timer])

  const widgets = (bridgeAccounts ?
    bridgeAccounts.data && bridgeAccounts.data.map((bridgeAccount, i) => { return { ...bridgeAccount, i } })
    :
    [...Array(15).keys()].map(i => { return { i, skeleton: true } })
  ).map((bridgeAccount, i) => (
    <Widget key={i}>
      {!bridgeAccount.skeleton ?
        <div className="space-y-2 mb-1.5">
          <div className="flex items-center space-x-2">
            <img
              src={bridgeAccount.image}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span className={`${bridgeAccount.name ? 'capitalize' : 'uppercase'} text-lg font-semibold my-0.5`}>{bridgeAccount.name || bridgeAccount.id}</span>
          </div>
          <div className="flex flex-col space-y-2">
            {bridgeAccount.exec_cmds && bridgeAccount.exec_cmds.map((exec_cmd, j) => (
              <div key={j} className="bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col space-y-2 p-3">
                <div className="flex items-start text-gray-400 text-xs font-light space-x-1">
                  <span>>_</span>
                  <span>{exec_cmd.cmd}</span>
                </div>
                {typeof exec_cmd.result === 'string' ?
                  exec_cmd.result && exec_cmd.result.includes('\n') ?
                    <div>
                      {exec_cmd.result.split('\n').filter((result, k) => exec_cmd.result.toLowerCase().includes('error') ? k < 1 : true).map((result, k) => (
                        <div key={k} className="break-all text-gray-500 dark:text-white text-xs font-medium">{result}</div>
                      ))}
                    </div>
                    :
                    <span className="break-all text-gray-500 dark:text-white text-xs font-medium">{exec_cmd.result || 'N/A'}</span>
                  :
                  <div className="skeleton w-60 h-4" />
                }
              </div>
            ))}
          </div>
        </div>
        :
        <div className="space-y-2 mb-1.5">
          <div className="flex items-center space-x-2">
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton w-28 h-5 my-1.5" />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="space-y-2">
              <div className="skeleton w-60 h-4" />
              <div className="skeleton w-48 h-4" />
            </div>
            <div className="space-y-2">
              <div className="skeleton w-60 h-4" />
              <div className="skeleton w-48 h-4" />
            </div>
          </div>
        </div>}
    </Widget>
  ))

  return (
    <>
      <StackGrid
        columnWidth={460}
        gutterWidth={12}
        gutterHeight={12}
        className="hidden sm:block"
      >
        {widgets}
      </StackGrid>
      <div className="block sm:hidden space-y-3">
        {widgets}
      </div>
    </>
  )
}