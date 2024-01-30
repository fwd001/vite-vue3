/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

/* ***** 用户登录信息 start ***** */
export interface OrgInfoMap {
  xzqh: string;
  id: number;
  depart_level: string;
}

export interface OrgInfo {
  id: number;
  name: string;
  pid: number;
  map: OrgInfoMap;
}

export interface DataScope {
  roleId: number;
  rule: string;
  scopes: number[];
}

export interface Resource {
  id: number;
  name: string;
  val: string;
  type: string;
  url: string;
  pid: number;
  orderNo: string;
  dataRules: []; // You might want to replace 'any' with a more specific type if you have information about 'dataRules'
}

export interface RoleDataScope {
  roleId: number;
  rule: string;
  scopes: number[];
}

export interface Role {
  id: number;
  name: string;
  val: string;
  dataScope: RoleDataScope;
}

export interface App {
  id: number;
  name: string;
  appId: string;
  icon: string;
  redirectUri: string;
}

export interface AurhorizeCodeResultModel {
  id: number;
  orgId: number;
  orgName: string;
  orgInfo: OrgInfo;
  name: string;
  username: string;
  photo: string;
  idcard: string;
  phone: string;
  mark: string;
  appAccess: boolean;
  token: string;
  map: { id: number };
  dataScopes: DataScope[];
  resources: Resource[];
  roles: Role[];
  groups: any[];
  apps: App[];
}

export interface AurhorizeCodeParamsModel {
  code: string;
  state?: string;
}
/* ***** 用户登录信息 end ***** */
