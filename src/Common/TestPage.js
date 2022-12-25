import React, {useRef, useState, useEffect} from 'react';
import {View, Platform} from 'react-native';
import MapView, {Polygon, PROVIDER_GOOGLE, UrlTile} from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';

import {colors, INIT_MAP_LOCATION, layout} from '~constants/constants';
import {percentToHex} from '~utils/app.utils';

// lyrs types in tile url
// https://stackoverflow.com/a/33023651

const polygonCoords = [
  {
    longitude: 72.55190044641495,
    latitude: 23.03627470381842,
  },
  {
    longitude: 72.56795078516006,
    latitude: 23.035405851530747,
  },
  {
    longitude: 72.56554752588272,
    latitude: 23.010706938441714,
  },
  {
    longitude: 72.5498690083623,
    latitude: 23.020081536105625,
  },
];
const TestPage = () => {
  const ref = useRef();
  const [coordinates, setCoordinates] = useState(polygonCoords);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleMapClick = e => {
    if (!e.nativeEvent.coordinate) return;
    console.log(e.nativeEvent.coordinate);
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={ref}
        style={{flex: 1}}
        initialRegion={INIT_MAP_LOCATION}
        provider={PROVIDER_GOOGLE}
        mapType={Platform.OS == 'android' ? 'none' : 'standard'}
        onMapReady={() => {
          setTimeout(() => {
            if (ref.current) {
              ref.current.animateCamera(
                {center: INIT_MAP_LOCATION, zoom: 14},
                {duration: 100},
              );
            }
          }, 1000);
        }}
        // scrollEnabled={false}
        // onPress={handleMapClick}
      >
        <UrlTile
          // urlTemplate={'http://c.tile.openstreetmap.de/{z}/{x}/{y}.png'}
          // urlTemplate="https://maps.googleapis.com/maps/vt?lyrs=m@189&x={x}&y={y}&z={z}" // normal
          // urlTemplate="https://maps.googleapis.com/maps/vt?lyrs=s@189&x={x}&y={y}&z={z}" // satelite
          urlTemplate="https://maps.googleapis.com/maps/vt?lyrs=y@189&x={x}&y={y}&z={z}" // hybrid
        />
        <Polygon
          coordinates={coordinates}
          strokeColor="#F00"
          fillColor={'rgba(255, 0, 0, 0.2)'}
          strokeWidth={1}
          editMode={'polygon'}
          onEditStart={() => setEditing(true)}
          onEditMove={event => {
            // Update the coordinates of the moved point
            const {coordinate} = event.nativeEvent;
            setCoordinates(prevCoordinates => {
              return prevCoordinates.map(c =>
                c.latitude === coordinate.latitude &&
                c.longitude === coordinate.longitude
                  ? coordinate
                  : c,
              );
            });
          }}
          onEditStop={() => setEditing(false)}
          zIndex={1}
        />
      </MapView>
    </View>
  );
};

export default TestPage;
