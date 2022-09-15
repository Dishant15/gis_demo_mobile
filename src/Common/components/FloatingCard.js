import React from 'react';
import {StyleSheet} from 'react-native';

import {Card} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {THEME_COLORS, Z_INDEX} from '~constants/constants';

const FloatingCard = props => {
  const {children, title, subtitle, isAbsolute = true} = props;
  const {top} = useSafeAreaInsets();
  return (
    <Card
      elevation={3}
      style={
        isAbsolute
          ? [styles.card, styles.cartContent, {top: Math.max(top + 14, 14)}]
          : styles.cartContent
      }>
      <Card.Title
        title={title}
        titleStyle={styles.titleStyle}
        subtitle={subtitle}
        subtitleStyle={styles.subtitleStyle}
        subtitleNumberOfLines={3}
        titleNumberOfLines={3}
      />
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
  },
  cartContent: {
    backgroundColor: THEME_COLORS.secondary.main,
  },
  titleStyle: {
    color: THEME_COLORS.secondary.contrastText,
  },
  subtitleStyle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
