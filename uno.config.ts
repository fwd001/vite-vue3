import { defineConfig, presetTypography, presetUno } from 'unocss';
import { unoPrefixVariant } from 'uno-prefix-variant';

export default defineConfig({
  presets: [presetUno(), presetTypography()],
  variants: [
    unoPrefixVariant({
      prefixCls: '#body',
    }) as any,
  ],
  shortcuts: {
    // 如果有需要的话，在这里定义 shortcuts
  },
  rules: [['__container', { 'max-width': '1200px', margin: '0 auto', padding: '0 1rem' }]],
});
