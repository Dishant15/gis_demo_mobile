import {createSlice} from '@reduxjs/toolkit';
import get from 'lodash/get';
import has from 'lodash/has';
import size from 'lodash/size';
import difference from 'lodash/difference';

import {fetchLayerDataThunk} from './actionBar.services';
import {handleLayerSelect, removeLayerSelect} from './planningState.reducer';
import {convertLayerServerData} from '../GisMap/utils';

const defaultLayerNetworkState = {
  isLoading: false,
  isFetched: false,
  isError: false,
  isSelected: false,
  count: 0,
};

const initialState = {
  // shape : { layer-key: { ...defaultLayerNetworkState } }
  layerNetworkState: {},
  // shape : { layer-key: { viewData: [], editData: {} } }
  layerData: {},
  /**
   * shape: {
   *    event: "addElement" | "editElement",
   *    data: { **Edit / init form data },
   *    layerKey, enableMapInterection,
   *    geometry: null | {} | [{},{},...]
   * }
   */
  mapState: {},
};

const planningGisSlice = createSlice({
  name: 'planningGis',
  initialState,
  reducers: {
    setMapState: (state, {payload}) => {
      state.mapState = {...payload};
    },
    updateMapState: (state, {payload}) => {
      state.mapState = {...state.mapState, ...payload};
    },
    resetMapState: state => {
      state.mapState = {};
    },
    updateMapStateCoordinates: (state, {payload}) => {
      state.mapState.geometry = payload;
    },
    updateMapStateData: (state, {payload}) => {
      const mapStateData = get(state.mapState, 'data', {});
      state.mapState.data = {...mapStateData, ...payload};
    },
    // payload => list of selected layerKey
    // when region changes remove data for all inactive layers, so user can fetch fresh on click
    resetUnselectedLayerGisData: (state, {payload}) => {
      const allNSLayerKeys = difference(
        Object.keys(state.layerNetworkState),
        payload,
      );
      for (let lk_ind = 0; lk_ind < allNSLayerKeys.length; lk_ind++) {
        const currNsKey = allNSLayerKeys[lk_ind];
        if (currNsKey !== 'region') {
          // reset data
          state.layerNetworkState[currNsKey] = {
            ...defaultLayerNetworkState,
          };
          state.layerData[currNsKey] = {
            viewData: [],
            editData: {},
          };
        }
      }
    },
  },
  extraReducers: {
    // payload : layerKey
    [handleLayerSelect]: (state, {payload}) => {
      if (has(state, ['layerNetworkState', payload])) {
        state.layerNetworkState[payload].isSelected = true;
      }
    },
    [removeLayerSelect]: (state, {payload}) => {
      if (has(state, ['layerNetworkState', payload])) {
        state.layerNetworkState[payload].isSelected = false;
      }
    },
    // start loading
    [fetchLayerDataThunk.pending]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      if (has(state, ['layerNetworkState', layerKey])) {
        state.layerNetworkState[layerKey].isLoading = true;
        state.layerNetworkState[layerKey].isSelected = true;
      } else {
        // initialise new layer
        state.layerNetworkState[layerKey] = {
          ...defaultLayerNetworkState,
          isLoading: true,
          isSelected: true,
        };
        state.layerData[layerKey] = {
          viewData: [],
          editData: {},
        };
      }
    },
    // fetch success
    [fetchLayerDataThunk.fulfilled]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      state.layerNetworkState[layerKey].isLoading = false;
      state.layerNetworkState[layerKey].isFetched = true;
      state.layerNetworkState[layerKey].count = size(action.payload);
      // convert payload coordinates into google coordinates data
      state.layerData[layerKey].viewData = convertLayerServerData(
        layerKey,
        action.payload,
      );
    },
    // handle error
    [fetchLayerDataThunk.rejected]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      state.layerNetworkState[layerKey].isError = true;
    },
  },
});

export const {
  setMapState,
  updateMapState,
  resetMapState,
  updateMapStateCoordinates,
  resetUnselectedLayerGisData,
} = planningGisSlice.actions;
export default planningGisSlice.reducer;
