import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  showInfoScreens: true,
};

const appstateReducer = createSlice({
  name: 'appstate',
  initialState,
  reducers: {
    completeInfoView: state => {
      state.showInfoScreens = false;
    },
    resetAppState: () => {
      return initialState;
    },
  },
});

export const {completeInfoView, resetAppState} = appstateReducer.actions;
export default appstateReducer.reducer;
