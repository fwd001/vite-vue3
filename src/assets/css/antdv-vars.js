/*
 * @Author: wedong.fu
 * @Date: 2022-07-16 20:21:53
 * @LastEditors: wedong.fu
 * @LastEditTime: 2022-07-16 20:30:46
 * @Description:  antdv替换变量 请务必和theme.less中保持一致
 * 这里因为无法直接获取.less中的变量, 所以在js中复制一份，在config中覆盖原始antdv变量
 * 注意由于是vue.config.js使用，所以不能使用es6 module
 */

const globarCss = {
  'primary-color': '#1890ff',
  'link-color': '#37b1f1',
  'success-color': '#52c41a',
  'warning-color': '#f16622',
  'error-color': '#d8534f',
  'font-size-base': '14px',
  'heading-color': 'rgba(0, 0, 0, 0.85)',
  'text-color': 'rgba(0, 0, 0, 0.65)',
  'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
  'disabled-color': '#757575',
  'border-radius-base': '2px',
  'border-color-base': '#dbdfeb',
  'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)'
}

export default globarCss
