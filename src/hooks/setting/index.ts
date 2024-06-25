import type { GlobConfig } from '#/config';

import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_CLIENT_API_URL = '',
    VITE_GLOB_FLOW_API_URL = '',
    VITE_GLOB_AUTHORIZE_HREF = '',
    VITE_GLOB_DICTIONARY_URL = '',
    VITE_GLOB_ZDR_YWLX = '',
    VITE_GLOB_TEXT_ZDR = '',
    VITE_GLOB_TEXT_YJ = '',
    VITE_GLOB_QB_YWLX = '',
    VITE_GLOB_XS_YWLX = '',
    VITE_GLOB_MAP_CONFIG_HTTP_URL = '',
    VITE_GLOB_GRID_LAYER_EXTEND_URL = '',
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    clientApiUrl: VITE_GLOB_CLIENT_API_URL,
    flowApiUrl: VITE_GLOB_FLOW_API_URL,
    shortName: VITE_GLOB_APP_TITLE.replace(/\s/g, '_').replace(/-/g, '_'),
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    authorizeHref: VITE_GLOB_AUTHORIZE_HREF,
    dictionaryUrl: VITE_GLOB_DICTIONARY_URL,
    zdrYWLX: VITE_GLOB_ZDR_YWLX,
    qbYWLX: VITE_GLOB_QB_YWLX,
    xsYWLX: VITE_GLOB_XS_YWLX,
    textZDR: VITE_GLOB_TEXT_ZDR,
    textYJ: VITE_GLOB_TEXT_YJ,
    mapConfHttpUrl: VITE_GLOB_MAP_CONFIG_HTTP_URL,
    dridUrl: VITE_GLOB_GRID_LAYER_EXTEND_URL,
  };
  return glob as Readonly<GlobConfig>;
};
