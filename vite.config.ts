/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path' // 此处如果报错则安装 node/path依赖
import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import antdvVars from './src/styles/antdv-vars'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'
import Unocss from 'unocss/vite'

const CWD = process.cwd()
const prodMock = false
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const { VITE_DROP_CONSOLE } = loadEnv(mode, CWD)
  const isServer = command === 'serve'
  return {
    server: {
      port: 8088,
      host: '0.0.0.0',
      open: false,
      https: false,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://10.1.50.85:8006', // 要访问的跨域的域名
          changeOrigin: true,
          rewrite: (path) => path.replace(/\/api/, ''),
        },
      },
    },
    plugins: [
      vue(),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })],
      }),
      Unocss(),
      // 兼容性配置
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome 79', 'maintained node versions'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        // 根据你自己需要导入相应的polyfill:  https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfill-specifiers
        modernPolyfills: ['es.promise.finally', 'es/array', 'es/map', 'es/set'],
      }),
      viteMockServe({
        mockPath: './src/mock', // 设置模拟.ts 文件的存储文件夹
        localEnabled: isServer, // 设置是否启用本地 xxx.ts 文件，不要在生产环境中打开它.设置为 false 将禁用 mock 功能
        prodEnabled: !isServer && prodMock, // 设置打包是否启用 mock 功能
        supportTs: true, // 打开后，可以读取 ts ⽂件模块。请注意，打开后将⽆法监视.js ⽂件。
        watchFiles: true, // 监视⽂件更改，并重新加载 mock 数据
        logger: false, //是否在控制台显示请求日志
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';

          setupProdMockServer();
        `,
      }),
      // gzip压缩 生产环境生成 .gz 文件
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        store: resolve(__dirname, 'src/store'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          additionalData: `
            @import "ant-design-vue/lib/style/themes/default.less";
            @import "@/styles/variables.less";
          `,
        },
      },
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      assetsDir: 'assets', // 指定静态资源存放路径
      cssCodeSplit: true, // css代码拆分,禁用则所有样式保存在一个css里面
      sourcemap: false,
      minify: 'esbuild',
      cssTarget: 'chrome79',
      chunkSizeWarningLimit: 2300,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks: (id: any) => {
            if (id.includes('node_modules')) {
              let chunkName = 'index'
              if (id.includes('registry.npmjs.org')) {
                chunkName = id
                  .toString()
                  .split(/\+(\S*)@/)[1]
                  .split('/')[0]
                  .toString()
              } else {
                chunkName = id.toString().split('node_modules/')[1].split('/')[0].toString()
              }
              return chunkName
            }
          }, // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: '[ext]/[name].[hash].[ext]', // 拆分js到模块文件夹 // chunkFileNames: (chunkInfo) => { //     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []; //     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'; //     return `js/${fileName}/[name].[hash].js`; // },
        },
      },
    },
  }
})
