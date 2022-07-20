import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  BackHandler,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {isNull, get, size, differenceBy, join, split} from 'lodash';
import {polygon, point, booleanPointInPolygon} from '@turf/turf';
import * as Animatable from 'react-native-animatable';
import {Button, Card, Title, Paragraph} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';
import {colors, layout, screens, THEME_COLORS} from '~constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  getGeoSurveyUnitFormData,
  getGeoSurveyUnitList,
  getIsReviewed,
  getSurveyCoordinates,
  getSelectedSurveyId,
  getSurveyStatus,
} from '~GeoServey/data/geoSurvey.selectors';
import {
  updateUnitFormData,
  updateSurveyUnitList,
} from '~GeoServey/data/geoSurvey.reducer';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {upsertSurveyUnit} from '~GeoServey/data/geoSurvey.service';
import {useMutation} from 'react-query';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {getMapType} from '~Common/data/appstate.selector';

import DefaultMapImg from '~assets/img/map_default.png';
import SatelliteMapImg from '~assets/img/map_satellite.png';
import {toggleMapType} from '~Common/data/appstate.reducer';
import FastImage from 'react-native-fast-image';
import {latLongMapToCoords, pointLatLongMapToCoords} from '~utils/map.utils';
import FloatingCard from '~Common/components/FloatingCard';

/**
 * Parent:
 *    root.navigation
 */
