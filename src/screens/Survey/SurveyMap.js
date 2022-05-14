import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, BackHandler} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {size} from 'lodash';

import {colors, layout, screens} from '~constants/constants';
import BackHeader from '~components/Header/BackHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  getGeoSurveyCoords,
  getIsReviewed,
} from '~data/selectors/geoSurvey.selectors';
import {updateCoordinates} from '~data/reducers/geoSurvey.reducer';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomMarker from '~components/Common/CustomMarker';

const SurveyMap = ({navigation}) => {
  const insets = useSafeAreaInsets();
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

  const handleSavePolygon = () => {
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

  const handleCustomBack = () => {
    if (isReviewed) {
      navigation.navigate(screens.reviewScreen);
    } else {
      navigation.goBack();
    }
  };

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader title="Draw on Map" onGoBack={handleCustomBack} />
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
            mapRef.current.setCamera({
              center: {
                longitude: 72.56051184609532,
                latitude: 23.024334044995985,
              },
              pitch: 0,
              heading: 0,
              // Only when using Google Maps.
              zoom: 16,
            });
          }}
          provider={PROVIDER_GOOGLE}
          onPress={handleMapClick}
          onPoiClick={handleMapPoiClick}>
          {coordinates.map((marker, i) => (
            <CustomMarker
              coordinate={marker}
              anchor={{
                x: 0.5,
                y: 0.5,
              }}
              key={i}
              draggable
              onDragEnd={handleMarkerDrag(i)}
              stopPropagation
              flat
              tracksInfoWindowChanges={false}
            />
          ))}
          {size(coordinates) ? (
            <Polygon
              coordinates={coordinates}
              strokeWidth={2}
              strokeColor={'#3895D3'}
              fillColor="#3895D326"
            />
          ) : null}
        </MapView>
        <View
          style={[
            styles.content,
            {
              marginBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[layout.button, styles.drawBtn]}
            onPress={handleSavePolygon}>
            <Text style={styles.drawBtnTxt}>Save Boundary</Text>
          </TouchableOpacity>
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
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  drawBtn: {
    backgroundColor: 'black',
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
  },
  drawBtnTxt: {
    color: 'white',
  },
  markerWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 6,
    height: 6,
    backgroundColor: colors.black,
    borderRadius: 3,
  },
});

export default SurveyMap;
