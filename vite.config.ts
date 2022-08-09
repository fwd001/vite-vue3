/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path' // 此处如果报错则安装 node/path依赖
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import antdvVars from './src/assets/css/antdv-vars'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'

const prodMock = false
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isServer = command === 'serve'
  return {
    base: './',
    root: './',
    plugins: [
      vue(),
      Components({
        resolvers: [AntDesignVueResolver()],
      }),
      // 兼容性配置
      legacy({
        targets: [
          '> 1%',
          'last 2 version',
          'ie >= 11',
          'Chrome >= 71',
          'Safari >= 14',
          'Firefox >= 78',
          'Edge >= 71',
          'not ie <= 10',
        ],
        modernPolyfills: ['es.object.from-entries', 'es.array.flat', 'es.global-this'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      viteMockServe({
        mockPath: './src/mock', // 设置模拟.ts 文件的存储文件夹
        localEnabled: isServer, // 设置是否启用本地 xxx.ts 文件，不要在生产环境中打开它.设置为 false 将禁用 mock 功能
        prodEnabled: !isServer && prodMock, // 设置打包是否启用 mock 功能
        supportTs: true, // 打开后，可以读取 ts ⽂件模块。请注意，打开后将⽆法监视.js ⽂件。
        watchFiles: true, // 监视⽂件更改，并重新加载 mock 数据
        logger: false, //是否在控制台显示请求日志
        /* 如果生产环境开启了 mock 功能,即prodEnabled=true.则该代码会被注入到injectFile对应的文件的底部。默认为main.{ts,js}
        这样做的好处是,可以动态控制生产环境是否开启 mock 且在没有开启的时候 mock.js 不会被打包。
        如果代码直接写在main.ts内，则不管有没有开启,最终的打包都会包含mock.js
        */
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
    server: {
      port: 8080,
      host: '0.0.0.0',
      open: true,
      https: false,
      proxy: {
        '/api': {
          target: 'http://10.1.50.85:8006', // 要访问的跨域的域名
          changeOrigin: true,
          rewrite: (path) => path.replace(/\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        store: resolve(__dirname, 'src/store'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: antdvVars,
          javascriptEnabled: true,
        },
      },
    },
    build: {
      target: 'es2020',
      outDir: 'dist', //指定打包输出路径
      assetsDir: 'assets', //指定静态资源存放路径
      cssCodeSplit: true, //css代码拆分,禁用则所有样式保存在一个css里面
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        // 生产环境移除console
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks: (id: any) => {
            if (id.includes('node_modules')) {
              const chunkName = id.toString().split('node_modules/')[1].split('/')[0].toString()
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