const UnitMap = ({navigation}) => {
  const [showMap, setMapVisibility] = useState(false);

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const isReviewed = useSelector(getIsReviewed);
  const unitList = useSelector(getGeoSurveyUnitList);
  const unitData = useSelector(getGeoSurveyUnitFormData);
  const surveyId = useSelector(getSelectedSurveyId);
  const mapType = useSelector(getMapType);

  const surveyCoords = useSelector(getSurveyCoordinates);
  const surveyStatus = useSelector(getSurveyStatus);
  const dispatch = useDispatch();

  const mapRef = useRef();
  const [coordinate, setCoordinate] = useState(
    get(unitData, 'coordinates', null),
  );

  const isAdd = !Boolean(unitData.id);
  const markerSelected = !isNull(coordinate);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

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

  const {mutate, isLoading} = useMutation(upsertSurveyUnit, {
    onSuccess: res => {
      const newData = {
        ...res,
        tags: split(res.tags, ','),
        coordinates: {
          latitude: res.coordinates[1],
          longitude: res.coordinates[0],
        },
      };
      dispatch(updateUnitFormData(newData));
      dispatch(updateSurveyUnitList(newData));
      navigation.navigate(screens.reviewScreen);
      showToast('Marker cordinate updated successfully.', TOAST_TYPE.SUCCESS);
    },
    onError: err => {
      console.log('🚀 ~ file: SurveyForm.js ~ line 54 ~ err', err.response);
      showToast('Input Error', TOAST_TYPE.ERROR);
    },
  });

  const handleButtonPress = () => {
    if (isLoading) return;
    if (!markerSelected) {
      showToast('Tap on the map to select unit location', TOAST_TYPE.ERROR);
      return;
    }

    const surveyPoly = polygon([latLongMapToCoords(surveyCoords)]);
    const unitPoint = point(pointLatLongMapToCoords(coordinate));

    if (!booleanPointInPolygon(unitPoint, surveyPoly)) {
      showToast(
        'Unit location can not be outside survey boundary',
        TOAST_TYPE.ERROR,
      );
      return;
    }

    let newData = {...unitData, coordinates: coordinate};
    if (isAdd) {
      // update redux with map coordinates
      dispatch(updateUnitFormData(newData));
      navigation.navigate(screens.unitForm);
    } else {
      // call edit unit server api
      newData.parentId = surveyId;
      newData.tags = join(newData.tags, ',');
      mutate(newData);
    }
  };

  const handleMarkerDrag = useCallback(e => {
    const coords = e.nativeEvent.coordinate;
    setCoordinate(coords);
  }, []);

  const isMarker = !isNull(coordinate);

  const existingMarkers = useMemo(() => {
    let newList = [];
    for (let index = 0; index < unitList.length; index++) {
      if (size(get(unitList, [index, 'coordinates']))) {
        newList.push(unitList[index].coordinates);
      }
    }
    if (unitData.coordinates) {
      newList = differenceBy(newList, [unitData.coordinates], 'latitude');
    }
    return newList;
  }, [unitList, unitData]);

  const onMapLayout = e => {
    mapRef.current.fitToCoordinates(surveyCoords, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 12,
      },
      animated: true,
    });
    setCoordinate(unitData.coordinates);
  };

  const handleMapClick = e => {
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    setCoordinate(coords);
  };

  const handleCustomBack = () => {
    if (isReviewed) {
      navigation.navigate(screens.reviewScreen);
    } else {
      navigation.goBack();
    }
  };

  const handleMapType = () => {
    dispatch(toggleMapType());
  };

  if (!isFocused) return null;

  let strokeColor = colors.warning; // Submited, status "S"
  if (surveyStatus === 'V') {
    strokeColor = colors.success;
  } else if (surveyStatus === 'R') {
    strokeColor = colors.error;
  }

  return (
    <View style={layout.container}>
      {/* <BackHeader
        title="Add Marker"
        subtitle="Add marker within boundary"
        onGoBack={handleCustomBack}
      /> */}
      <FloatingCard title="Add Marker" subtitle="Add marker within boundary">
        <Card.Actions>
          <Button
            mode="contained"
            icon="keyboard-backspace"
            color={THEME_COLORS.error.main}
            style={[layout.smallButton, layout.smallButtonMR]}
            onPress={handleCustomBack}>
            Go Back
          </Button>
          <Button
            mode="contained"
            icon="check"
            color={THEME_COLORS.primary.main}
            style={layout.smallButton}
            loading={isLoading}
            disabled={!isMarker}
            onPress={handleButtonPress}>
            {isAdd ? 'Save' : 'Update'} Location
          </Button>
        </Card.Actions>
      </FloatingCard>
      <View style={[layout.container, layout.relative]}>
        {showMap ? (
          <Animatable.View animation="fadeIn" style={layout.container}>
            <MapView
              ref={mapRef}
              mapType={mapType}
              style={styles.map}
              initialRegion={{
                longitudeDelta: 0.06032254546880722,
                latitudeDelta: 0.0005546677,
                longitude: 72.56051184609532,
                latitude: 23.024334044995985,
              }}
              provider={PROVIDER_GOOGLE}
              onPress={handleMapClick}
              onLayout={onMapLayout}
              showsPointsOfInterest={false}>
              {existingMarkers.map((marker, index) => {
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
              {isMarker ? (
                <Marker
                  pinColor="green"
                  coordinate={coordinate}
                  tappable
                  draggable
                  onDragEnd={handleMarkerDrag}
                  stopPropagation
                  flat
                  tracksInfoWindowChanges={false}
                />
              ) : null}
              {size(surveyCoords) ? (
                <Polygon
                  coordinates={surveyCoords}
                  strokeWidth={2}
                  strokeColor={strokeColor}
                  fillColor={`${strokeColor}14`}
                />
              ) : null}
            </MapView>
          </Animatable.View>
        ) : null}
        <View style={styles.mapTypeWrapper}>
          <TouchableOpacity onPress={handleMapType}>
            <FastImage
              style={styles.mapTypeImage}
              resizeMode="cover"
              source={mapType === 'standard' ? SatelliteMapImg : DefaultMapImg}
            />
          </TouchableOpacity>
        </View>
        {/* <View
          pointerEvents="box-none"
          style={[
            styles.content,
            {
              marginBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              layout.button,
              styles.drawBtn,
              !markerSelected && styles.disableBtn,
            ]}
            disabled={!isMarker}
            onPress={handleButtonPress}>
            <Text style={styles.drawBtnTxt}>
              {isLoading
                ? 'Loading...'
                : `${isAdd ? 'Save' : 'Update'} Location`}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'black',
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    minWidth: 150,
  },
  drawBtnTxt: {
    color: 'white',
  },
  disableBtn: {
    backgroundColor: '#A9A9A9',
  },
  mapTypeWrapper: {
    position: 'absolute',
    right: 0,
    top: 65,
    right: 14,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeImage: {
    width: 44,
    height: 44,
  },
  // card design
  cartTitle: {
    color: colors.white,
  },
  paragraph: {
    fontSize: 15,
  },
});

export default UnitMap;
