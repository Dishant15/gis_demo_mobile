import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {QueryClientProvider, QueryClient} from 'react-query';

import RootNavigation from '~navigation/root.navigation';
import {colors} from '~constants/constants';
import {store} from '~utils/store';

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
