import { resolve } from "path"; // 此处如果报错则安装 node/path依赖
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// antdv 变量
import antdvVars from "./src/assets/css/antdv-vars";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  root: "./",
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  server: {
    port: 8888,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://10.1.50.85:8006", // 要访问的跨域的域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
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
    target: "es2020",
    outDir: "dist", //指定打包输出路径
    assetsDir: "assets", //指定静态资源存放路径
    cssCodeSplit: true, //css代码拆分,禁用则所有样式保存在一个css里面
    sourcemap: true,
    minify: "terser",
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
          if (id?.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }, // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: "js/[name].[hash].js", // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: "js/[name].[hash].js", // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: "[ext]/[name].[hash].[ext]", // 拆分js到模块文件夹 // chunkFileNames: (chunkInfo) => { //     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []; //     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'; //     return `js/${fileName}/[name].[hash].js`; // },
      },
    },
  },
});
