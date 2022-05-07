import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClientProvider} from 'react-query';

import RootNavigation from '~navigation/root.navigation';
import {useApp} from '~App/useApp';

const App = () => {
  const {reduxProps, queryClient} = useApp();
  return (
    <Provider {...reduxProps}>
      <PaperProvider>
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
