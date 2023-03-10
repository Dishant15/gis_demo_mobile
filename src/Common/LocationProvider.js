import React, {useEffect, useCallback} from 'react';
import {View, Alert, Platform, StyleSheet, Dimensions} from 'react-native';
import {
  PERMISSIONS,
  request,
  check,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Headline, Subheading} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import FastImage from 'react-native-fast-image';

import {colors, layout} from '~constants/constants';
import {
  PERMISSIONS_TYPE,
  setCurrentLocation,
  setLocationPermission,
} from './data/appstate.reducer';
import {getLocationPermissionType} from './data/appstate.selector';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {handleLogoutUser} from '~Authentication/data/auth.actions';

import LocationIcon from '~assets/img/location.png';

/**
 * Hoc component
 * ask user for permission, set permission type in app state
 * render screen if user not given permission otherwise render root navigation stack
 *
 * get user current location and set into app state
 *
 * Parent:
 *    root.navigation
 */
const LocationProvider = ({children}) => {
  const dispatch = useDispatch();
  const locationPermissionType = useSelector(getLocationPermissionType);

  useEffect(() => {
    // getLocationPermission();
    getCameraPermission();
  }, []);

  const getCameraPermission = () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(response => {
        if (response === RESULTS.BLOCKED) {
          onCameraPermissonDenied();
          Alert.alert(
            'Permission Required !!!',
            'Please enable camera permissions from settings > Permissions > Location',
            [
              {
                text: 'Cancel',
                onPress: () => {},
              },
              {
                text: 'Open Settings',
                onPress: () =>
                  openSettings().catch(() =>
                    console.log('cannot open settings'),
                  ),
              },
            ],
            {cancelable: false},
          );
        } else if (response === RESULTS.GRANTED) {
          getLocationPermission();
        } else {
          // ask permission again
          onCameraPermissonDenied();
          request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA,
          ).then(sec_response => {
            if (sec_response === RESULTS.GRANTED) {
              getLocationPermission();
            } else {
              onCameraPermissonDenied();
            }
          });
        }
      })
      .catch(err => {
        onCameraPermissonDenied();
      });
  };

  const getLocationPermission = () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then(response => {
        if (response === RESULTS.BLOCKED) {
          onPermissonDenied();
          Alert.alert(
            'Permission Required !!!',
            'Please enable location permissions from settings > Permissions > Location',
            [
              {
                text: 'Cancel',
                onPress: () => {},
              },
              {
                text: 'Open Settings',
                onPress: () =>
                  openSettings().catch(() =>
                    console.log('cannot open settings'),
                  ),
              },
            ],
            {cancelable: false},
          );
        } else if (response === RESULTS.GRANTED) {
          onPermissionGranted();
        } else {
          // ask permission again
          onPermissonDenied();
          request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_ALWAYS
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ).then(sec_response => {
            if (sec_response === RESULTS.GRANTED) {
              onPermissionGranted();
            } else {
              onPermissonDenied();
            }
          });
        }
      })
      .catch(err => {
        onPermissonDenied();
      });
  };

  const onPermissionGranted = () => {
    dispatch(setLocationPermission(PERMISSIONS_TYPE.ALLOW));
    getCurrentLocation();
  };

  const onPermissonDenied = () => {
    dispatch(setLocationPermission(null));
    showToast(
      'Enable location permissions for better experiance',
      TOAST_TYPE.INFO,
    );
  };

  const onCameraPermissonDenied = () => {
    dispatch(setLocationPermission(null));
    showToast(
      'Enable Camera permissions for better experiance',
      TOAST_TYPE.INFO,
    );
  };

  const onPermissonSkip = () => {
    dispatch(setLocationPermission(PERMISSIONS_TYPE.SKIP));
    showToast(
      'Enable location permissions for better experiance',
      TOAST_TYPE.INFO,
    );
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = parseFloat(position.coords.latitude);
        const longitude = parseFloat(position.coords.longitude);
        dispatch(
          setCurrentLocation({
            latitude,
            longitude,
          }),
        );
      },
      error => {
        dispatch(setCurrentLocation(null));
      },
      {enableHighAccuracy: true, timeout: 150000},
    );
  };

  const handleLogout = useCallback(() => {
    dispatch(handleLogoutUser);
  }, []);

  if (locationPermissionType === PERMISSIONS_TYPE.ALLOW) {
    return children;
  } else {
    return (
      <View style={[layout.container, layout.center]}>
        <View style={styles.imageWrapper}>
          <FastImage
            source={LocationIcon}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <Headline>Allow Your Location and CAMERA</Headline>
        <Subheading style={styles.subheadingText}>
          {`We will need your location and camera permission\nto give you better experiance`}
        </Subheading>
        <Button
          style={styles.button}
          contentStyle={layout.button}
          color={colors.primaryMain}
          uppercase
          mode="contained"
          onPress={getLocationPermission}>
          Enable Permission
        </Button>
        {/* <Button
          style={styles.deniedBtn}
          contentStyle={layout.button}
          color={colors.primaryMain}
          uppercase
          mode="text"
          onPress={onPermissonSkip}>
          Not yet
        </Button> */}
        <Button
          style={styles.deniedBtn}
          contentStyle={layout.button}
          color={colors.primaryMain}
          uppercase
          mode="text"
          onPress={handleLogout}>
          Logout
        </Button>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: Dimensions.get('screen').width * 0.5,
    height: 280,
  },
  img: {
    flex: 1,
    width: null,
    height: null,
  },
  subheadingText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    marginBottom: 5,
  },
  deniedBtn: {
    marginVertical: 10,
  },
});

export default LocationProvider;
