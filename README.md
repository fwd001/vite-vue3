# Vue 3 + TypeScript + Vite

## 脚手架
- 脚手架包地址：https://www.npmjs.com/package/lcfe-cli

## 相关文档
- vite: https://cn.vitejs.dev/
- vue3: https://v3.cn.vuejs.org/
- antd-vue: https://antdv.com/components/overview-cn/
- VueRequest: https://next.attojs.com/
- mockjs 规则: http://mockjs.com/examples.html#Array
- eslint规则: https://typescript-eslint.io/rules/
- prettier: https://prettier.io/docs/en/options.html

## 环境
node >=16

## 启动
> 建议使用 yarn or pnpm 安装依赖启动

### 安装 yarn or pnpm 
npm install -g yarn

npm install -g pnpm

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
```
.
├── vite.config.js              # vite 配置文件；
├── config/                     # 与项目构建相关的常用的配置选项；
│   └── index.js                # 主配置文件
├── src/
│   ├── 
│   ├── main.js                 # 程序的入口文件；
│   ├── vite-env.d.ts           # 全局变量环境申明文件
│   ├── style.less              # 全局样式
│   ├── types/                  # 公共类型文件夹；
│   ├── assets/                 # 共用的代码以外的资源，如：图片、图标、视频 等；
│   ├── api/                    # 网络模块，如：接口；
│   ├── router/                 # 路由模块
│   ├── hooks/                  # 公用hooks
│   ├── layouts/                # 布局组件
│   ├── mock/                   # mock工具
│   ├── store/                  # 组件共享状态
│   ├── components/             # 共用的组件；； 这里的存放的组件应该都是展示组件
│   │   ├── base/               # 基本组件，如：共用的弹窗组件，loading加载组件，提示组件。
│   │   ├── common/             # 共用的全局组件，封装的导航条，底部组件等等
│   │   ├── temp/               # 模板组件，如：相同的页面封装成一个组件。
│   │   ├── UItemp/             # UI组件，如：项目中特定的按钮，消息数字，等等一些样式可以封装成组件的。
│   ├── utils/                  # 共用的工具资源，如：常用的图片、图标，共用的组件、模块、样式，常量文件等等；
│   │   ├── compatible/         # 兼容模块，如：适合App和微信各种接口的模块；
│   │   ├── extension/          # 已有类的扩展模块，如：对 Array 类型进行扩展的模块；
│   │   ├── libraries/          # 存放自己封装的或者引用的库；
│   │   ├── tools/              # 自己封装的一些工具
│   │   ├── constant.js         # 存放js的常量；
│   │   ├── constant.scss       # 存放scss的常量；
│   │   └── ...
│   ├── views/                  # 存放项目页面文件夹；
│   └── App.vue                 # app 的根组件；
├── public/                     # 纯静态资源，该目录下的文件不会被vite处理，该目录会被拷贝到输出目录下；
├── .prettierrc.js              # prettier 的配置文件
├── .eslintrc.js                # eslint 的配置文件
├── .env                        # 全局环境变量
├── .env.dev                    # 开发环境变量
├── .prettierignore             # prettier 忽略规则
├── .eslintignore               # eslint 的忽略规则
├── .gitignore                  # git的忽略配置文件
├── index.html                  # HTML模板
├── tsconfig.json               # ts 配置文件
├── tsconfig.json               # ts-node 配置文件
├── package.json                # npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
└── README.md                   # 项目信息文档
```