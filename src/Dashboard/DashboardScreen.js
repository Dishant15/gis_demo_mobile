import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {Headline} from 'react-native-paper';
import {layout} from '~constants/constants';

import underConstruction from '~assets/img/under_construction.jpg';

/**
 * Parent:
 *    drawer.navigation
 */
const DashboardScreen = ({navigation}) => {
  return (
    <View style={[layout.container, layout.center]}>
      <View style={styles.imageWrapper}>
        <Image
          source={underConstruction}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      <Headline>Network GIS</Headline>
      <Headline>Under Construction</Headline>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: Dimensions.get('screen').width * 0.8,
    height: 300,
  },
  img: {
    flex: 1,
    width: null,
    height: null,
  },
});

export default DashboardScreen;
