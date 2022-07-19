/**
 * 配置信息
 */
import { navPathMap, navList } from '@/config/nav-config';
import { isDev, envVar } from '@/config/env-init';

// api链接配置
const originApiUrl = `https://ebms${envVar}.huolala.work`; // php api地址

// 公共链接配置
const localDomainUrl = `//ebms${envVar}.huolala.work`;


export const globalConfig = {
  isDev,
  localDomainUrl,
  originApiUrl,
  navPathMap,
  navList,
};
