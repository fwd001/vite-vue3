import { defineApplicationConfig } from '@vben/vite-config';
import fs from 'fs';
import path from 'path';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      port: 8000,
      host: '0.0.0.0',
      proxy: {
        '/basic-api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
        },
        '/app': {
          target: 'http://demo.bigemap.com',
          changeOrigin: true,
        },
        '/tiles': {
          target: 'http://172.16.11.13:3002',
          changeOrigin: true,
        },
        '/public-fe': {
          target: 'http://172.16.11.13:3002', // 数据字典
          changeOrigin: true,
        },
      },
      open: true, // 项目启动后，自动打开
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
    plugins: [
      {
        name: 'generate-version-and-inject',
        closeBundle() {
          /**
           * 生成版本信息对象
           *
           * 当前使用 ISO 时间戳作为版本标识
           * 可根据需要替换为：
           * - Git Hash: 使用 `git rev-parse HEAD` 获取
           * - 语义化版本: 从 package.json 读取
           * - 构建编号: 使用递增的构建编号
           */
          const version = {
            version: new Date().toISOString(), // 可换成 git hash 或其他版本标识
          };

          // 构建产物目录路径
          const distPath = path.resolve(__dirname, 'dist');
          // 版本文件路径
          const versionFile = path.resolve(distPath, 'version.json');
          // HTML 文件路径
          const htmlFile = path.resolve(distPath, 'index.html');

          // 确保构建产物目录存在
          if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath, { recursive: true });
          }

          /**
           * 生成 version.json 文件
           *
           * 此文件用于运行时版本检测：
           * - 应用会定期拉取此文件检查是否有新版本
           * - 文件内容与构建时注入到 HTML 的版本信息进行对比
           */
          fs.writeFileSync(versionFile, JSON.stringify(version), 'utf-8');
          console.log('✅ webapp版本文件已生成！');

          /**
           * 在 HTML 中注入版本信息到 Window 对象
           *
           * 目的：
           * - 在应用启动时即可获取当前构建版本
           * - 用于与远程 version.json 进行版本对比
           *
           * 注入位置：</title> 标签之后
           * 注入内容：window.__app_version = "版本标识"
           */
          if (fs.existsSync(htmlFile)) {
            try {
              let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

              // 检查是否已经注入过版本信息，避免重复注入
              if (!htmlContent.includes('window.__app_version')) {
                // 构建注入脚本
                const injectScript = `
    <script>
      // 注入构建版本信息到 Window 对象，供运行时版本检测使用
      window.__app_version = ${JSON.stringify(version.version)};
    </script>`;

                // 在 </title> 标签后注入脚本
                htmlContent = htmlContent.replace(/<\/title>/i, `</title>${injectScript}`);
                fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
                console.log('✅ 版本信息已注入到 HTML！');
              }
            } catch (e) {
              // 注入失败时的错误处理（不影响构建流程）
              console.warn('注入版本信息到 HTML 失败:', e);
            }
          }
        },
      },
    ],
  },
});
