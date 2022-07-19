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
        target: "123",
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
  },
});
