import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import G6 from '@antv/g6'

import { chainTitle } from '../../lib/object/chain'
import { numberFormat } from '../../lib/utils'

export default function NetworkGraph({ data }) {
  const { preferences } = useSelector(state => ({ preferences: state.preferences }), shallowEqual)
  const { theme } = { ...preferences }

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
        container: 'crosschain',
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

      for (let i = 0; i < data.length; i++) {
        const transfer = data[i]

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

        const assets = data.filter(t => t.from_chain?.id === transfer.from_chain?.id && t.to_chain?.id === transfer.to_chain?.id)
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
              fontWeight: 500,
              fontSize: 10,
              textBaseline: 'bottom',
            },
          },
          curveOffset: (index % 2 === 0 ? -1 : 1) * (index + 1) * 30,
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
                fill: '#1890ff',
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

  return (
    <div className="w-full mb-6">
      <div id="crosschain" className={`${data?.length > 0 ? 'flex' : 'hidden'} items-center justify-start`} />
    </div>
  )
}