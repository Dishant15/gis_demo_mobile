import React, {useRef, useState, useCallback, useMemo} from 'react';
import {View, InteractionManager, BackHandler} from 'react-native';
import {Marker, Polygon} from 'react-native-maps';
import {polygon, point, booleanPointInPolygon} from '@turf/turf';
import * as Animatable from 'react-native-animatable';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from 'react-query';

import {Card} from 'react-native-paper';

import {isNull, get, size, differenceBy, join, split} from 'lodash';

import Map from '~Common/components/Map';
import FloatingCard from '~Common/components/FloatingCard';
import {IconButton} from '~Common/components/Button';

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
import {upsertSurveyUnit} from '~GeoServey/data/geoSurvey.service';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  getLocationPermissionType,
  getMapType,
} from '~Common/data/appstate.selector';
import {getEdgePadding} from '~utils/app.utils';

import {latLongMapToCoords, pointLatLongMapToCoords} from '~utils/map.utils';
import {MY_LOCATION_BUTTON_POSITION} from '~Common/components/Map/map.constants';
import {PERMISSIONS_TYPE} from '~Common/data/appstate.reducer';

/**
 * Parent:
 *    root.navigation
 */
const UnitMap = ({navigation}) => {
  const {bottom} = useSafeAreaInsets();

  const isReviewed = useSelector(getIsReviewed);
  const unitList = useSelector(getGeoSurveyUnitList);
  const unitData = useSelector(getGeoSurveyUnitFormData);
  const surveyId = useSelector(getSelectedSurveyId);
  const mapType = useSelector(getMapType);
  const locationPermType = useSelector(getLocationPermissionType);

  const surveyCoords = useSelector(getSurveyCoordinates);
  const surveyStatus = useSelector(getSurveyStatus);
  const dispatch = useDispatch();

  const mapRef = useRef();

  const [showMap, setMapVisibility] = useState(false);
  const [showMapRender, setMapRender] = useState(false);
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
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
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
      if (isReviewed) {
        navigation.navigate(screens.reviewScreen);
      } else {
        navigation.navigate(screens.unitList);
      }
      showToast('Marker cordinate updated successfully.', TOAST_TYPE.SUCCESS);
    },
    onError: err => {
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

  const onMapReady = e => {
    mapRef.current.fitToCoordinates(surveyCoords, {
      edgePadding: getEdgePadding(bottom),
      animated: true,
    });
    setCoordinate(unitData.coordinates);
  };

  const handleMapClick = e => {
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    setCoordinate(coords);
  };

  const onMapLoaded = () => {
    setTimeout(() => {
      setMapRender(true);
    }, 10);
  };

  const handleCustomBack = () => {
    if (isReviewed) {
      navigation.navigate(screens.reviewScreen);
    } else {
      navigation.goBack();
    }
  };

  let strokeColor = colors.warning; // Submited, status "S"
  if (surveyStatus === 'V') {
    strokeColor = colors.success;
  } else if (surveyStatus === 'R') {
    strokeColor = colors.error;
  }

  return (
    <View style={layout.container}>
      <FloatingCard title="Add Marker" subtitle="Add marker within boundary">
        <Card.Actions>
          <IconButton
            icon="keyboard-backspace"
            color={THEME_COLORS.error.main}
            textColor={THEME_COLORS.error.contrastText}
            text="Go Back"
            onPress={handleCustomBack}
            style={[layout.smallButton, layout.smallButtonMR]}
          />
          <IconButton
            icon="check"
            color={THEME_COLORS.primary.main}
            textColor={THEME_COLORS.error.contrastText}
            text={isAdd ? 'Save Location' : 'Update Location'}
            onPress={handleButtonPress}
            loading={isLoading}
            disabled={!isMarker}
            style={[layout.smallButton, layout.smallButtonMR]}
          />
        </Card.Actions>
      </FloatingCard>
      <View style={[layout.container, layout.relative]}>
        {showMap ? (
          <Animatable.View animation="fadeIn" style={layout.container}>
            <Map
              ref={mapRef}
              showMapType
              mapType={mapType}
              showsUserLocation={locationPermType === PERMISSIONS_TYPE.ALLOW}
              myLocationButtonPosition={
                MY_LOCATION_BUTTON_POSITION.BOTTOM_RIGHT
              }
              onMapReady={onMapReady}
              onLayout={onMapReady} // hack to set coordinate on map re-render
              onMapLoaded={onMapLoaded}
              onPress={handleMapClick}
              onPoiClick={handleMapClick}
              mapPadding={getEdgePadding(bottom)}>
              {showMapRender ? (
                <>
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
                </>
              ) : null}
            </Map>
          </Animatable.View>
        ) : null}
      </View>
    </View>
  );
};

export default UnitMap;
