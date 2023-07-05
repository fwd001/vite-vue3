import {
  transformerVariantGroup,
  transformerDirectives,
  presetAttributify,
  defineConfig,
  presetMini,
  presetUno,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

// https://github.com/unocss/unocss#readme
export default defineConfig({
  presets: [
    presetMini({ dark: 'class' }),
    presetAttributify(),
    presetUno(),
    presetRemToPx({ baseFontSize: 4 }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-ac': 'flex justify-around items-center',
    'flex-bc': 'flex justify-between items-center',
  },
  theme: {},
  content: {
    pipeline: {
      include: [`${__dirname}/**/*`],
      exclude: [`${__dirname}/node_modules/**/*`],
    },
  },
})
