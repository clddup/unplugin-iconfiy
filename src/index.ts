import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import fs from 'node:fs'
import { lookupCollection, lookupCollections } from '@iconify/json'
import { getIcons } from '@iconify/utils'
import { parse } from 'acorn-loose'
import { simple } from 'acorn-walk'
import fg from 'fast-glob'
import { createUnplugin } from 'unplugin'

export const unpluginFactory: UnpluginFactory<Options | undefined> = () => {
  const virtualModuleId = 'virtual:offline-iconify'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  const iconObj: {
    [key: string]: Set<string>
  } = {}

  return {
    name: 'unplugin-iconify-icons',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const icons = await lookupCollections()
        const iconList = Object.keys(icons)
        const files = fg.sync('**/*.{js,jsx,ts,tsx,vue,json,astro}', {
          cwd: 'src',
          stats: true,
          absolute: true,
        })
        files.forEach((item: any) => {
          const code = fs.readFileSync(item.path, 'utf-8')
          const ast = parse.bind(parse)(code, {
            ecmaVersion: 5,
            sourceType: 'module',
            locations: true,
          })
          simple(ast, {
            Literal(node: any) {
              if (node.value) {
                const [iconKey, iconValue] = String(node.value).split(':') || []
                if (iconList.includes(iconKey)) {
                  if (!iconObj[iconKey]) {
                    iconObj[iconKey] = new Set()
                  }
                  iconValue && iconObj[iconKey].add(iconValue)
                }
              }
            },
          })
        })
        const iconListArr: Array<any> = []
        for (const key of Object.keys(iconObj)) {
          if (iconObj[key].size > 0) {
            const item = getIcons(await lookupCollection(key), [...iconObj[key]])
            item && iconListArr.push(item)
          }
        }

        return `
          const iconList = ${JSON.stringify(iconListArr.filter(item => item))}
          const svgNS = 'http://www.w3.org/2000/svg'
          const xlinkNS = 'http://www.w3.org/1999/xlink'
          const svgEl = document.createElementNS(svgNS, 'svg')
          svgEl.setAttribute('id', '__iconfiy_dom__')
          svgEl.setAttribute('xmlns', svgNS)
          svgEl.setAttribute('xmlns:xlink', xlinkNS)
          svgEl.setAttribute('aria-hidden', 'true')
          svgEl.setAttribute('style', 'position: absolute; width: 0px; height: 0px;')
          iconList.forEach(item => {
            for (let item1 in item.icons) {
              const symbol = document.createElementNS(svgNS, 'symbol')
              symbol.setAttribute('id', item.prefix + ':' +item1)
              symbol.setAttribute('viewBox', \`0 0 \${item.icons[item1].width || item.width} \${item.icons[item1].height || item.height}\`)
              symbol.innerHTML = item.icons[item1].body
              svgEl.appendChild(symbol)
            }
          })
          document.body.appendChild(svgEl)
          export default iconList
        `
      }
    },
  }
}
export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
