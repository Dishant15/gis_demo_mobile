import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Button, Title, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {colors, layout, THEME_COLORS} from '~constants/constants';
import {STEPS_CONFIG} from './configuration';

const ReviewScreen = () => {
  const insets = useSafeAreaInsets();
  const [showDetails, setShowDetails] = useState(null);
  const navigateToReview = () => {};

  return (
    <View
      style={{
        flexGrow: 1,
      }}>
      {STEPS_CONFIG.map(config => {
        const stepTitle = config.sections[0].title;
        const isExpanded = showDetails === stepTitle;
        return (
          <View key={stepTitle}>
            <View style={styles.cardWrapper}>
              <Pressable
                style={styles.iconWrapper}
                onPress={() => setShowDetails(isExpanded ? null : stepTitle)}>
                <MaterialIcons
                  size={30}
                  name={isExpanded ? 'expand-less' : 'expand-more'}
                  color={colors.primaryFontColor}
                />
              </Pressable>
              <Title style={styles.ticketCount}>{stepTitle}</Title>
            </View>
            {isExpanded ? <Text>Here</Text> : null}
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
