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
        name: 'generate-version',
        closeBundle() {
          // 生成一个包含时间戳的 version.json 文件
          const version = {
            version: new Date().toISOString(), // 可换成 git hash
          };
          const distPath = path.resolve(__dirname, 'dist');
          const versionFile = path.resolve(distPath, 'version.json');

          if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath, { recursive: true });
          }

          fs.writeFileSync(versionFile, JSON.stringify(version), 'utf-8');
          console.log('✅ webapp版本文件已生成！');
        },
      },
    ],
  },
});
