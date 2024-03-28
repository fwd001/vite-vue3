import { UploadApiResult } from './model/uploadModel';
import { defHttp, originHttp } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { useGlobSetting } from '@/hooks/setting';
import { AxiosProgressEvent } from 'axios';
import { ContentTypeEnum } from '@/enums/httpEnum';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

// 上传文件
export const apiSpUploadFile = (fileList: any) => {
  return originHttp.post({
    url: '/spider/minio/fileUpload',
    data: fileList,
    timeout: 60000,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
  });
};
