/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path' // 此处如果报错则安装 node/path依赖
import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'
import UnoCSS from 'unocss/vite'

const CWD = process.cwd()
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const { VITE_IS_DEBUG, VITE_BASE } = loadEnv(mode, CWD)

  return {
    base: VITE_BASE,
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
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
      UnoCSS(),
      // 兼容性配置
      legacy({
        targets: ['defaults', '> 1%', 'not IE 11', 'chrome 65', 'not dead'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        modernPolyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es.promise.all-settled',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'es.global-this',
          'esnext.global-this',
          'esnext.string.match-all',
        ],
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
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
        '~': resolve(__dirname, 'src'),
        store: resolve(__dirname, 'src/store'),
        types: resolve(__dirname, 'src/types'),
        utils: resolve(__dirname, 'src/utils'),
        router: resolve(__dirname, 'src/router'),
        enum: resolve(__dirname, 'src/enum'),
        api: resolve(__dirname, 'src/api'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `
            @import "@/styles/variables.less";
          `,
        },
      },
    },
    esbuild: {
      pure: VITE_IS_DEBUG === 'true' ? [] : ['console.log', 'debugger'],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      assetsDir: 'assets', // 指定静态资源存放路径
      cssCodeSplit: true, // css代码拆分,禁用则所有样式保存在一个css里面
      sourcemap: VITE_IS_DEBUG === 'true',
      minify: 'esbuild',
      cssTarget: 'chrome65',
      chunkSizeWarningLimit: 2300,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks: (id: any) => {
            if (id.includes('node_modules')) {
              let chunkName = 'index'
              if (id.includes('/.pnpm/')) {
                chunkName = id.toString().split('/.pnpm/')[1].split('/')[0].toString()
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
