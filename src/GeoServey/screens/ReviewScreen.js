import React, {useMemo, useRef, useCallback, useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, ScrollView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {size, get, join, map} from 'lodash';
import {Card, Button, Paragraph, Subheading} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';
import {layout, screens, colors} from '~constants/constants';
import {
  getGeoSurveyCoords,
  getGeoSurveyUnitList,
  getGeoSurveyFormData,
  getSelectedArea,
} from '~GeoServey/data/geoSurvey.selectors';
import Api from '~utils/api.utils';
import {apiAddSurvey} from '~constants/url.constants';
import {
  resetSurveyData,
  setReview,
  selectUnit,
} from '~GeoServey/data/geoSurvey.reducer';
import {useIsFocused} from '@react-navigation/native';
import {latLongMapToCoords} from '~utils/map.utils';
import {useMutation} from 'react-query';
import {postGeoServey} from '~GeoServey/data/geoSurvey.service';
import {parseErrorMessage} from '~utils/app.utils';

const {width, height} = Dimensions.get('window');

/**
 * Parent:
 *    root.navigation
 */
const ReviewScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const mapRef = useRef();
  const coordinates = useSelector(getGeoSurveyCoords);
  const formData = useSelector(getGeoSurveyFormData);
  const unitList = useSelector(getGeoSurveyUnitList);
  const selectedArea = useSelector(getSelectedArea);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReview());
  }, []);

  const {mutate, isLoading} = useMutation(postGeoServey, {
    onSuccess: res => {
      handleDiscart();
    },
    onError: err => {
      const errorMessage = parseErrorMessage(err);
      console.log(
        '🚀 ~ file: ReviewScreen.js ~ line 52 ~ ReviewScreen ~ errorMessage',
        errorMessage,
      );
    },
  });

  const unitMarkerList = useMemo(() => {
    const newList = [];
    for (let index = 0; index < unitList.length; index++) {
      if (size(get(unitList, [index, 'coordinates']))) {
        newList.push(unitList[index].coordinates);
      }
    }
    return newList;
  }, [unitList]);

  const handleDiscart = () => {
    // reset and delete
    dispatch(resetSurveyData());
    navigation.navigate(screens.areaList);
  };

  const handleSubmit = () => {
    // convert data
    const data = {
      boundaryData: {
        ...formData,
        parentId: selectedArea.id,
        tags: join(formData.tags, ','),
        coordinates: latLongMapToCoords(coordinates),
      },
      unitList: map(unitList, unit => ({...unit, tags: join(unit.tags, ',')})),
    };
    mutate(data);
  };

  const navigateToSurveyList = useCallback(() => {
    navigation.navigate(screens.surveyList);
  }, []);

  const navigateToSurveyMap = useCallback(() => {
    navigation.navigate(screens.surveyMap);
  }, []);

  const navigateToSurveyForm = useCallback(() => {
    navigation.navigate(screens.surveyForm);
  }, []);

  const navigateToUnitMap = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  const navigateToUnitForm = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitForm);
    },
    [],
  );

  const onMapLayout = e => {
    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 12,
      },
      animated: true,
    });
  };

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader
        title="Review"
        subtitle="review your survey before submit"
        onGoBack={handleDiscart}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: width,
            height: height / 2,
          }}
          initialRegion={{
            longitudeDelta: 0.06032254546880722,
            latitudeDelta: 0.0005546677,
            longitude: 72.56051184609532,
            latitude: 23.024334044995985,
          }}
          // zoomEnabled={false}
          // scrollEnabled={false}
          // pitchEnabled={false}
          // rotateEnabled={false}
          onMapReady={onMapLayout}
          onLayout={onMapLayout}>
          {unitMarkerList.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={marker}
                stopPropagation
                flat
                tracksInfoWindowChanges={false}
              />
            );
          })}
          {size(coordinates) ? (
            <Polygon
              coordinates={coordinates}
              strokeWidth={2}
              strokeColor={'#FFA701'}
              fillColor="#FFA70114"
            />
          ) : null}
        </MapView>
        <View style={styles.contentWrapper}>
          <Subheading style={styles.title}>Boundary</Subheading>
          <Card elevation={3}>
            <Card.Content>
              <Subheading>{get(formData, 'name')}</Subheading>
              <Paragraph>
                {get(formData, 'address')} {'\n'}
                {get(formData, 'area')}, {get(formData, 'city')},{' '}
                {get(formData, 'state')}, {get(formData, 'pincode')}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button color="blue" onPress={navigateToSurveyMap}>
                Edit Boundary
              </Button>
              <Button color="blue" onPress={navigateToSurveyForm}>
                Edit Details
              </Button>
            </Card.Actions>
          </Card>
          {size(unitList) ? (
            <>
              <Subheading style={styles.title}>Units</Subheading>
              {unitList.map((unit, index) => {
                return (
                  <Card elevation={3} key={index} style={{marginBottom: 14}}>
                    <Card.Content>
                      <Subheading>{get(unit, 'name')}</Subheading>
                      <Paragraph>
                        {get(unit, 'category')} {'\n'}
                        Floors: {get(unit, 'floors')}, Hours per floor:{' '}
                        {get(unit, 'house_per_floor')}
                        {'\n'}
                        Total house pass : {get(unit, 'total_home_pass')}
                      </Paragraph>
                    </Card.Content>
                    <Card.Actions>
                      <Button color="blue" onPress={navigateToUnitMap(index)}>
                        Edit Location
                      </Button>
                      <Button color="blue" onPress={navigateToUnitForm(index)}>
                        Edit Details
                      </Button>
                    </Card.Actions>
                  </Card>
                );
              })}
            </>
          ) : null}
          <View style={styles.buttonWrapper}>
            {/* <Button
              style={styles.discardBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="outlined"
              onPress={handleDiscart}>
              Discard
            </Button> */}
            <Button
              style={styles.submitBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="contained"
              onPress={navigateToUnitMap(-1)}>
              Add Unit
            </Button>
            <Button
              style={styles.submitBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              loading={isLoading}
              mode="contained"
              onPress={navigateToSurveyList}>
              Go to Survey List
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  buttonWrapper: {
    paddingTop: 18,
    paddingBottom: 36,
    flexDirection: 'row',
  },
  discardBtn: {
    flex: 1,
    marginRight: 6,
  },
  submitBtn: {
    flex: 1,
    // marginLeft: 6,
  },
});

export default ReviewScreen;
