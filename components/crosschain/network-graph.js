import { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import _ from 'lodash'
import G6 from '@antv/g6'

import { chainName, chainImage } from '../../lib/object/chain'
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
            <h4 class="font-semibold -mt-1.5">${e.item.getModel().data.asset_name} transfers</h4>
            <ul class="-mt-0.5">
              <li class="flex items-center space-x-1.5 mb-1">
                <div class="flex items-center space-x-1">
                  <img src="${e.item.getModel().data.chain_image}" alt="" class="w-4 h-4 rounded-full" />
                  <span class="font-medium">${e.item.getModel().data.chain_name}</span>
                </div>
                <span>-></span>
                <div class="flex items-center space-x-1">
                  ${e.item.getModel().target === 'evms' ? '' : `<img src="${chainImage(e.item.getModel().target)}" alt="" class="w-4 h-4 rounded-full" />`}
                  <span class="font-medium">${chainName(e.item.getModel().target) || 'EVMs'}</span>
                </div>
              </li>
              <li><span class="font-semibold">Transactions</span>: ${numberFormat(e.item.getModel().data.tx, '0,0')}</li>
              <li><span class="font-semibold">Volume</span>: ${numberFormat(e.item.getModel().data.amount, e.item.getModel().data.amount >= 100000 ? '0,0.00a' : '0,0.000')} ${e.item.getModel().data.asset_symbol?.toUpperCase()}</li>
              <li><span class="font-semibold">Avg. Size</span>: ${numberFormat(e.item.getModel().data.avg_amount, e.item.getModel().data.avg_amount >= 100000 ? '0,0.00a' : '0,0.000')} ${e.item.getModel().data.asset_symbol?.toUpperCase()}</li>
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
          type: 'gForce',
          preventOverlap: true,
          linkDistance: 160,
          nodeSpacing: 8,
        },
        defaultNode: {
          size: 60,
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
        const chainAsset = data[i]

        const direction = ['ConfirmDeposit'].includes(chainAsset.transfer_action) ? 'out' : 'in'

        nodes.push({
          id: chainAsset.chain,
          // comboId: direction === 'out' ? undefined : 'evms',
          type: 'image',
          img: chainAsset.chain_image,
          label: chainAsset.chain_name,
          labelCfg,
          style,
        })

        if (direction === 'out') {
          nodes.push({
            id: 'evms',
            label: 'EVMs',
            labelCfg,
            style,
          })
        }

        const assets = data.filter(_chainAsset => _chainAsset.chain === chainAsset.chain)
        const assetIndex = assets.findIndex(_chainAsset => _chainAsset.id === chainAsset.id)

        edges.push({
          data: chainAsset,
          id: chainAsset.id,
          source: chainAsset.chain,
          target: direction === 'out' ? 'evms' : 'axelarnet',
          type: 'circle-running',//assets.length > 1 ? 'quadratic' : 'line',
          label: `${numberFormat(chainAsset.amount, chainAsset.amount >= 100000 ? '0,0.00a' : '0,0.000')} ${chainAsset.asset_symbol?.toUpperCase()}`,
          labelCfg: {
            style: {
              ...labelCfg?.style,
              fontWeight: 400,
              fontSize: 12,
              textBaseline: 'bottom',
            },
          },
          curveOffset: (assetIndex % 2 === 0 ? -1 : 1) * (assetIndex + 1) * 10,
          style: {
            stroke: theme === 'dark' ? '#333' : '#ddd',
            // endArrow: {
            //   path: G6.Arrow.diamond(15, 20, 15),
            //   d: 25,
            //   fill: theme === 'dark' ? '#333' : '#ddd',
            // },
          },
        })
      }

      // combos.push({
      //   id: 'evms',
      //   label: 'EVMs',
      //   labelCfg,
      //   style,
      //   fixSize: 200,
      //   padding: 0,
      // })

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