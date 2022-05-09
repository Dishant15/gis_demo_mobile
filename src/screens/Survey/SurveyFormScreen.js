import React from 'react';
import {View, Text} from 'react-native';
import {layout, screens} from '~constants/constants';
import BackHeader from '~components/Header/BackHeader';
import SurveyForm from '~components/Survey/SurveyForm';
import {noop} from '~utils/app.utils';

const SurveyFormScreen = ({navigation}) => {
  return (
    <View style={layout.container}>
      <BackHeader title="Add Details" onGoBack={navigation.goBack} />
      <SurveyForm onSaveDetails={noop} />
    </View>
  );
};

export default SurveyFormScreen;
