import React, {useMemo} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {Title, Subheading, Paragraph} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import {orderBy, size} from 'lodash';

import Loader from '~Common/Loader';
import {setTaskData} from '~GeoServey/data/geoSurvey.reducer';
import {fetchUserTaskList} from '~GeoServey/data/geoSurvey.service';
import {colors, layout, screens} from '~constants/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        try {
          survey.broadband_availability = survey.broadband_availability
            .toString()
            .split(',');
        } catch (error) {
          survey.broadband_availability = [];
        }
        try {
          survey.cable_tv_availability = survey.cable_tv_availability
            .toString()
            .split(',');
        } catch (error) {
          survey.cable_tv_availability = [];
        }
        for (let u_ind = 0; u_ind < units.length; u_ind++) {
          const unit = units[u_ind];
          // convert survey_boundaries.units coordinate, tags data
          unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
          unit.tags = unit.tags.toString().split(',');
        }
      }
    }

    return orderBy(resultData, ['updated_on'], ['desc']);
  }, [data]);

  return (
    <View style={[layout.container, layout.relative]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={userTaskList}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const {name, area_pocket, survey_count} = item;
          return (
            <Pressable
              style={styles.itemWrapper}
              onPress={() => {
                dispatch(setTaskData(item));
                navigation.navigate(screens.surveyList);
              }}>
              <View style={styles.content}>
                <Title>{name}</Title>
                <Paragraph>
                  {area_pocket.area} - {area_pocket.pincode}
                </Paragraph>
                {survey_count ? (
                  <Paragraph>Total Surveys - {survey_count}</Paragraph>
                ) : (
                  <Paragraph>No survey added to this task yet</Paragraph>
                )}
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
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: colors.separator}} />
        )}
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
  itemWrapper: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AreaList;
