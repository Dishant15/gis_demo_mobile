import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  InteractionManager,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {size} from 'lodash';

import BackHeader from '~Common/components/Header/BackHeader';
import CustomMarker from '~Common/CustomMarker';

import {colors, layout, screens} from '~constants/constants';
import {
  getSurveyCoordinates,
  getIsReviewed,
  getSelectedArea,
  getSelectedSurveyId,
  getSurveyBoundaryList,
  getGeoSurveyFormData,
  getTaskId,
} from '~GeoServey/data/geoSurvey.selectors';
import {updateSurveyFormData} from '~GeoServey/data/geoSurvey.reducer';
import {useMutation} from 'react-query';
import {updateGeoServey} from '~GeoServey/data/geoSurvey.service';
import {latLongMapToCoords} from '~utils/map.utils';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

/**
 * render maps with survey points
 *
 * Parent:
 *    root.navigation
 */
const SurveyMap = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const coords = useSelector(getSurveyCoordinates);
  const isReviewed = useSelector(getIsReviewed);
  const selectedArea = useSelector(getSelectedArea);
  const surveyList = useSelector(getSurveyBoundaryList);
  const formData = useSelector(getGeoSurveyFormData);
  // surveyId indicate that survey is add or edit
  const surveyId = useSelector(getSelectedSurveyId);
  const taskId = useSelector(getTaskId);

  const [showMap, setMapVisibility] = useState(false);
  const [coordinates, setCoordinates] = useState(coords);
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
    const data = {
      ...formData,
      tags: Array.isArray(formData.tags)
        ? join(formData.tags, ',')
        : formData.tags,
      id: formData.id,
      coordinates: latLongMapToCoords(coordinates),
      taskId,
    };
    mutate(data);
  };

  const handleSavePolygon = () => {
    dispatch(updateSurveyFormData({...formData, coordinates}));
    navigation.navigate(isReviewed ? screens.reviewScreen : screens.surveyForm);
  };

  const handleBtnPress = () => {
    if (isLoading) return;
    if (!isPolygonValid) {
      showToast('Please create a valid polygon', TOAST_TYPE.ERROR);
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
    if (!e.nativeEvent.coordinate) return;
    const updatedCoords = e.nativeEvent.coordinate;
    setCoordinates([...coordinates, updatedCoords]);
  };

  const handleMapPoiClick = e => {
    if (!e.nativeEvent.coordinate) return;
    const updatedCoords = e.nativeEvent.coordinate;
    setCoordinates([...coordinates, updatedCoords]);
  };

  const onMapReady = () => {
    mapRef.current.fitToCoordinates(selectedArea.coordinates, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 12,
      },
      animated: true,
    });
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
      <BackHeader
        title="Tap on Map"
        subtitle="put marker by tapping, long press for move"
        onGoBack={handleCustomBack}
        style={{
          height: 80,
        }}
        titleStyle={{
          fontSize: 22,
        }}
        subtitleStyle={{
          fontSize: 16,
        }}
      />
      <View style={[layout.container, layout.relative]}>
        {showMap ? (
          <Animatable.View animation="fadeIn" style={layout.container}>
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
              onMapReady={onMapReady}
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
              {size(surveyList)
                ? surveyList.map(survey => {
                    if (survey.id === surveyId) return null;
                    return (
                      <Polygon
                        key={survey.id}
                        coordinates={survey.coordinates}
                        strokeWidth={2}
                        strokeColor={'#FFA701'}
                        fillColor="#FFA70114"
                      />
                    );
                  })
                : null}
              {size(selectedArea.path) ? (
                <Polygon
                  coordinates={selectedArea.path}
                  strokeWidth={2}
                  strokeColor={colors.black}
                  fillColor="transparent"
                />
              ) : null}
            </MapView>
          </Animatable.View>
        ) : null}
        <View
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
              !isPolygonValid && styles.disableBtn,
            ]}
            onPress={handleBtnPress}>
            <Text style={styles.drawBtnTxt}>
              {isLoading
                ? 'Loading...'
                : `${surveyId ? 'Update' : 'Save'} Boundary`}
            </Text>
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
});

export default SurveyMap;
