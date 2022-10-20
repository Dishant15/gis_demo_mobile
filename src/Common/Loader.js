import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';
import {colors, layout} from '~constants/constants';

const Loader = () => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator animating={true} color={colors.white} size="large" />
    </View>
  );
};

export const FullScreenLoader = () => {
  return (
    <View style={[layout.container, layout.relative]}>
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackWithOp,
  },
});

export default Loader;
