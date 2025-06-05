# unplugin-iconfiy
iconfiy 本地化插件，按需加载，无需请求远程icon

# 实现

参考 vite-plugin-svg-icons-ng，不过 vite-plugin-svg-icons-ng 是将本地文件svg通过到页面，然后通过 use 引入，unplugin-iconfiy通过识别项目中使用到的 iconify icon，将用到的icon提取出来注入页面， 通过 use 引入

暂未实现热更新，每次使用新的图标需要重启项目
