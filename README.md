# Vue 3 + TypeScript + Vite

## 脚手架
- 脚手架包地址：https://www.npmjs.com/package/lcfe-cli/access

## 相关文档
- vite: https://cn.vitejs.dev/
- vue3: https://v3.cn.vuejs.org/
- antd-vue: https://antdv.com/components/overview-cn/
- VueRequest: https://next.attojs.com/
- mockjs 规则: http://mockjs.com/examples.html#Array
- eslint规则: https://typescript-eslint.io/rules/

## 环境
node >=16

## 启动
> 建议使用 yarn 安装依赖启动

### 安装 yarn
npm i -g yarn

### 安装项目依赖
yarn install

### 本地运行
yarn dev

### 构建打包
yarn build

### 浏览器兼容
- "> 1%",
- "last 2 version",
- "ie >= 11",
- "Chrome >= 71",
- "Safari >= 14",
- "Firefox >= 78",
- "Edge >= 71",

### GIT提交代码规则
- commit内容，只允许使用下面7个标识，否则提交失败。
- feat: 新功能
- fix: 修补bug
- docs: 文档（documentation）
- style: 样式/格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动

### 文件目录结构
src
|
+-- api               # 全局请求
|
+-- assets            # 静态资源
|
+-- components        # 公共组件
|
+-- common            # 其他ts文件
|
+-- config            # 全局配置
|
+-- views             # 页面模块
|
+-- hooks             # 公用hooks
|
+-- route             # 路由配置
|
+-- store             # 全局状态store
|
+-- test              # 测试工具、mock服务器
|
+-- types             # 全局类型文件
|
+-- utils             # 通用工具函数