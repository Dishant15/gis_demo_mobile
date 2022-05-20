import React from 'react';
import {StatusBar} from 'react-native';

import {Appbar} from 'react-native-paper';
import {noop} from '~utils/app.utils';

const BackHeader = ({
  onGoBack = noop,
  title = '',
  subtitle = '',
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Appbar.Header style={style}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content
          title={title}
          subtitle={subtitle}
          titleStyle={[
            {
              alignSelf: 'flex-start',
            },
            titleStyle,
          ]}
          subtitleStyle={[
            {
              alignSelf: 'flex-start',
            },
            subtitleStyle,
          ]}
        />
      </Appbar.Header>
    </>
  );
};
export default BackHeader;
