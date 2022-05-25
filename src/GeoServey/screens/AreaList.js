import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Card, Title, Subheading, Paragraph} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {size} from 'lodash';

import Loader from '~Common/Loader';
import {setTaskData} from '~GeoServey/data/geoSurvey.reducer';
import {fetchUserTaskList} from '~GeoServey/data/geoSurvey.service';
import {layout, screens} from '~constants/constants';

import {coordsToLatLongMap} from '~utils/map.utils';

/**
 * Renders task list
 *
 * when user clicks on any area it will navigate to survey list of that area
 *
 * Parent
 *    drawer.navigation
 */
const AreaList = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const {isLoading, data, refetch} = useQuery(
    'userTaskList',
    fetchUserTaskList,
  );

  const userTaskList = useMemo(() => {
    let resultData = data ? [...data] : [];
    for (let r_ind = 0; r_ind < resultData.length; r_ind++) {
      const userTask = resultData[r_ind];
      let {area_pocket, survey_boundaries} = userTask;

      userTask.survey_count = size(survey_boundaries);
      // convert area coordinate data
      area_pocket.coordinates = coordsToLatLongMap(area_pocket.coordinates);
      // convert survey_boundaries coordinate, tags data
      for (let s_ind = 0; s_ind < survey_boundaries.length; s_ind++) {
        const survey = survey_boundaries[s_ind];
        const {units} = survey;
        // convert survey_boundaries.units coordinate, tags data
        survey.coordinates = coordsToLatLongMap(survey.coordinates);
        survey.tags = survey.tags.toString().split(',');
        for (let u_ind = 0; u_ind < units.length; u_ind++) {
          const unit = units[u_ind];
          // convert survey_boundaries.units coordinate, tags data
          unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
          unit.tags = unit.tags.toString().split(',');
        }
      }
    }

    return resultData;
  }, [data]);

  return (
    <View style={[layout.container, layout.relative]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={userTaskList}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const {name, area_pocket} = item;
          return (
            <Card
              style={{marginBottom: 12}}
              onPress={() => {
                dispatch(setTaskData(item));
                navigation.navigate(screens.surveyList);
              }}>
              <Card.Content>
                <Title>{name}</Title>
                <Paragraph>
                  {area_pocket.area} - {area_pocket.pincode}
                </Paragraph>
                <Paragraph>Surveys - {item.survey_count}</Paragraph>
              </Card.Content>
            </Card>
          );
        }}
        onRefresh={refetch}
        refreshing={!!(isLoading && size(userTaskList))}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={[layout.container, layout.center]}>
              <Subheading>
                Your task list is empty. please contact admin.
              </Subheading>
            </View>
          )
        }
      />
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
});

export default AreaList;
