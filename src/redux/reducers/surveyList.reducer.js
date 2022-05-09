import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: [
    {
      title: 'survey #1',
      address: 'Science City, Thaltej, Ahmedabad, 380060',
    },
    {
      title: 'survey #1',
      address: 'Makarba, Ahmedabad South, 380051',
    },
  ],
};

const serveyListSlice = createSlice({
  name: 'serveyList',
  initialState,
  reducers: {},
});

export default serveyListSlice.reducer;
