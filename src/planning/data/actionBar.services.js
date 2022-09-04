import {createAsyncThunk} from '@reduxjs/toolkit';
import Api from '~utils/api.utils';
import {
  apiGetRegionList,
  apiGetPlanningConfigs,
  apiGetPlanningLayerData,
} from '~constants/url.constants';

export const fetchRegionList = async () => {
  const res = await Api.get(apiGetRegionList('data'));
  return res.data;
};

export const fetchLayerList = async () => {
  const res = await Api.get(apiGetPlanningConfigs());
  return res.data;
};

// get layer gis data only for regions given
export const fetchLayerData = async ({regionIdList, layerKey}) => {
  let res;
  if (layerKey === 'region') {
    res = await Api.get(apiGetRegionList('detail'), {
      ids: regionIdList.join(','),
    });
  } else {
    res = await Api.post(apiGetPlanningLayerData(), {
      regions: regionIdList,
      layer_key: layerKey,
    });
  }
  console.log('🚀 ~ file: fetchLayerData ~ res.data', res.data);
  return res.data;
};

export const fetchLayerDataThunk = createAsyncThunk(
  'planningGis/fetchLayerData',
  fetchLayerData,
);
