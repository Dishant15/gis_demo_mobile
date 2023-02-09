import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Pressable,
  BackHandler,
  ScrollView,
} from 'react-native';
import {Button, Title, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import {colors, layout, THEME_COLORS} from '~constants/constants';
import {
  openElementDetails,
  openSurveyEditForm,
} from '~planning/data/planning.actions';
import {setSurveyWoScreenType} from '~planning/data/planningGis.reducer';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import TableContent from '../ElementDetailsTable/TableContent';
import {STEPS_CONFIG} from './configuration';

const ReviewScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [showDetails, setShowDetails] = useState(null);
  const {layerKey, data: mapStateData} = useSelector(getPlanningMapState);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', navigateToReview);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', navigateToReview);
    }, []),
  );

  const navigateToReview = () => {
    dispatch(openElementDetails({layerKey, elementId: mapStateData.elementId}));
    return true; // required for backHandler
  };

  return (
    <ScrollView
      style={{
        flexGrow: 1,
      }}>
      {STEPS_CONFIG.map((config, ind) => {
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
            {isExpanded ? (
              <ReviewDetails index={ind} surveyWorkorder={mapStateData} />
            ) : null}
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
    </ScrollView>
  );
};

const ReviewDetails = ({index, surveyWorkorder}) => {
  const dispatch = useDispatch();

  const rowDefs = STEPS_CONFIG[index].elementTableFields;
  return (
    <View>
      <TableContent
        elemData={surveyWorkorder}
        isLoading={false}
        rowDefs={rowDefs}
      />
      <Button
        style={[styles.btn2, {borderColor: THEME_COLORS.secondary.main}]}
        loading={false}
        contentStyle={[layout.button]}
        color={THEME_COLORS.secondary.main}
        uppercase
        mode="outlined"
        icon="pencil"
        onPress={() => {
          dispatch(openSurveyEditForm(index));
        }}>
        Edit
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
  btn2: {
    margin: 12,
  },
});

export default ReviewScreen;
