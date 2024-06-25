import { getGeoJson } from '@/api/dashboard/index';
import * as turf from '@turf/turf';
import { cloneDeep } from 'lodash-es';

export function useLatlon2Addr() {
  let previousAdcode = '';
  let resultsNames: string[] = ['中国'];

  // 示例经纬度点
  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [87.64892578125, 43.970926454532446],
    },
  };

  async function recursionQuery(code) {
    const res = await getGeoJson(code);
    const features = res.features || [];
    let found = false;
    console.log('found features', features);
    console.log('point', point);

    for (const element of features) {
      const isInside = turf.booleanPointInPolygon(point, element);
      if (isInside) {
        const name = element.properties.name;
        const adcode = element.properties.adcode;
        console.log('name', name);
        console.log('adcode', adcode);

        if (previousAdcode !== adcode) {
          previousAdcode = adcode;
          resultsNames.push(name);
          return await recursionQuery(adcode); // 继续递归
        } else {
          found = true;
          break;
        }
      }
    }

    if (found) {
      const arr = cloneDeep(resultsNames);
      previousAdcode = '';
      resultsNames = ['中国'];
      return arr; // 没有找到匹配的 feature，返回结果
    }
  }

  function l2Addr(latlng) {
    point.geometry.coordinates = latlng.map((v) => Number(v));
    return recursionQuery(100000); // 返回一个 Promise
  }

  return { l2Addr };
}
