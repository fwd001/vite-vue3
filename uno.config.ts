import { defineConfig, presetTypography, presetUno } from 'unocss';
import { unoPrefixVariant } from 'uno-prefix-variant';

export default defineConfig({
  presets: [presetUno(), presetTypography()],
  variants: [
    unoPrefixVariant({
      prefixCls: '#body',
    }) as any,
  ],
});
