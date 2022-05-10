import {createSlice} from '@reduxjs/toolkit';

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
};

const geoSurveyReducer = createSlice({
  name: 'serveyDetails',
  initialState,
  reducers: {
    updateCoordinates: (state, {payload}) => {
      state.coordinates = payload;
    },
    updateSurveyFormData: (state, {payload}) => {
      state.formData = payload;
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
  },
});

export const {updateCoordinates, updateSurveyFormData, addUnit, selectUnit} =
  geoSurveyReducer.actions;
export default geoSurveyReducer.reducer;
