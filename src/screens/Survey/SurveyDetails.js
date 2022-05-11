import React, {useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, BackHandler} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {FAB, Portal, Provider, Button} from 'react-native-paper';
import {size} from 'lodash';

import {layout, screens} from '~constants/constants';
import BackHeader from '~components/Header/BackHeader';
import SurveyMap from '~components/Survey/SurveyMap';
import {useDispatch, useSelector} from 'react-redux';
import {
  getGeoSurveyCoords,
  getIsReviewed,
} from '~data/selectors/geoSurvey.selectors';
import {updateCoordinates} from '~data/reducers/geoSurvey.reducer';
import {getInitialRegion, noop} from '~utils/app.utils';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const SurveyDetails = ({navigation}) => {
  const isFocused = useIsFocused();
  const coords = useSelector(getGeoSurveyCoords);
  const isReviewed = useSelector(getIsReviewed);

  const [coordinates, setCoordinates] = useState(coords);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isReviewed) {
          navigation.navigate(screens.reviewScreen);
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isReviewed]),
  );

  const mapRef = useRef();

  const handleButtonPress = () => {
    dispatch(updateCoordinates(coordinates));
    navigation.navigate(isReviewed ? screens.reviewScreen : screens.surveyForm);
  };

  const handleMarkerDrag = index => e => {
    let newCoords = [...coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);
    setCoordinates(newCoords);
  };

  const handleMapClick = e => {
    console.log('onPress', e.nativeEvent.coordinate);
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    setCoordinates([...coordinates, coords]);
  };

  const handleMapPoiClick = e => {
    console.log('onPoiClick', e.nativeEvent.coordinate);
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    setCoordinates([...coordinates, coords]);
  };

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader title="Draw on Map" onGoBack={navigation.goBack} />
      <View style={[layout.container, layout.relative]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            longitudeDelta: 0.06032254546880722,
            latitudeDelta: 0.0005546677,
            longitude: 72.56051184609532,
            latitude: 23.024334044995985,
          }}
          loadingEnabled
          onLayout={() => {
            mapRef.current.animateToRegion(
              {
                longitudeDelta: 0.06032254546880722,
                latitudeDelta: 0.0005546677,
                longitude: 72.56051184609532,
                latitude: 23.024334044995985,
              },
              1000,
            );
          }}
          provider={PROVIDER_GOOGLE}
          // onRegionChangeComplete={data => console.log(data)}
          onPress={handleMapClick}
          onPoiClick={handleMapPoiClick}>
          {coordinates.map((marker, i) => (
            <Marker
              coordinate={marker}
              key={i}
              icon={require('../../assets/img/circle_40.png')}
              tappable
              draggable
              onDragEnd={handleMarkerDrag(i)}
              stopPropagation
              flat
              tracksInfoWindowChanges={false}
            />
          ))}
          {size(coordinates) ? <Polygon coordinates={coordinates} /> : null}
        </MapView>
        <View style={styles.content}>
          <Button
            style={[layout.button, styles.drawBtn]}
            icon="pencil"
            mode="contained"
            onPress={handleButtonPress}>
            Save Polygon
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  drawBtn: {
    alignSelf: 'flex-end',
  },
});

export default SurveyDetails;
