import React, {useMemo, useRef, useCallback, useState} from 'react';
import {View, Dimensions, StyleSheet, ScrollView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {size, get} from 'lodash';
import {Card, Button, Paragraph, Subheading} from 'react-native-paper';

import BackHeader from '~components/Header/BackHeader';
import {layout, screens, colors} from '~constants/constants';
import {
  getGeoSurveyCoords,
  getGeoSurveyUnitList,
  getGeoSurveyFormData,
} from '~data/selectors/geoSurvey.selectors';
import {getInitialRegion} from '~utils/app.utils';
import Api from '~utils/api.utils';
import {apiAddSurvey} from '~constants/url.constants';
import {resetSurveyData} from '~data/reducers/geoSurvey.reducer';

const {width, height} = Dimensions.get('window');

const ReviewScreen = ({navigation}) => {
  const mapRef = useRef();
  const coordinates = useSelector(getGeoSurveyCoords);
  const formData = useSelector(getGeoSurveyFormData);
  const unitList = useSelector(getGeoSurveyUnitList);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

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
    navigation.navigate(screens.surveyList);
  };

  const handleSubmit = () => {
    console.log('final data', coordinates, formData, unitList);
    setLoading(true);
    Api.post(apiAddSurvey(), {
      coordinates,
      boundaryData: formData,
      unitList,
    })
      .then(res => {
        console.log('res', res);
        setLoading(false);
        dispatch(resetSurveyData());
        navigation.navigate(screens.surveyList);
      })
      .catch(err => {
        console.log('err', err.response);
        setLoading(false);
      });
  };

  const navigateToSurveyMap = useCallback(() => {
    navigation.navigate(screens.surveyDetails);
  }, []);

  const navigateToSurveyForm = useCallback(() => {
    navigation.navigate(screens.surveyForm);
  }, []);

  const navigateToUnitMap = useCallback(
    () => () => {
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  const navigateToUnitForm = useCallback(
    () => () => {
      navigation.navigate(screens.unitForm);
    },
    [],
  );

  return (
    <View style={layout.container}>
      <BackHeader
        title="Review"
        subtitle="review your survey before submit"
        onGoBack={navigation.goBack}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: width,
            height: height / 2,
          }}
          initialRegion={getInitialRegion(
            width,
            height / 2,
            0.01203651641793968,
          )}
          zoomEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          onMapReady={() => {
            if (size(coordinates)) {
              mapRef.current.fitToCoordinates(coordinates, {animated: true});
            }
          }}>
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
          {size(coordinates) ? <Polygon coordinates={coordinates} /> : null}
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
            <Button
              style={styles.discardBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="outlined"
              onPress={handleDiscart}>
              Discard
            </Button>
            <Button
              style={styles.submitBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              loading={loading}
              mode="contained"
              onPress={handleSubmit}>
              Submit
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
    flex: 2,
    marginLeft: 6,
  },
});

export default ReviewScreen;
