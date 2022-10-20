import {createSlice} from '@reduxjs/toolkit';
import {has} from 'lodash';
import {REHYDRATE} from 'redux-persist';
import {HOST_CONFIG} from '~constants/constants';

export const PERMISSIONS_TYPE = {
  ALLOW: 'allow',
  SKIP: 'skip',
  NONE: null,
};

const initialState = {
  showInfoScreens: true,
  locationPermissionType: PERMISSIONS_TYPE.NONE,
  currentLocation: null,
  mapType: 'standard', // satellite
  hostConfig: HOST_CONFIG.GPSTECH,
};

const appstateReducer = createSlice({
  name: 'appstate',
  initialState,
  reducers: {
    completeInfoView: state => {
      state.showInfoScreens = false;
    },
    setLocationPermission: (state, {payload}) => {
      state.locationPermissionType = payload;
    },
    setCurrentLocation: (state, {payload}) => {
      state.currentLocation = payload;
    },
    toggleMapType: state => {
      const {mapType} = state;
      state.mapType = mapType === 'standard' ? 'satellite' : 'standard';
    },
    updateHostConfig: (state, {payload}) => {
      state.hostConfig = payload;
    },
    resetAppState: () => {
      return {...initialState, hostConfig: state.hostConfig};
    },
  },
  extraReducers: builder => {
    builder.addCase(REHYDRATE, (state, {payload}) => {
      if (!has(payload, 'hostConfig'))
        [(state.hostConfig = HOST_CONFIG.GPSTECH)];
    });
  },
});

export const {
  completeInfoView,
  resetAppState,
  setLocationPermission,
  setCurrentLocation,
  toggleMapType,
  updateHostConfig,
} = appstateReducer.actions;
export default appstateReducer.reducer;
