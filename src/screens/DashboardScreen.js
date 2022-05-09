import React from 'react';
import {View} from 'react-native';
import {Headline, Button} from 'react-native-paper';
import {layout, screens} from '~constants/constants';

const DashboardScreen = ({navigation}) => {
  return (
    <View style={[layout.container, layout.center]}>
      <Headline>Welcome</Headline>
      <Headline>to</Headline>
      <Headline>Network GIS</Headline>
      <Button onPress={() => navigation.navigate(screens.surveyForm)}>
        Go to Form
      </Button>
    </View>
  );
};

export default DashboardScreen;
