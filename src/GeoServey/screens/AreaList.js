import React from 'react';
import {View, FlatList} from 'react-native';
import {Card, Title, Subheading, Paragraph} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {size} from 'lodash';

import Loader from '~Common/Loader';
import {setAreaData, setAreaIndex} from '~GeoServey/data/geoSurvey.reducer';
import {fetchAreaPockets} from '~GeoServey/data/geoSurvey.service';
import {layout, screens} from '~constants/constants';

import {coordsToLatLongMap} from '~utils/map.utils';

/**
 * Renders area list
 *
 * when user clicks on any area it will navigate to map with polygon
 *
 * Parent
 *    drawer.navigation
 */
const AreaList = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();

  const {isLoading, data, refetch} = useQuery(
    'areaPocketList',
    fetchAreaPockets,
    {
      select: queryData => {
        // return queryData;
        return queryData.map(d => {
          // [ [lat, lng], ...]
          const {coordinates} = d;
          d.path = coordsToLatLongMap(coordinates);
          return d;
        });
      },
    },
  );

  return (
    <View style={[layout.container, layout.relative]}>
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={data}
        renderItem={({item, index}) => {
          return (
            <Card
              style={{marginBottom: 12}}
              onPress={() => {
                dispatch(setAreaData(item));
                navigation.navigate(screens.surveyList);
              }}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>
                  {item.area} - {item.pincode}
                </Paragraph>
                <Paragraph>Surveys - {item.survey_count}</Paragraph>
              </Card.Content>
            </Card>
          );
        }}
        onRefresh={refetch}
        refreshing={!!(isLoading && size(data))}
        ListEmptyComponent={
          <View style={[layout.center, {paddingVertical: 200}]}>
            <Subheading>No areas yet. please contact admin.</Subheading>
          </View>
        }
      />
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default AreaList;
