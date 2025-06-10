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
以 vite + react 为例

vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Icon from 'unplugin-offline-iconify/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Icon()],
})
```

main.jsx
```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'virtual:offline-iconify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

以react为例封装 Icon 组件, 这里只是简单示例封装，其余框架也类似,

```jsx
export default function Icon(props){
  return <>
    <svg style={{
      fontSize: props.size || '16px',
      color: props.fill,
      width: '1em',
      height: '1em',
    }}>
      <use xlinkHref={'#' + props.name} />
    </svg>
  </>
}
```
在其他组件里引用
```jsx
import Icon from './component/Icon.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>Icon示例</div>
      <Icon name="ant-design:account-book-twotone" size="40px" fill="red" />
    </>
  )
}
```
效果

![](./img/demo.png)