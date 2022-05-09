import {View, Text} from 'react-native';
import React from 'react';
import {layout, screens} from '~constants/constants';
import BackHeader from '~components/Header/BackHeader';
import SurveyMap from '~components/Survey/SurveyMap';

const SurveyDetails = ({navigation}) => {
  return (
    <View style={layout.container}>
      <BackHeader title="Draw on Map" onGoBack={navigation.goBack} />
      <View style={layout.container}>
        <SurveyMap
          onSavePress={() => {
            navigation.navigate(screens.surveyForm);
          }}
        />
      </View>
    </View>
  );
};

export default SurveyDetails;
