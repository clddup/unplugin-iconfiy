import fs from 'node:fs'
import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import fg from 'fast-glob'
import { getIcons } from '@iconify/utils'
import { lookupCollection, lookupCollections } from '@iconify/json'

export const unpluginFactory: UnpluginFactory<Options | undefined> = async options => {
  const virtualModuleId = 'virtual:icon'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const icons = await lookupCollections()
  const iconList = Object.keys(icons)
  const iconObj = new Map()
  const iconArr = []
  const parseIcon: {[key:string]: Array<string>} = {}
  for(const i of iconList){
    iconObj.set(i, await lookupCollection(i))
    iconArr.push(i)
  }
  const iconKeyReg = new RegExp(iconArr.join(':|') + ':', 'g')
  return {
    name: 'unplugin-iconify-icons',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        let files = fg.sync('**/*.{js,jsx,ts,tsx,vue}', {
          cwd: 'src',
          stats: true,
          absolute: true,
        })
        files.forEach((item: any) => {
          const fileContent = fs.readFileSync(item.path, 'utf-8')
          const matchArr = fileContent.match(iconKeyReg)
          if (matchArr) {
            Array.from(new Set(matchArr)).forEach(async (item1: string) => {
              const key = item1.slice(0, -1)
              if (!iconObj.get(key)) {
                iconObj.set(key, await lookupCollection(key))
              }
              const iconList = fileContent.match(new RegExp(Object.keys(iconObj.get(key).icons).map(item2 => item1 + item2).join('|'), 'g'))
              if(iconList && iconList.length > 0){
                parseIcon[key] = (parseIcon[key] || []).concat(iconList.filter(item => item).map(item => item.split(':')[1]))
              }
            })
          }
          
        })
        const iconListArr = []
        for(const item in parseIcon){
          iconListArr.push(getIcons(iconObj.get(item), parseIcon[item]))
        }
        return `
          const iconList = ${JSON.stringify(iconListArr)}
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
