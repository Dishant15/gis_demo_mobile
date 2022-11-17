import {createSlice} from '@reduxjs/toolkit';
import {countBy, filter, get, isNull} from 'lodash';
import {logout} from '~Authentication/data/auth.reducer';

const initialState = {
  workorderData: {},
  workorderList: [],
  filteredWorkorderList: [],
  statusFilter: null,
  countByStatus: null,
};

const planningTicketReducer = createSlice({
  name: 'planningTicket',
  initialState,
  reducers: {
    setWorkorderData: (state, {payload}) => {
      const workorderList = get(payload, 'work_orders', []);
      state.workorderData = {...payload};
      state.workorderList = workorderList;
      state.filteredWorkorderList = isNull(state.statusFilter)
        ? [...workorderList]
        : filter(state.workorderList, ['status', state.statusFilter]);
      state.countByStatus = countBy(workorderList, 'status');
    },
    setFilteredworkorderList: (state, {payload}) => {
      state.statusFilter = payload;
      state.filteredWorkorderList = isNull(payload)
        ? [...state.workorderList]
        : filter(state.workorderList, ['status', payload]);
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, () => initialState);
  },
});

export const {setWorkorderData, setFilteredworkorderList} =
  planningTicketReducer.actions;
export default planningTicketReducer.reducer;
