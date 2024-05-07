import { usePsMapStore } from '@/store/modules/psMap';
import { onBeforeUnmount } from 'vue';
import axios from 'axios';
import mitter from '@/views/utils/mitt';
import { MEventEnum } from '@/enums/mittEnum';

export function useXZQHRender() {
  const mapStore = usePsMapStore();
  let map: any; // 总地图实例
  let layerGroup: any; // 地图图层组

  function mitterOn() {
    mitter.on(MEventEnum.MapMounted, (data: { map: any; layerGroup: any }) => {
      map = data.map;
      layerGroup = data.layerGroup;
      init();
    });
  }
  mitterOn();

  function mitterOff() {
    mitter.off(MEventEnum.MapMounted);
  }
  onBeforeUnmount(() => {
    mitterOff();
  });

  // 行政区划渲染
  const coneIns: any[] = [];
  let cone: any;
  let time: NodeJS.Timeout;

  //自动加载方法
  const code = 650000;
  function init() {
    const latlngcon = map.getBounds();
    const latlngs = [
      [
        [latlngcon._northEast.lat, latlngcon._northEast.lng],
        [latlngcon._southWest.lat, latlngcon._southWest.lng],
      ],
    ];
    sessionStorage.clear();
    sessionStorage.setItem('latlngs', JSON.stringify(latlngs));
    chons(code, true);

    map.on('dblclick', function () {
      //在双击事件中，先清除前面click事件的时间处理
      clearTimeout(time);
      back();
    });
  }
  // 加载地图方法
  async function chons(code?: number, isInit?: boolean) {
    const res = await axios.get(`/public/BMgeojson/china/${code}.json`);
    if (!res) return;
    const data = res.data;
    cone = BM.geoJSON(data, {
      style: function () {
        return {
          color: 'red',
          fillColor: '#fff',
          weight: 1,
          fillOpacity: 0,
        };
      },

      onEachFeature: function (feature: any, layer: any) {
        const name = feature.properties.name;
        feature.properties &&
          name &&
          layer.bindTooltip(
            `<div style="color: ${'black'}; font-size: ${14}px;" class='text-white-outside font-700'>${name}</div>`,
            {
              direction: 'bottom',
              offset: [0, -30],
              className: 'pure-tool-tip-wrapper',
              permanent: true,
            },
          );
      },
    })
      .on('mouseover', function (e: any) {
        e.layer.setStyle({
          color: 'red',
          fillColor: 'red',
          weight: 1,
          fillOpacity: 0.03,
        });
      })
      .on('mouseout', function (e: any) {
        e.target.resetStyle(e.layer);
      })
      .on('click', function (e: any) {
        const properties = e.layer.feature.properties;
        const zb = e.layer._bounds;
        if (code == properties.adcode || !properties.adcode) {
          return false;
        } else {
          //定时器
          clearTimeout(time);
          mapStore.addMapLevels({ name: properties.name, code: code as number });
          time = setTimeout(function () {
            // 重新加载
            chons(properties.adcode);
            cone.remove();
            // 临时缓存
            sessionStorage.setItem('diqu', JSON.stringify(properties.acroutes));
            const latadd = sessionStorage.getItem('latlngs');
            const lataddp = JSON.parse(latadd as string);
            lataddp.push([
              [zb._northEast.lat, zb._northEast.lng],
              [zb._southWest.lat, zb._southWest.lng],
            ]);
            sessionStorage.setItem('latlngs', JSON.stringify(lataddp));
            if (lataddp.slice(-1).length != 0) {
              map.fitBounds(lataddp.slice(-1));
            }
          }, 300);
        }
      });
    layerGroup.addLayer(cone);
    coneIns.push(cone);
    if (isInit === undefined) {
      map.fitBounds(cone.getBounds());
    }
  }

  function back() {
    mapStore.popMapLevels();
    const diqu = sessionStorage.getItem('diqu');
    const diqup = JSON.parse(diqu as string);

    const latlng = sessionStorage.getItem('latlngs');
    const latlngp = JSON.parse(latlng as string);

    if (diqup == null || diqup.length == 0) {
      return false;
    } else {
      const result = diqup.pop();
      sessionStorage.setItem('diqu', JSON.stringify(diqup));
      latlngp.pop();
      sessionStorage.setItem('latlngs', JSON.stringify(latlngp));
      chons(result);
    }
    cone.remove();
    if (latlngp.slice(-1).length != 0) map.fitBounds(latlngp.slice(-1));
  }
  function clear() {
    layerGroup.removeLayer(cone);
  }
  return { back, init, clear, chons, cone };
}
