import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';
import {colors} from '~constants/constants';

const Loader = () => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator animating={true} color={colors.white} size="large" />
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
