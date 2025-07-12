// 表单设计器 - 表单项属性配置
// 本文件定义了表单设计器中表单项（FormItem）的属性配置项，包括通用属性、布局属性、校验属性等，
// 主要用于动态渲染表单项的属性面板，支持灵活扩展和维护。

import { IAnyObject } from '../../../typings/base-type';
import { baseComponents, customComponents } from '../../../core/formItemConfig';
import { Input, Select, RadioGroup, Slider } from 'ant-design-vue';
import { Component } from 'vue';

// 全局配置状态，主要用于栅格布局的span同步
export const globalConfigState: { span: number } = {
  span: 24,
};

// ===================== 表单项属性类型定义 =====================
// 基础表单项属性接口，描述单个属性的结构
export interface IBaseFormAttrs {
  name: string; // 字段名
  label: string; // 字段标签
  component?: string | Component; // 属性控件类型（字符串或Vue组件）
  componentProps?: IAnyObject; // 传递给控件的属性
  exclude?: string[]; // 需要排除的控件（不适用该属性的控件）
  includes?: string[]; // 仅适用于指定控件
  on?: IAnyObject; // 事件绑定
  children?: IBaseFormAttrs[]; // 嵌套子属性
  category?: 'control' | 'input'; // 属性类别
}

// 控件属性面板的控制属性接口，支持target指定绑定目标
export interface IBaseFormItemControlAttrs extends IBaseFormAttrs {
  target?: 'props' | 'options'; // 绑定到对象下的某个目标key中
}

// ===================== 表单项布局属性 =====================
// 用于控制表单项的栅格布局（如span、offset等）
export const baseItemColumnProps: IBaseFormAttrs[] = [
  {
    name: 'span',
    label: '栅格数',
    component: 'Slider',
    on: {
      change(value: number) {
        globalConfigState.span = value; // 同步全局span
      },
    },
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  // 其它栅格相关属性，均为Slider控件
  {
    name: 'offset',
    label: '栅格左侧的间隔格数',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'order',
    label: '栅格顺序,flex 布局模式下有效',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'pull',
    label: '栅格向左移动格数',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'push',
    label: '栅格向右移动格数',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  // 响应式断点属性
  {
    name: 'xs',
    label: '<576px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'sm',
    label: '≥576px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'md',
    label: '≥768p 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'lg',
    label: '≥992px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xl',
    label: '≥1200px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: 'xxl',
    label: '≥1600px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
  {
    name: '≥2000px',
    label: '≥1600px 响应式栅格',
    component: 'Slider',
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
  },
];

// ===================== 高级表单项布局属性 =====================
// 控件属性面板的配置项，主要用于labelCol、wrapperCol等
export const advanceFormItemColProps: IBaseFormAttrs[] = [
  {
    name: 'labelCol',
    label: '标签col',
    component: Slider,
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
  {
    name: 'wrapperCol',
    label: '控件-span',
    component: Slider,
    componentProps: {
      max: 24,
      min: 0,
      marks: { 12: '' },
    },
    exclude: ['Grid'],
  },
];

// ===================== 基础表单项属性 =====================
// 控件属性面板的配置项，主要用于切换控件类型、标签、字段标识等
export const baseFormItemProps: IBaseFormAttrs[] = [
  {
    // 动态的切换控件的类型
    name: 'component',
    label: '控件-FormItem',
    component: Select,
    componentProps: {
      options: baseComponents
        .concat(customComponents)
        .map((item) => ({ value: item.component, label: item.label })),
    },
  },
  {
    name: 'label',
    label: '标签',
    component: Input,
    componentProps: {
      type: 'Input',
      placeholder: '请输入标签',
    },
    exclude: ['Grid'],
  },
  {
    name: 'field',
    label: '字段标识',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: '请输入字段标识',
    },
    exclude: ['Grid'],
  },
  {
    name: 'helpMessage',
    label: 'helpMessage',
    component: Input,
    componentProps: {
      placeholder: '请输入提示信息',
    },
    exclude: ['Grid'],
  },
];

// ===================== 高级表单项属性 =====================
// 控件属性面板的配置项，主要用于标签对齐、额外信息、校验等
export const advanceFormItemProps: IBaseFormAttrs[] = [
  {
    name: 'labelAlign',
    label: '标签对齐',
    component: RadioGroup,
    componentProps: {
      options: [
        {
          label: '靠左',
          value: 'left',
        },
        {
          label: '靠右',
          value: 'right',
        },
      ],
    },
    exclude: ['Grid'],
  },
  {
    name: 'help',
    label: 'help',
    component: Input,
    componentProps: {
      placeholder: '请输入提示信息',
    },
    exclude: ['Grid'],
  },
  {
    name: 'extra',
    label: '额外消息',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: '请输入额外消息',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateTrigger',
    label: 'validateTrigger',
    component: Input,
    componentProps: {
      type: 'InputTextArea',
      placeholder: '请输入validateTrigger',
    },
    exclude: ['Grid'],
  },
  {
    name: 'validateStatus',
    label: '校验状态',
    component: RadioGroup,
    componentProps: {
      options: [
        {
          label: '默认',
          value: '',
        },
        {
          label: '成功',
          value: 'success',
        },
        {
          label: '警告',
          value: 'warning',
        },
        {
          label: '错误',
          value: 'error',
        },
        {
          label: '校验中',
          value: 'validating',
        },
      ],
    },
    exclude: ['Grid'],
  },
];

// ===================== 控件控制属性（如必填、隐藏等） =====================
export const baseFormItemControlAttrs: IBaseFormItemControlAttrs[] = [
  {
    name: 'required',
    label: '必填项',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hidden',
    label: '隐藏',
    component: 'Checkbox',
    exclude: ['alert'],
  },
  {
    name: 'hiddenLabel',
    component: 'Checkbox',
    exclude: ['Grid'],
    label: '隐藏标签',
  },
  {
    name: 'colon',
    label: 'label后面显示冒号',
    component: 'Checkbox',
    componentProps: {},
    exclude: ['Grid'],
  },
  {
    name: 'hasFeedback',
    label: '输入反馈',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'autoLink',
    label: '自动关联',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
  {
    name: 'validateFirst',
    label: '检验证错误停止',
    component: 'Checkbox',
    componentProps: {},
    includes: ['Input'],
  },
];
