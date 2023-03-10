import React from 'react';
import {Provider} from 'react-redux';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {QueryClientProvider, QueryClient} from 'react-query';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import Geocoder from 'react-native-geocoding';
import {Platform} from 'react-native';
import {GM_IOS_API_KEY, GM_ANDROID_API_KEY} from '@env';

import RootNavigation from '~navigation/root.navigation';
import {colors} from '~constants/constants';
import {toastConfig} from '~utils/toast.utils';
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

export const queryClient = new QueryClient();

// Initialize the module (needs to be done only once)
Geocoder.init(Platform.OS === 'ios' ? GM_IOS_API_KEY : GM_ANDROID_API_KEY); // use a valid API key

/**
 * Renders:
 *    RootNavigation
 */
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <SafeAreaProvider>
                <RootNavigation />
                <Toast config={toastConfig} />
              </SafeAreaProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
