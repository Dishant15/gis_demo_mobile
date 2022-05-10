import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {Button} from 'react-native-paper';
import {isNull, get, size} from 'lodash';

import BackHeader from '~components/Header/BackHeader';
import {layout, screens} from '~constants/constants';
import {getInitialRegion} from '~utils/app.utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  getGeoSurveyCoords,
  getGeoSurveySelectedUnitIndex,
  getGeoSurveyUnitList,
} from '~data/selectors/geoSurvey.selectors';
import {updateUnitCoordinates} from '~data/reducers/geoSurvey.reducer';

const {width, height} = Dimensions.get('window');

const UnitMap = ({navigation}) => {
  const unitList = useSelector(getGeoSurveyUnitList);
  const unitIndex = useSelector(getGeoSurveySelectedUnitIndex);
  const unitData = unitList[unitIndex];

  const surveyCoords = useSelector(getGeoSurveyCoords);
  const dispatch = useDispatch();

  const mapRef = useRef();
  const [coordinate, setCoordinate] = useState(null);

  useEffect(() => {
    if (size(unitData.coordinates)) {
      setCoordinate(unitData.coordinates);
    } else {
      setCoordinate(null);
    }
  }, [unitData]);

  const handleButtonPress = useCallback(() => {
    dispatch(
      updateUnitCoordinates({
        unitIndex,
        coordinates: coordinate,
      }),
    );
    navigation.navigate(screens.unitForm);
  }, [unitIndex, coordinate]);

  const handleMarkerDrag = useCallback(e => {
    const coords = e.nativeEvent.coordinate;
    setCoordinate(coords);
  }, []);

  const isMarker = !isNull(coordinate);

  const existingMarkers = useMemo(() => {
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
        title="Add Marker"
        subtitle="Add marker within boundary"
        onGoBack={navigation.goBack}
      />
      <View style={[layout.container, layout.relative]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={getInitialRegion(width, height, 0.01203651641793968)}
          provider={PROVIDER_GOOGLE}
          onPress={e => {
            if (!e.nativeEvent.coordinate) return;
            const coords = e.nativeEvent.coordinate;
            setCoordinate(coords);
          }}>
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
          {size(surveyCoords) ? <Polygon coordinates={surveyCoords} /> : null}
        </MapView>
        <View style={styles.content}>
          <Button
            style={[layout.button, styles.drawBtn]}
            icon="pencil"
            mode="contained"
            disabled={!isMarker}
            onPress={handleButtonPress}>
            Save
          </Button>
        </View>
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
    alignSelf: 'flex-end',
  },
});

export default UnitMap;