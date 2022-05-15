import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appStateReducer from '~Common/data/appstate.reducer';
import authReducer from '~Authentication/data/auth.reducer';
import geoSurveyReducer from '~GeoServey/data/geoSurvey.reducer';

const rootReducer = combineReducers({
  appState: appStateReducer,
  auth: authReducer,
  geoSurvey: geoSurveyReducer,
});

const persistConfig = {
  key: 'root-network-gis',
  storage: AsyncStorage,
  whitelist: ['auth', 'appState'],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: true,
});

export const persistor = persistStore(store);

export default store;
