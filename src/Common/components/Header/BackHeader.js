import React from 'react';
import {StatusBar} from 'react-native';

import {Appbar} from 'react-native-paper';
import {noop} from '~utils/app.utils';

const BackHeader = ({onGoBack = noop, title = '', subtitle = ''}) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Appbar.Header>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content
          title={title}
          subtitle={subtitle}
          titleStyle={{
            alignSelf: 'flex-start',
          }}
          subtitleStyle={{
            alignSelf: 'flex-start',
          }}
        />
      </Appbar.Header>
    </>
  );
};
export default BackHeader;
