import {createSlice} from '@reduxjs/toolkit';
import {countBy, filter, get, isNull} from 'lodash';

const initialState = {
  selectedTicketId: null,
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
    setTicketId: (state, {payload}) => {
      state.selectedTicketId = payload;
    },
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
});

export const {setTicketId, setWorkorderData, setFilteredworkorderList} =
  planningTicketReducer.actions;
export default planningTicketReducer.reducer;