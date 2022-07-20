import React from 'react';
import {StyleSheet} from 'react-native';

import {Card} from 'react-native-paper';
import {THEME_COLORS, Z_INDEX} from '~constants/constants';

const FloatingCard = props => {
  const {children} = props;
  return (
    <Card elevation={3} style={styles.card}>
      {children}
    </Card>
  );
};
export default FloatingCard;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    zIndex: Z_INDEX.FLOATING_CARDS,
    top: 14,
    left: 14,
    right: 14,
    paddingTop: 8,
    backgroundColor: THEME_COLORS.secondary.main,
  },
});
