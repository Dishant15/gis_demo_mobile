import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';

import RootNavigation from '~navigation/root.navigation';
import {useApp} from '~useApp';

const App = () => {
  const {reduxProps} = useApp();
  return (
    <Provider {...reduxProps}>
      <NavigationContainer>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
