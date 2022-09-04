import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  InteractionManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Button, Card, Title, Paragraph, Modal} from 'react-native-paper';

import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  getCurrentLocation,
  getLocationPermissionType,
  getMapType,
} from '~Common/data/appstate.selector';
import {PERMISSIONS_TYPE, toggleMapType} from '~Common/data/appstate.reducer';

import {colors, layout, screens, THEME_COLORS} from '~constants/constants';

import DefaultMapImg from '~assets/img/map_default.png';
import SatelliteMapImg from '~assets/img/map_satellite.png';
import FloatingCard from '~Common/components/FloatingCard';

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.00444;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const PlanningScreen = () => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const mapRef = useRef();

  const [showMap, setMapVisibility] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[layout.container, layout.relative]}>
        {showMap ? (
          <Animatable.View animation="fadeIn" style={layout.container}>
            <MapView
              // showsUserLocation={locationPermType === PERMISSIONS_TYPE.ALLOW}
              // showsMyLocationButton={
              //   locationPermType === PERMISSIONS_TYPE.ALLOW
              // }
              showsIndoorLevelPicker
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                longitudeDelta: 0.06032254546880722,
                latitudeDelta: 0.0005546677,
                longitude: 72.56051184609532,
                latitude: 23.024334044995985,
              }}
              loadingEnabled
              // onMapReady={onMapReady}
              provider={PROVIDER_GOOGLE}
              // onPress={handleMapClick}
              // onPoiClick={handleMapPoiClick}
              showsPointsOfInterest={false}></MapView>
          </Animatable.View>
        ) : null}
        <View
          style={[styles.actionWrapper, {bottom: Math.max(insets.bottom, 16)}]}>
          <TouchableOpacity style={[styles.action]}>
            <MaterialIcons
              size={30}
              name={'attractions'}
              color={colors.primaryFontColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.action]}>
            <MaterialIcons
              size={30}
              name={'layers'}
              color={colors.primaryFontColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.action]}
            onPress={() => setVisible(true)}>
            <MaterialIcons
              size={30}
              name={'add-location'}
              color={colors.primaryFontColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      {visible ? (
        <Modal
          visible={true}
          onDismiss={() => setVisible(false)}
          style={{
            justifyContent: 'flex-end',
          }}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
          }}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      ) : null}
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
  actionWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  action: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlanningScreen;
