import React from 'react';
import {View} from 'react-native';
import {layout, screens} from '~constants/constants';
import {Headline, Button} from 'react-native-paper';

const DashboardScreen = ({navigation}) => {
  return (
    <View style={[layout.container, layout.center]}>
      <Headline>Welcome</Headline>
      <Headline>to</Headline>
      <Headline>Network GIS</Headline>
      <Button onPress={() => navigation.navigate(screens.surveyDetails)}>
        Go to map
      </Button>
    </View>
  );
};

export default DashboardScreen;
