# unplugin-iconfiy
iconfiy 本地化插件，按需加载，无需请求远程icon

# 实现

参考 vite-plugin-svg-icons-ng，不过 vite-plugin-svg-icons-ng 是将本地文件svg通过到页面，然后通过 use 引入，unplugin-iconfiy通过识别项目中使用到的 iconify icon，将用到的icon提取出来注入页面， 通过 use 引入

暂未实现热更新，每次使用新的图标需要重启项目

目前识别 src 目录下的 js,jsx,ts,tsx,vue,json 文件，后续计划改为插件配置项，可自定义

# 使用

使用 unplugin 开发，仅自测了vite，其余构建工具自行测试

```bash
npm i unplugin-offline-iconify -D
```

vite.config.js
```js
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import Icon from 'unplugin-offline-iconify/vite'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    createSvgIconsPlugin({
      iconDirs: [fileURLToPath(new URL('./src/assets/icon', import.meta.url))]
    }),
    Icon()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
```

main.js
```js
import 'virtual:offline-iconify'
```
