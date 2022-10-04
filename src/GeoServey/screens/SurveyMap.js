import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  InteractionManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import size from 'lodash/size';

import {Polygon} from 'react-native-maps';
import {Button, Card} from 'react-native-paper';
import Map from '~Common/components/Map';

import * as Animatable from 'react-native-animatable';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {polygon, booleanContains} from '@turf/turf';

import CustomMarker from '~Common/CustomMarker';

import {colors, layout, screens, THEME_COLORS} from '~constants/constants';
import {
  getSurveyCoordinates,
  getIsReviewed,
  getSelectedArea,
  getSelectedSurveyId,
  getSurveyBoundaryList,
  getGeoSurveyFormData,
  getTicketStatus,
} from '~GeoServey/data/geoSurvey.selectors';
import {
  updateSurveyFormData,
  updateSurveyList,
} from '~GeoServey/data/geoSurvey.reducer';
import {useMutation} from 'react-query';
import {updateGeoServey} from '~GeoServey/data/geoSurvey.service';
import {latLongMapToCoords} from '~utils/map.utils';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  getCurrentLocation,
  getLocationPermissionType,
  getMapType,
} from '~Common/data/appstate.selector';
import {PERMISSIONS_TYPE} from '~Common/data/appstate.reducer';

import FloatingCard from '~Common/components/FloatingCard';

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.00444;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const EDGE_PADDING = {
  top: 150,
  right: 0,
  bottom: 20,
  left: 12,
};

/**
 * render maps with survey points
 *
 * Parent:
 *    root.navigation
 */
const SurveyMap = ({navigation}) => {
  const isFocused = useIsFocused();
  const {top} = useSafeAreaInsets();

  const coords = useSelector(getSurveyCoordinates);
  const isReviewed = useSelector(getIsReviewed);
  const selectedArea = useSelector(getSelectedArea);
  const surveyList = useSelector(getSurveyBoundaryList);
  const formData = useSelector(getGeoSurveyFormData);
  // surveyId indicate that survey is add or edit
  const surveyId = useSelector(getSelectedSurveyId);
  const ticketStatus = useSelector(getTicketStatus);

  // location
  const locationPermType = useSelector(getLocationPermissionType);
  const currentLocation = useSelector(getCurrentLocation);
  const mapType = useSelector(getMapType);

  const [showMap, setMapVisibility] = useState(false);
  // render polygons after map loaded
  const [showMapRender, setMapRender] = useState(false);
  const [coordinates, setCoordinates] = useState(coords);
  const [startEditing, setStartEditing] = useState(!!surveyId);

  const dispatch = useDispatch();
  const mapRef = useRef();

  // enable btn if polygon is created ( alteast 3 markers )
  const isPolygonValid = size(coordinates) > 2;

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

  const {mutate, isLoading} = useMutation(updateGeoServey, {
    onSuccess: res => {
      dispatch(updateSurveyFormData({...formData, coordinates}));
      dispatch(updateSurveyList({...formData, coordinates}));
      navigation.navigate(screens.reviewScreen);
      showToast('Survey boundary updated successfully.', TOAST_TYPE.SUCCESS);
    },
    onError: err => {
      showToast('Input Error', TOAST_TYPE.ERROR);
      console.log('🚀 ~ file: SurveyForm.js ~ line 54 ~ err', err.response);
    },
  });

  const handleUpdatePolygon = () => {
    mutate({id: formData.id, coordinates: latLongMapToCoords(coordinates)});
  };

  const handleSavePolygon = () => {
    dispatch(updateSurveyFormData({...formData, coordinates}));
    navigation.navigate(isReviewed ? screens.reviewScreen : screens.surveyForm);
  };

  const handleBtnPress = () => {
    if (!startEditing) {
      setStartEditing(true);
      return;
    }
    if (isLoading) return;
    if (!isPolygonValid) {
      showToast('Please create a valid polygon', TOAST_TYPE.ERROR);
      return;
    }
    const parentPoly = polygon([latLongMapToCoords(selectedArea.coordinates)]);
    const childPoly = polygon([latLongMapToCoords(coordinates)]);

    if (!booleanContains(parentPoly, childPoly)) {
      showToast(
        'Survey boundary polygon must be contained inside assigned area',
        TOAST_TYPE.ERROR,
      );
      return;
    }

    if (surveyId) {
      handleUpdatePolygon();
    } else {
      handleSavePolygon();
    }
  };

  const handleMarkerDrag = index => e => {
    let newCoords = [...coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);
    setCoordinates(newCoords);
  };

  const handleMapClick = e => {
    if (!startEditing) return;
    if (!e.nativeEvent.coordinate) return;
    const updatedCoords = e.nativeEvent.coordinate;
    setCoordinates([...coordinates, updatedCoords]);
  };

  const onMapReady = () => {
    mapRef.current.fitToCoordinates(selectedArea.coordinates, {
      edgePadding: EDGE_PADDING,
      animated: true,
    });
  };

  const handleCurrentLocationPress = () => {
    mapRef.current.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      200,
    );
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
      <StatusBar barStyle="dark-content" />
      {ticketStatus === 'A' ? (
        <FloatingCard
          title={startEditing ? 'Finalise polygon' : 'Create Polygon'}
          subtitle={
            startEditing
              ? 'Long press and drag points on polygon edges to fine tune polygon shape'
              : 'Create polygon inside boundary area'
          }>
          {startEditing ? (
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
                onPress={handleBtnPress}
                style={layout.smallButton}>
                Complete
              </Button>
            </Card.Actions>
          ) : (
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
                onPress={handleBtnPress}
                style={layout.smallButton}>
                Start Drawing
              </Button>
            </Card.Actions>
          )}
        </FloatingCard>
      ) : null}
      <View style={[layout.container, layout.relative]}>
        {showMap ? (
          <Animatable.View animation="fadeIn" style={layout.container}>
            <Map
              showsUserLocation={locationPermType === PERMISSIONS_TYPE.ALLOW}
              showsMyLocationButton={
                locationPermType === PERMISSIONS_TYPE.ALLOW
              }
              showsIndoorLevelPicker
              showMapType={true}
              mapType={mapType}
              topPosition={top + 154}
              ref={mapRef}
              onMapReady={onMapReady}
              onPress={handleMapClick}
              onPoiClick={handleMapClick}
              mapPadding={EDGE_PADDING}
              onMapLoaded={() => {
                setTimeout(() => {
                  console.log('map is loaded');
                  setMapRender(true);
                }, 10);
              }}>
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
              {size(surveyList) && showMapRender
                ? surveyList.map(survey => {
                    const {id, coordinates, status} = survey;
                    if (id === surveyId) return null;
                    let strokeColor = colors.warning; // Submited, status "S"
                    if (status === 'V') {
                      strokeColor = colors.success;
                    } else if (status === 'R') {
                      strokeColor = colors.error;
                    }
                    return (
                      <Polygon
                        key={id}
                        coordinates={coordinates}
                        strokeWidth={2}
                        strokeColor={strokeColor}
                        fillColor={`${strokeColor}14`}
                      />
                    );
                  })
                : null}
              {size(selectedArea.coordinates) && showMapRender ? (
                <Polygon
                  coordinates={selectedArea.coordinates}
                  strokeWidth={2}
                  strokeColor={colors.black}
                  fillColor="transparent"
                />
              ) : null}
            </Map>
          </Animatable.View>
        ) : null}
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
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  disableBtn: {
    backgroundColor: '#A9A9A9',
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
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    borderWidth: 2,
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

export default SurveyMap;
