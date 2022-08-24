import {createSlice} from '@reduxjs/toolkit';
import {get} from 'lodash';

const initialState = {
  token: '',
  user: {},
  isAdmin: false,
  permissions: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, {payload}) => {
      state.token = payload.token;
      state.user = payload.user;
      state.permissions = payload.permissions;
      // admin or superadmin can view
      state.isAdmin = !!(
        get(payload, 'user.is_staff') || get(payload, 'user.is_superuser')
      );
    },
    logout: state => {
      return initialState;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
