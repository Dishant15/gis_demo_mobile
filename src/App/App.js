import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {QueryClientProvider, QueryClient} from 'react-query';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';

import RootNavigation from '~navigation/root.navigation';
import {colors} from '~constants/constants';
import store, {persistor} from '~store';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryMain,
    accent: colors.white,
    text: colors.textColor,
  },
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <SafeAreaProvider>
                <RootNavigation />
              </SafeAreaProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
