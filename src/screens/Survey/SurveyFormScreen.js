import React from 'react';
import {View} from 'react-native';
import {layout, screens} from '~constants/constants';
import BackHeader from '~components/Header/BackHeader';
import SurveyForm from '~components/Survey/SurveyForm';

const SurveyFormScreen = ({navigation}) => {
  return (
    <View style={layout.container}>
      <BackHeader title="Add Details" onGoBack={navigation.goBack} />
      <SurveyForm onSaveDetails={() => navigation.navigate(screens.unitList)} />
    </View>
  );
};

export default SurveyFormScreen;
