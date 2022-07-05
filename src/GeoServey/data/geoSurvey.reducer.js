import {differenceBy, filter, isNull, orderBy} from 'lodash';
import {createSlice} from '@reduxjs/toolkit';
import {convertWorkOrderData} from '~utils/map.utils';

const defaultUnitData = {
  // coordinates in redux shape: {"latitude": 23.04, "longitude": 72.51}
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

const defaultSurveyData = {
  name: '',
  address: '',
  area: '',
  city: '',
  state: '',
  pincode: '',
  // list of strings
  tags: [],
  coordinates: [],
  units: [],
};

const initialState = {
  selectedTicketId: null,
  selectedAreaData: {},
  surveyList: [],
  filteredSurveyList: [],
  statusFilter: null,
  // all data bellow is for form edit / add purpose
  selectedSurveyIndex: null,
  selectedSurvey: {},
  // unit index if selected , -1 if new unit add
  selectedUnitIndex: null,
  selectedUnitData: {},
  isReview: false,
};

const geoSurveyReducer = createSlice({
  name: 'serveyDetails',
  initialState,
  reducers: {
    // when user click on one of the task on task list screen
    // payload shape: {...taskData, area_pocket: {}, work_orders: [{...survey1, survey2}] }
    setTaskData: (state, {payload}) => {
      const {id, area_pocket, work_orders} = convertWorkOrderData(payload);
      state.selectedTicketId = id;
      state.selectedAreaData = {...area_pocket};
      state.surveyList = orderBy(work_orders, ['updated_on'], ['desc']);
      state.filteredSurveyList = [...state.surveyList];
    },
    // when user clicks one of the survey from taskList -> surveyList
    // payload shape: {surveyIndex, surveyData: {...surveyData, units: [ {...unit1, ...}]}
    // payload will be null if creating new survey
    setSurveyData: (state, {payload}) => {
      if (isNull(payload)) {
        state.selectedSurvey = {...defaultSurveyData};
        state.selectedSurveyIndex = -1;
        state.selectedUnitIndex = null;
        state.selectedUnitData = {};
      } else {
        state.selectedSurvey = {...payload.surveyData};
        state.selectedSurveyIndex = payload.surveyIndex;
        state.selectedUnitIndex = null;
        state.selectedUnitData = {};
      }
    },
    updateSurveyFormData: (state, {payload}) => {
      state.selectedSurvey = {...payload};
    },
    updateSurveyList: (state, {payload}) => {
      if (state.selectedSurveyIndex === -1) {
        state.surveyList.push({...payload});
        state.selectedSurveyIndex = state.surveyList.length - 1;
      } else {
        state.surveyList[state.selectedSurveyIndex] = {...payload};
      }
    },
    // payload : unit index
    selectUnit: (state, {payload}) => {
      if (payload === -1) {
        // handle unit add
        state.selectedUnitData = {...defaultUnitData};
        state.selectedUnitIndex = -1;
      } else {
        const serveyUnits = state.selectedSurvey.units || [];
        state.selectedUnitData = {...serveyUnits[payload]};
        state.selectedUnitIndex = payload;
      }
    },
    updateUnitFormData: (state, {payload}) => {
      state.selectedUnitData = {...payload};
    },
    updateSurveyUnitList: (state, {payload}) => {
      const {selectedSurveyIndex, selectedUnitIndex} = state;
      if (selectedUnitIndex === -1) {
        const serveyUnits = state.selectedSurvey.units || [];
        serveyUnits.push({...payload});
        state.surveyList[selectedSurveyIndex].units = serveyUnits;
        state.selectedSurvey.units = serveyUnits;
      } else {
        state.surveyList[selectedSurveyIndex].units[selectedUnitIndex] = {
          ...payload,
        };
        state.selectedSurvey.units[selectedUnitIndex] = {
          ...payload,
        };
      }
    },
    deleteSurveyData: (state, {payload}) => {
      // payload = surveyId
      state.surveyList = differenceBy(state.surveyList, [{id: payload}], 'id');
      state.selectedAreaData = {};
      // all data bellow is for form edit / add purpose
      state.selectedSurveyIndex = null;
      state.selectedSurvey = {};
      // unit index if selected , -1 if new unit add
      state.selectedUnitIndex = null;
      state.selectedUnitData = {};
      state.isReview = false;
    },
    deleteUnitData: (state, {payload}) => {
      // payload = unitId
      const newUnitList = differenceBy(
        state.selectedSurvey.units,
        [{id: payload}],
        'id',
      );
      state.surveyList[state.selectedSurveyIndex].units = newUnitList;
      state.selectedSurvey.units = newUnitList;
      // unit index if selected , -1 if new unit add
      state.selectedUnitIndex = null;
      state.selectedUnitData = {};
      state.isReview = false;
    },
    setReview: (state, {payload}) => {
      state.isReview = payload;
    },
    resetServeyData: state => {
      // all data bellow is for form edit / add purpose
      state.selectedSurveyIndex = null;
      state.selectedSurvey = {};
      state.selectedUnitIndex = null;
      state.selectedUnitData = {};
      state.isReview = false;
    },
    setFilteredSurveyList: (state, {payload}) => {
      state.statusFilter = payload;
      state.filteredSurveyList = isNull(payload)
        ? [...state.surveyList]
        : filter(state.surveyList, ['status', payload]);
    },
    resetAllData: () => {
      return initialState;
    },
  },
});

export const {
  setTaskData,
  setSurveyData,
  updateSurveyFormData,
  updateSurveyList,
  selectUnit,
  updateUnitFormData,
  updateSurveyUnitList,
  setReview,
  resetServeyData,
  resetAllData,
  deleteSurveyData,
  deleteUnitData,
  setFilteredSurveyList,
} = geoSurveyReducer.actions;
export default geoSurveyReducer.reducer;
