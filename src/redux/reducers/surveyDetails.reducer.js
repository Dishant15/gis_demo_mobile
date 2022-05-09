import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  coordinates: [],
  formData: {},
};

const serveyDetailsSlice = createSlice({
  name: 'serveyDetails',
  initialState,
  reducers: {
    updateCoordinates: (state, {payload}) => {
      state.coordinates = payload;
    },
    updateServeyDetails: (state, {payload}) => {
      state = {...state, payload};
    },
  },
});

export const {updateServeyDetails, updateCoordinates} =
  serveyDetailsSlice.actions;
export default serveyDetailsSlice.reducer;
