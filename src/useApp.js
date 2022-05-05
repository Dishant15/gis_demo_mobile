import {configureStore} from '@reduxjs/toolkit';

import appStateReducer from '~redux/reducers/appstate.reducer';
import authReducer from '~redux/reducers/auth.reducer';

export const useApp = props => {
  ///////////////////////////////////////
  //          store config            //
  /////////////////////////////////////

  const store = configureStore({
    reducer: {
      appState: appStateReducer,
      auth: authReducer,
    },
    devTools: true,
  });

  const reduxProps = {store};

  return {
    reduxProps,
  };
};
