import {View, Text} from 'react-native';
import React from 'react';
import {layout} from '~constants/constants';

import {
  FORM_CONFIGS,
  INITIAL_DATA,
  onSubmit,
} from '~planning/GisMap/layers/p_dp';
import DynamicForm from '~Common/DynamicForm';
import {noop} from 'lodash';
import BackHeader from '~Common/components/Header/BackHeader';

const Form = () => {
  return (
    <View style={layout.container}>
      <BackHeader title="Add Details" onGoBack={noop} />
      <DynamicForm
        formConfigs={FORM_CONFIGS}
        data={INITIAL_DATA}
        onSubmit={data => console.log(data)}
        onClose={noop}
        isLoading={false}
      />
    </View>
  );
};

export default Form;
