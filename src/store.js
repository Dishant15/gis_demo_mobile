import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appStateReducer from '~Common/data/appstate.reducer';
import authReducer from '~Authentication/data/auth.reducer';
import geoSurveyReducer from '~GeoServey/data/geoSurvey.reducer';
import planningTicketReducer from '~planningTicket/data/planningTicket.reducer';
import planningStateReducer from '~planning/data/planningState.reducer';
import planningGisReducer from '~planning/data/planningGis.reducer';
import surveyFormReducer from '~planning/data/surveyForm.reducer';

const rootReducer = combineReducers({
  appState: appStateReducer,
  auth: authReducer,
  geoSurvey: geoSurveyReducer,

  planningTicket: planningTicketReducer,
  planningState: planningStateReducer,
  planningGis: planningGisReducer,

  surveyForm: surveyFormReducer,
});

const persistConfig = {
  key: 'root-network-gis',
  storage: AsyncStorage,
  whitelist: ['auth', 'appState'],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
