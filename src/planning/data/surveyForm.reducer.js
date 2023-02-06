import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentStep: 3,
  formData: {
    id: null,
    geometry: null,
  },
};

const surveyFormStateSlice = createSlice({
  name: 'surveyForm',
  initialState,
  reducers: {},
});

export const {} = surveyFormStateSlice.actions;
export default surveyFormStateSlice.reducer;
