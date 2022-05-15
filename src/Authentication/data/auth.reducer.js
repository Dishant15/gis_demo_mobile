import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: 'aaa',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      // resetting form data if exist
      state.formData = {};
      state.formErrorMessage = null;
    },
    logout: state => {
      return initialState;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
