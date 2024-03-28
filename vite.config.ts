import { defineApplicationConfig } from '@vben/vite-config';

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
        '/tiles': {
          target: 'http://172.16.11.13:3002',
          changeOrigin: true,
        },
      },
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
  },
});
