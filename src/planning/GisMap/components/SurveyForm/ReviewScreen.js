import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {Button, Title} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {steps} from './SurveyForm';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ReviewScreen = () => {
  const insets = useSafeAreaInsets();

  const navigateToReview = () => {};

  return (
    <View
      style={{
        flexGrow: 1,
      }}>
      {steps.map(step => {
        return (
          <View key={step.step} style={styles.cardWrapper}>
            <Pressable
              style={styles.iconWrapper}
              // onPress={hasChildren ? handleRegionExpandClick(id) : noop}
            >
              <MaterialIcons
                size={30}
                // name={isExpanded ? 'expand-less' : 'expand-more'}
                name={'expand-more'}
                color={colors.primaryFontColor}
              />
            </Pressable>
            <Title style={styles.ticketCount}>{step.stepName}</Title>
          </View>
        );
      })}

      <Button
        style={[styles.button, {marginBottom: insets.bottom || 12}]}
        contentStyle={layout.button}
        color={THEME_COLORS.secondary.main}
        labelStyle={{
          color: THEME_COLORS.secondary.contrastText,
        }}
        uppercase
        mode="contained"
        icon={'map-marker-path'}
        onPress={navigateToReview}>
        Complete
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderBottomColor: colors.dividerColor2,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    paddingHorizontal: 12,
  },
  button: {
    marginTop: 50,
    marginHorizontal: 12,
  },
});

export default ReviewScreen;
