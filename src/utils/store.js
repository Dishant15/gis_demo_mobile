import {configureStore} from '@reduxjs/toolkit';

import appStateReducer from '~redux/reducers/appstate.reducer';
import authReducer from '~redux/reducers/auth.reducer';
import surveyDetailsReducer from '~redux/reducers/surveyDetails.reducer';
import surveyListReducer from '~redux/reducers/surveyList.reducer';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    auth: authReducer,
    surveylist: surveyListReducer,
    surveyDetails: surveyDetailsReducer,
  },
  devTools: true,
});
