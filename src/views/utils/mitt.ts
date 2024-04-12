import { mitt } from '@/utils/mitt';
// import { long } from '#/base';
import { MEventEnum } from '@/enums/mittEnum';

type MenuEmitterEvents = {
  [MEventEnum.QBidCradNumsRefresh]: { data: string[] };
  [MEventEnum.ZDRIdCardsChange]: { id?: string };
  [MEventEnum.ZDRDetailOpenApprovalModal]: {
    type?: number;
    id?: number;
  };
  [MEventEnum.ZDRDetailUpdate];
  [MEventEnum.MapMounted]: { map: any; layerGroup: any };
};

const mitter = mitt<MenuEmitterEvents>();

export default mitter;
