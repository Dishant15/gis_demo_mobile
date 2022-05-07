import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {
  Overlay,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

/**
 * tap on map, drow marker and draw line between 2 marker
 */
export default class Map extends Component {
  state = {
    coordinates: [],
    markers: [],
  };
  render = () => {
    const {coordinates} = this.state;
    console.log('🚀 ~ file: map.js ~ line 20 ~ map ~ this.state', this.state);
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}
        onPress={e => {
          if (!e.nativeEvent.coordinate) return;
          console.log('🚀 ~ file: map press', e.nativeEvent.coordinate);
          this.setState({
            markers: [
              ...this.state.markers,
              {latlng: e.nativeEvent.coordinate},
            ],
            coordinates: [
              ...this.state.coordinates,
              {...e.nativeEvent.coordinate},
            ],
          });
        }}>
        {
          // loop through markers array & render all markers
          this.state.markers.map((marker, i) => (
            <Marker coordinate={marker.latlng} key={i} />
          ))
        }
        <Polyline
          coordinates={coordinates}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={['#7F0000']}
          strokeWidth={6}
          tappable
          onPress={e => {
            const center = centerPoint(coordinates);
            const markers = [...this.state.markers];
            markers.push({
              latlng: {
                latitude: center[0],
                longitude: center[1],
              },
            });
            this.setState({markers});
            console.log('polyline', e.nativeEvent, center);
          }}
        />
        {/* <Overlay
                    bounds={[
                        [37.82687129714931, -122.45534632354975],
                        [37.74785225961959, -122.41037506610154],
                    ]}
                    tappable
                    opacity={0.5}
                /> */}
      </MapView>
    );
  };
}

const centerPoint = cords => {
  console.log('🚀 ~ file: map.js ~ line 75 ~ centerPoint ~ cords', cords);
  let arr = [];
  for (let index = 0; index < cords.length; index++) {
    const element = cords[index];
    arr.push([element.latitude, element.longitude]);
    console.log('🚀 ~ file: map.js ~ line 79 ~ centerPoint ~ element', element);
  }
  let x = arr.map(xy => xy[0]);
  let y = arr.map(xy => xy[1]);
  let cx = (Math.min(...x) + Math.max(...x)) / 2;
  let cy = (Math.min(...y) + Math.max(...y)) / 2;
  return [cx, cy];
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
