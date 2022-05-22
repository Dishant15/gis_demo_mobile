import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Card, Title, Subheading, Paragraph, Chip} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {get, replace, size, split} from 'lodash';

import BackHeader from '~Common/components/Header/BackHeader';

import Loader from '~Common/Loader';
import {setSurveyData} from '~GeoServey/data/geoSurvey.reducer';
import {fetchSurveyList} from '~GeoServey/data/geoSurvey.service';
import {layout, screens} from '~constants/constants';

import {coordsToLatLongMap} from '~utils/map.utils';

/**
 * Renders survey list
 *
 * when user clicks on any area it will navigate to map with polygon
 *
 * Parent
 *    drawer.navigation
 */
const SurveyList = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();

  const {isLoading, data, refetch} = useQuery('surveyList', fetchSurveyList, {
    select: queryData => {
      // return queryData;
      return queryData.map(d => {
        // [ [lat, lng], ...]
        const {coordinates} = d;
        d.path = coordsToLatLongMap(coordinates);
        return d;
      });
    },
  });

  const handleAddSurvey = useCallback(() => {
    navigation.navigate(screens.surveyMap);
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Surveys" onGoBack={navigation.goBack} />
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={data}
        renderItem={({item, index}) => {
          const tags = split(get(item, 'tags', []), ',');
          return (
            <Card
              style={{marginBottom: 12}}
              onPress={() => {
                dispatch(setSurveyData(item));
                navigation.navigate(screens.reviewScreen);
              }}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>
                  {item.area} - {item.pincode}
                </Paragraph>
                <Paragraph>Units - {size(item.units)}</Paragraph>
                <View style={styles.chipWrapper}>
                  {tags.map(tag => (
                    <Chip style={styles.chip}>{replace(tag, '_', ' ')}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          );
        }}
        onRefresh={refetch}
        refreshing={!!(isLoading && size(data))}
        ListHeaderComponent={
          <Card
            onPress={handleAddSurvey}
            style={{
              marginVertical: 12,
            }}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Survey</Title>
            </Card.Content>
          </Card>
        }
        ListEmptyComponent={
          <View style={[layout.center, {paddingVertical: 200}]}>
            <Subheading>No survey yet.</Subheading>
          </View>
        }
      />
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chipWrapper: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
  },
});

export default SurveyList;
