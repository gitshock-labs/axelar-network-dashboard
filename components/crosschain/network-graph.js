import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import G6 from '@antv/g6'

import { chainTitle, getChain } from '../../lib/object/chain'
import { numberFormat } from '../../lib/utils'

export default function NetworkGraph({ data }) {
  const { preferences, cosmos_chains } = useSelector(state => ({ preferences: state.preferences, cosmos_chains: state.cosmos_chains }), shallowEqual)
  const { theme } = { ...preferences }
  const { cosmos_chains_data } = { ...cosmos_chains }

  const [rendered, setRendered] = useState(null)
  const [graph, setGraph] = useState(null)

  useEffect(() => {
    if (rendered && !graph) {
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 20,
        getContent(e) {
          const outDiv = document.createElement('div');
          outDiv.style.width = '180px'
          outDiv.innerHTML = `
            <h4 class="font-semibold -mt-1.5">${e.item.getModel().transfer.asset?.title} transfers</h4>
            <ul class="-mt-0.5">
              <li class="flex items-center space-x-1.5 mb-1">
                <div class="flex items-center space-x-1">
                  <img src="${e.item.getModel().transfer.from_chain?.image}" alt="" class="w-4 h-4 rounded-full" />
                  <span class="font-medium">${e.item.getModel().transfer.from_chain?.short_name}</span>
                </div>
                <span>-></span>
                <div class="flex items-center space-x-1">
                  <img src="${e.item.getModel().transfer.to_chain?.image}" alt="" class="w-4 h-4 rounded-full" />
                  <span class="font-medium">${e.item.getModel().transfer.to_chain?.short_name}</span>
                </div>
              </li>
              <li><span class="font-semibold">Transactions</span>: ${numberFormat(e.item.getModel().transfer.tx, '0,0')}</li>
              <li><span class="font-semibold">Volume</span>: ${numberFormat(e.item.getModel().transfer.amount, e.item.getModel().transfer.amount >= 100000 ? '0,0.00a' : '0,0.000')} ${e.item.getModel().transfer.asset?.symbol}</li>
              <li><span class="font-semibold">Avg. Size</span>: ${numberFormat(e.item.getModel().transfer.avg_amount, e.item.getModel().transfer.avg_amount >= 100000 ? '0,0.00a' : '0,0.000')} ${e.item.getModel().transfer.asset?.symbol}</li>
            </ul>`
          return outDiv
        },
        itemTypes: ['edge'],
      })

      setGraph(new G6.Graph({
        container: 'cross-chain',
        width: 992,
        height: 560,
        fitView: true,
        fitViewPadding: [10, 10, 10, 10],
        fitCenter: true,
        layout: {
          type: 'circular',
          preventOverlap: true,
          linkDistance: 160,
          nodeSpacing: 16,
        },
        defaultNode: {
          size: 48,
        },
        defaultEdge: {
          labelCfg: {
            autoRotate: true,
          },
        },
        modes: {
          default: [
            'drag-canvas',
            // 'zoom-canvas',
            'drag-node',
          ],
        },
        plugins: [tooltip],
      }))
    }
    else {
      setRendered(true)
    }
  }, [rendered])

  useEffect(() => {
    if (data && graph) {
      const nodes = [], edges = [], combos = []
      const labelCfg = {
        style: {
          fill: theme === 'dark' ? '#fff' : '#000',
          fontWeight: 600,
        },
      }
      const style = {
        fill: theme === 'dark' ? '#000' : '#fff',
      }

      const axelarChain = getChain('axelarnet', cosmos_chains_data)
      let _data = []

      for (let i = 0; i < data.length; i++) {
        const transfer = data[i]

        if (!is_cosmos(transfer?.from_chain?.id) && !is_cosmos(transfer?.to_chain?.id)) {
          const from_transfer = _.cloneDeep(transfer)
          from_transfer.to_chain = axelarChain
          from_transfer.id = `${from_transfer.from_chain?.id}_${from_transfer.to_chain?.id}_${from_transfer.asset?.id}`
          _data.push(from_transfer)

          const to_transfer = _.cloneDeep(transfer)
          to_transfer.from_chain = axelarChain
          to_transfer.id = `${to_transfer.from_chain?.id}_${to_transfer.to_chain?.id}_${to_transfer.asset?.id}`
          _data.push(to_transfer)
        }
        else {
          transfer.id = `${transfer.from_chain?.id}_${transfer.to_chain?.id}_${transfer.asset?.id}`
          _data.push(transfer)
        }
      }

      _data = Object.entries(_.groupBy(_data, 'id')).map(([key, value]) => {
        return {
          id: key,
          ..._.head(value),
          tx: _.sumBy(value, 'tx'),
          amount: _.sumBy(value, 'amount'),
          value: _.sumBy(value, 'value'),
          avg_amount: _.mean(value.map(v => v.tx * v.avg_amount)),
          avg_value: _.mean(value.map(v => v.tx * v.avg_value)),
          max_amount: _.maxBy(value, 'max_amount'),
          max_value: _.maxBy(value, 'max_value'),
          since: _.minBy(value, 'since'),
        }
      })

      for (let i = 0; i < _data.length; i++) {
        const transfer = _data[i]

        if (nodes.findIndex(n => n.id === transfer.from_chain?.id) < 0) {
          nodes.push({
            id: transfer.from_chain?.id,
            type: 'image',
            img: transfer.from_chain?.image,
            label: chainTitle(transfer.from_chain),
            labelCfg,
            style,
          })
        }

        if (nodes.findIndex(n => n.id === transfer.to_chain?.id) < 0) {
          nodes.push({
            id: transfer.to_chain?.id,
            type: 'image',
            img: transfer.to_chain?.image,
            label: chainTitle(transfer.to_chain),
            labelCfg,
            style,
          })
        }

        const assets = _data.filter(t => t.from_chain?.id === transfer.from_chain?.id && t.to_chain?.id === transfer.to_chain?.id)
        const index = assets.findIndex(a => a.asset?.id === transfer.asset?.id)

        edges.push({
          transfer,
          id: transfer.id,
          source: transfer.from_chain?.id,
          target: transfer.to_chain?.id,
          type: 'circle-running',
          label: `${numberFormat(transfer.amount, transfer.amount >= 100000 ? '0,0.00a' : '0,0.000')} ${transfer.asset?.symbol}`,
          labelCfg: {
            style: {
              ...labelCfg?.style,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontWeight: 600,
              fontSize: 10,
              textBaseline: 'bottom',
            },
          },
          curveOffset: (index % 2 === 0 ? -1 : 1) * Math.ceil((index + 1) / 2) * 35,
          style: {
            stroke: theme === 'dark' ? '#333' : '#ddd',
          },
        })
      }

      G6.registerEdge(
        'circle-running',
        {
          afterDraw(cfg, group) {
            const shape = group.get('children')[0]
            const startPoint = shape.getPoint(0)

            const circle = group.addShape('circle', {
              attrs: {
                x: startPoint.x,
                y: startPoint.y,
                fill: cfg?.transfer?.from_chain?.color || '#4f46e5',
                r: 3,
              },
              name: 'circle-shape',
            })

            circle.animate(
              (ratio) => {
                const tmpPoint = shape.getPoint(ratio)

                return {
                  x: tmpPoint.x,
                  y: tmpPoint.y,
                }
              },
              {
                repeat: true,
                duration: 3000,
              },
            )
          },
        },
        'quadratic',
      )

      graph.data({ nodes, edges, combos })
      graph.render()
    }
  }, [data, graph, theme])

  const is_cosmos = id => !!getChain(id, cosmos_chains_data)

  return (
    <div className="w-full mb-6">
      <div id="cross-chain" className={`${data?.length > 0 ? 'flex' : 'hidden'} items-center justify-start`} />
    </div>
  )
}