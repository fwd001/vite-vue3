/**
 * 配置信息
 */
 import { navPathMap, navList } from "@/config/nav-config";

 // api链接配置
 const originApiUrl = `https://xxx.work`; // php api地址
 
 // 公共链接配置
 const localDomainUrl = `//xxxx.work`;
 
 // 是否启用mock, 改后需要重启
 const isMock = true;
 
 const globalConfig = {
   localDomainUrl,
   originApiUrl,
   navPathMap,
   navList,
   isMock,
 };
 
 export { globalConfig };
 