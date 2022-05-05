import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';

import {useApp} from '~useApp';

const App = () => {
  const {reduxProps} = useApp();
  return (
    <Provider {...reduxProps}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Text>Hellp</Text>
          {/* <RootNavigation /> */}
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
