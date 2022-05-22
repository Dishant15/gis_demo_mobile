import {map, pick} from 'lodash';
import {createSlice} from '@reduxjs/toolkit';
import {coordsToLatLongMap} from '~utils/map.utils';

const defaultUnitData = {
  coordinates: null,
  location: {},
  name: '',
  // list of strings, selected from boundaryData -> tags
  tags: [],
  // MDU | SDU | BOTH
  category: '',
  // if SDU floors will not be shown
  floors: 1,
  // if SDU house per floors will become "SDU counts"
  house_per_floor: 1,
  // auto calculate : floors * house_per_floor
  total_home_pass: 1,
};

const initialState = {
  selectedArea: {},
  selectedSurvey: {},
  coordinates: [],
  boundaryData: {
    name: '',
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    // list of strings
    tags: [],
  },
  // list of units data
  units: [],
  selectedUnit: null,
  isReview: false,
};

const geoSurveyReducer = createSlice({
  name: 'serveyDetails',
  initialState,
  reducers: {
    setAreaData: (state, {payload}) => {
      return {
        ...initialState,
        selectedArea: payload,
      };
    },
    setSurveyData: (state, {payload}) => {
      return {
        ...initialState,
        selectedArea: state.selectedArea,
        selectedSurvey: payload,
        coordinates: payload.path,
        boundaryData: pick(payload, [
          'id',
          'name',
          'address',
          'area',
          'city',
          'state',
          'pincode',
          'tags',
        ]),
        units: map(payload.units, unit => ({
          ...unit,
          coordinates: coordsToLatLongMap([unit.coordinates])[0],
        })),
      };
    },
    updateCoordinates: (state, {payload}) => {
      state.coordinates = payload;
    },
    updateSurveyFormData: (state, {payload}) => {
      state.boundaryData = payload;
    },
    addUnit: state => {
      const newUnit = [...state.units, {...defaultUnitData}];
      state.units = newUnit;
      state.selectedUnit = newUnit.length - 1;
    },
    // payload : unit index
    selectUnit: (state, {payload}) => {
      state.selectedUnit = payload;
    },
    // payload : { unitIndex, coordinates }
    updateUnitCoordinates: (state, {payload}) => {
      state.units[payload.unitIndex].coordinates = payload.coordinates;
    },
    // payload : { unitIndex, data }
    updateUnitData: (state, {payload}) => {
      state.units[payload.unitIndex] = {
        ...state.units[payload.unitIndex],
        ...payload.data,
      };
    },
    setReview: (state, {payload}) => {
      state.isReview = true;
    },
    resetSurveyData: () => {
      return initialState;
    },
  },
});

export const {
  updateCoordinates,
  updateSurveyFormData,
  addUnit,
  selectUnit,
  updateUnitCoordinates,
  updateUnitData,
  resetSurveyData,
  setReview,
  setAreaData,
  setSurveyData,
} = geoSurveyReducer.actions;
export default geoSurveyReducer.reducer;
