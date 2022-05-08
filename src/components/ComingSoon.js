import React from 'react';
import {View} from 'react-native';
import {layout} from '~constants/constants';

import FastImage from 'react-native-fast-image';
import comingsoon from '~assets/img/comingsoon.png';

const ComingSoon = () => {
  return (
    <View style={[layout.container, layout.center]}>
      <FastImage
        style={{width: 150, height: 150}}
        source={comingsoon}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

export default ComingSoon;
