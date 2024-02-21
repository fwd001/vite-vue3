import { AurhorizeCodeResultModel, AurhorizeCodeParamsModel } from './model/userModel';
import { clientHttp } from '@/utils/http/axios';

enum Api {
  Logout = '/client/logout',
  AurhorizeCode = '/client/callback',
}

/**
 * @description: 认证code
 */
export function aurhorizeCode(params: AurhorizeCodeParamsModel) {
  return clientHttp.get<{ data: AurhorizeCodeResultModel }>({
    url: Api.AurhorizeCode,
    params: params,
  });
}

export function doLogout() {
  return clientHttp.get({
    url: Api.Logout,
  });
}
