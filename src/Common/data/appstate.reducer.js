import {createSlice} from '@reduxjs/toolkit';

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
    resetAppState: () => {
      return initialState;
    },
  },
});

export const {
  completeInfoView,
  resetAppState,
  setLocationPermission,
  setCurrentLocation,
  toggleMapType,
} = appstateReducer.actions;
export default appstateReducer.reducer;
