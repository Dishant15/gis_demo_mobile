import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {QueryClientProvider, QueryClient} from 'react-query';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import RootNavigation from '~navigation/root.navigation';
import {colors} from '~constants/constants';
import store from '~data/store';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.black,
    accent: colors.white,
  },
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaProvider>
              <RootNavigation />
            </SafeAreaProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </PaperProvider>
    </Provider>
  );
};

export default App;
