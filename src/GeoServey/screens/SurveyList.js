import React, {useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {
  Card,
  Title,
  Subheading,
  Paragraph,
  Chip,
  Button,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {replace, size} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import BackHeader from '~Common/components/Header/BackHeader';

import {setReview, setSurveyData} from '~GeoServey/data/geoSurvey.reducer';
import {layout, screens, colors} from '~constants/constants';

import {getSurveyBoundaryList} from '~GeoServey/data/geoSurvey.selectors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Renders survey list
 *
 * when user clicks on any area it will navigate to map with polygon
 *
 * Parent
 *    drawer.navigation
 */
const SurveyList = props => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // get survey list from redux store
  const surveyList = useSelector(getSurveyBoundaryList);

  useEffect(() => {
    dispatch(setReview(false));
  }, []);

  const navigateToMap = useCallback(() => {
    dispatch(setSurveyData(null));
    dispatch(setReview(false));
    navigation.navigate(screens.surveyMap);
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Surveys" onGoBack={navigation.goBack} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={surveyList}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const {name, area, pincode, tags} = item;
          return (
            <Pressable
              style={styles.cardItem}
              onPress={() => {
                dispatch(
                  setSurveyData({
                    surveyIndex: index,
                    surveyData: item,
                  }),
                );
                navigation.navigate(screens.reviewScreen);
              }}>
              <View style={styles.content}>
                <Title>{name}</Title>
                <Paragraph>
                  {area} - {pincode}
                </Paragraph>
                <Paragraph>Total Units - {size(item.units)}</Paragraph>
                <View style={styles.chipWrapper}>
                  {tags.map(tag => (
                    <Chip
                      key={tag}
                      style={styles.chip}
                      textStyle={styles.chipTextStyle}>
                      {replace(tag, '_', ' ')}
                    </Chip>
                  ))}
                </View>
              </View>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  size={22}
                  name="chevron-right"
                  color={'#767676'}
                />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Subheading>Survey list is Empty</Subheading>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: colors.separator}} />
        )}
      />
      {/* map-marker-path */}

      <Button
        style={[styles.buttonStyle, {paddingBottom: insets.bottom || 0}]}
        contentStyle={layout.button}
        color={colors.black}
        uppercase
        mode="contained"
        icon={'map-marker-path'}
        onPress={navigateToMap}>
        View on map
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
  },
  cardHeader: {
    marginVertical: 12,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
    // borderRadius: 4,
  },
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  buttonStyle: {
    borderRadius: 0,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // chipTextStyle: {
  //   marginVertical: 0,
  //   marginLeft: 0,
  //   marginRight: 0,
  //   paddingHorizontal: 3,
  // },
});

export default SurveyList;
