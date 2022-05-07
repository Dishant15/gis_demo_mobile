import {configureStore} from '@reduxjs/toolkit';
import {QueryClient, QueryClientProvider} from 'react-query';

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

  const queryClient = new QueryClient();

  return {
    reduxProps,
    queryClient,
  };
};
