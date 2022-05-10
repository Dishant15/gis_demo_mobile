import React, {useMemo, useRef} from 'react';
import {View, Dimensions, StyleSheet, ScrollView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {size, get} from 'lodash';
import {Card, Button, Paragraph, Subheading} from 'react-native-paper';

import BackHeader from '~components/Header/BackHeader';
import {layout, screens} from '~constants/constants';
import {
  getGeoSurveyCoords,
  getGeoSurveyUnitList,
  getGeoSurveyFormData,
} from '~data/selectors/geoSurvey.selectors';
import {getInitialRegion} from '~utils/app.utils';

const {width, height} = Dimensions.get('window');

const ReviewScreen = ({navigation}) => {
  const mapRef = useRef();
  const coordinates = useSelector(getGeoSurveyCoords);
  const formData = useSelector(getGeoSurveyFormData);
  const unitList = useSelector(getGeoSurveyUnitList);

  const unitMarkerList = useMemo(() => {
    const newList = [];
    for (let index = 0; index < unitList.length; index++) {
      if (size(get(unitList, [index, 'coordinates']))) {
        newList.push(unitList[index].coordinates);
      }
    }
    return newList;
  }, [unitList]);

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
              <Button color="blue">Edit Boundary</Button>
              <Button color="blue">Edit Details</Button>
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
                      <Button color="blue">Edit Location</Button>
                      <Button color="blue">Edit Details</Button>
                    </Card.Actions>
                  </Card>
                );
              })}
            </>
          ) : null}
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
});

export default ReviewScreen;
