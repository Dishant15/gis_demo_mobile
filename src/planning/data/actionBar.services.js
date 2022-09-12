import {createAsyncThunk} from '@reduxjs/toolkit';
import Api from '~utils/api.utils';
import {
  apiGetRegionList,
  apiGetPlanningConfigs,
  apiGetPlanningLayerData,
  apiGetPlanningConfigsDetails,
} from '~constants/url.constants';

export const fetchRegionList = async () => {
  const res = await Api.get(apiGetRegionList('data'));
  return res.data;
};

export const fetchLayerList = async () => {
  const res = await Api.get(apiGetPlanningConfigs());
  return res.data;
};

export const fetchLayerListDetails = async () => {
  const res = await Api.get(apiGetPlanningConfigsDetails());
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
  return res.data;
};

export const fetchLayerDataThunk = createAsyncThunk(
  'planningGis/fetchLayerData',
  fetchLayerData,
);
