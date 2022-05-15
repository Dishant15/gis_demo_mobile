import {configureStore} from '@reduxjs/toolkit';

import appStateReducer from '~Common/data/appstate.reducer';
import authReducer from '~Authentication/data/auth.reducer';
import geoSurveyReducer from '~GeoServey/data/geoSurvey.reducer';

const store = configureStore({
  reducer: {
    appState: appStateReducer,
    auth: authReducer,
    geoSurvey: geoSurveyReducer,
  },
  devTools: true,
});

export default store;
