import {createSlice} from '@reduxjs/toolkit';

export const AUTH_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOTPASSWORD: 'forgotpassword',
  RESETPASSWORD: 'resetpassword',
  OTP_FORM: 'OTP_FORM',
};

const initialState = {
  token: '',
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
