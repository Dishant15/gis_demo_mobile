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

// import React, {Component} from 'react';
// import {Text, View, StyleSheet, Pressable} from 'react-native';
// import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';

// /**
//  * tap on map, drow marker and draw line between 2 marker
//  */
// export default class Map extends Component {
//   mapRef = React.createRef();
//   polygonRef = React.createRef();

//   state = {
//     coordinates: [
//       {
//         longitude: 72.53672149032356,
//         latitude: 23.064385653591305,
//       },
//       {
//         longitude: 72.56370719522236,
//         latitude: 23.063402845804365,
//       },
//       {
//         longitude: 72.56125397980213,
//         latitude: 23.039736790051048,
//       },
//       {
//         longitude: 72.5329228118062,
//         latitude: 23.046764357112394,
//       },
//     ],
//     markers: [
//       {
//         latlng: {
//           longitude: 72.53672149032356,
//           latitude: 23.064385653591305,
//         },
//       },
//       {
//         latlng: {
//           longitude: 72.56370719522236,
//           latitude: 23.063402845804365,
//         },
//       },
//       {
//         latlng: {
//           longitude: 72.56125397980213,
//           latitude: 23.039736790051048,
//         },
//       },
//       {
//         latlng: {
//           longitude: 72.5329228118062,
//           latitude: 23.046764357112394,
//         },
//       },
//     ],
//     region: {
//       longitudeDelta: 0.0462949275970459,
//       latitude: 23.051741843623137,
//       longitude: 72.54943616688251,
//       latitudeDelta: 0.09218772082917326,
//     },
//   };

//   handleBtnClick = () => {
//     console.log('mapRef', this.mapRef.current);
//     console.log('polygonRef', this.polygonRef.current);
//     console.log(
//       'polygonRef getAirComponent',
//       this.polygonRef.current.getAirComponent(),
//     );
//     console.log(
//       'polygonRef setNativeProps',
//       this.polygonRef.current.setNativeProps({
//         editable: true,
//       }),
//     );
//   };
//   render = () => {
//     const {coordinates} = this.state;
//     return (
//       <View style={{flex: 1, position: 'relative'}}>
//         <View style={styles.absBtn}>
//           <Pressable onPress={this.handleBtnClick}>
//             <Text>GET DETAILS</Text>
//           </Pressable>
//         </View>
//         <MapView
//           ref={this.mapRef}
//           style={styles.map}
//           initialRegion={{
//             longitudeDelta: 0.0462949275970459,
//             latitude: 23.051741843623137,
//             longitude: 72.54943616688251,
//             latitudeDelta: 0.09218772082917326,
//           }}
//           provider={PROVIDER_GOOGLE}>
//           {
//             // loop through markers array & render all markers
//             this.state.markers.map((marker, i) => (
//               <Marker coordinate={marker.latlng} key={i} />
//             ))
//           }
//           <Polygon ref={this.polygonRef} coordinates={coordinates} />
//         </MapView>
//       </View>
//     );
//   };
// }

// const styles = StyleSheet.create({
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   absBtn: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 60,
//     zIndex: 2,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//   },
// });
