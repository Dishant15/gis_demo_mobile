import {configureStore} from '@reduxjs/toolkit';

import appStateReducer from '~data/reducers/appstate.reducer';
import authReducer from '~data/reducers/auth.reducer';
import geoSurveyReducer from '~data/reducers/geoSurvey.reducer';

const store = configureStore({
  reducer: {
    appState: appStateReducer,
    auth: authReducer,
    geoSurvey: geoSurveyReducer,
  },
  devTools: true,
});

export default store;
