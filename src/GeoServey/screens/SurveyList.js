import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
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

import {setSurveyData} from '~GeoServey/data/geoSurvey.reducer';
import {layout, screens, colors} from '~constants/constants';

import {getSurveyBoundaryList} from '~GeoServey/data/geoSurvey.selectors';

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

  const navigateToMap = useCallback(() => {
    dispatch(setSurveyData(null));
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
            <Card
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
              <Card.Content>
                <Title>{name}</Title>
                <Paragraph>
                  {area} - {pincode}
                </Paragraph>
                <Paragraph>Units - {size(item.units)}</Paragraph>
                <View style={styles.chipWrapper}>
                  {tags.map(tag => (
                    <Chip key={tag} style={styles.chip}>
                      {replace(tag, '_', ' ')}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Subheading>Survey list is Empty</Subheading>
          </View>
        }
      />

      <Button
        style={[styles.buttonStyle, {paddingBottom: insets.bottom || 0}]}
        contentStyle={layout.button}
        color={colors.black}
        uppercase
        mode="contained"
        onPress={navigateToMap}>
        View on map
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    marginBottom: 12,
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
  },
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  buttonStyle: {
    borderRadius: 0,
  },
});

export default SurveyList;
