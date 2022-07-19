/**
 * 开发环境 环境变量配置
 * 影响文件下载(见config.js-envFile)；webpack代理环境
 */
interface IDevEnv {
  env: string;
  originApiUrl: string;
}
// '-dev' || '-stg' || '-pre' || ''
const env = '-stg';

export const dev: IDevEnv = {
  env: env,
  originApiUrl: `https://ebms${env}.huolala.work`,
};
