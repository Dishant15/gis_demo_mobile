import React, {Component, useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {FAB, Portal, Provider, Button} from 'react-native-paper';
import {size} from 'lodash';

import CIRCLE_ICON from '~assets/img/circle_40.png';
import {layout} from '~constants/constants';
import {updateCoordinates} from '~data/reducers/geoSurvey.reducer';
import {getGeoSurveyCoords} from '~data/selectors/geoSurvey.selectors';
import {getInitialRegion, noop} from '~utils/app.utils';

const {width, height} = Dimensions.get('window');
@connect(store => ({
  coordinates: getGeoSurveyCoords(store),
}))
export default class SurveyMap extends Component {
  /**
   * can draw / edit polygon using coordinates
   * Parent:
   *    SurveyDetails
   * Render:
   *    Map
   */
  constructor(props) {
    super(props);

    this.state = {
      region: getInitialRegion(width, height, 0.01203651641793968),
      coordinates: props.coordinates,
      isDrawing: false,
    };

    this.mapRef = React.createRef();
  }

  handleButtonPress = () => {
    const {isDrawing, coordinates} = this.state;

    const {dispatch, onSavePress} = this.props;
    if (isDrawing) {
      dispatch(updateCoordinates(coordinates));
      if (onSavePress) {
        onSavePress();
      }
    } else {
      this.setState({isDrawing: true});
    }
  };

  handleMarkerDrag = index => e => {
    let newCoords = [...this.state.coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);

    this.setState({coordinates: newCoords});
  };

  handleMapClick = e => {
    console.log('onPress', e.nativeEvent.coordinate);
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    this.setState({
      coordinates: [...this.state.coordinates, coords],
      isDrawing: true,
    });
  };

  handleMapPoiClick = e => {
    console.log('onPoiClick', e.nativeEvent.coordinate);
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    this.setState({
      coordinates: [...this.state.coordinates, coords],
      isDrawing: true,
    });
  };

  render = () => {
    const {coordinates, isDrawing, region} = this.state;

    return (
      <View style={[layout.container, styles.relative]}>
        <MapView
          ref={this.mapRef}
          style={styles.map}
          initialRegion={{
            longitudeDelta: 0.06032254546880722,
            latitudeDelta: 0.10201336785146964,
            longitude: 72.56051184609532,
            latitude: 23.024334044995985,
          }}
          loadingEnabled
          onLayout={() => {
            this.mapRef.current.animateToRegion(
              {
                longitudeDelta: 0.06032254546880722,
                latitudeDelta: 0.10201336785146964,
                longitude: 72.56051184609532,
                latitude: 23.024334044995985,
              },
              1000,
            );
          }}
          provider={PROVIDER_GOOGLE}
          // onRegionChangeComplete={data => console.log(data)}
          onPress={this.handleMapClick}
          onPoiClick={this.handleMapPoiClick}>
          {coordinates.map((marker, i) => (
            <Marker
              coordinate={marker}
              key={i}
              icon={require('../../assets/img/circle_40.png')}
              tappable
              draggable
              onDragEnd={this.handleMarkerDrag(i)}
              stopPropagation
              flat
              tracksInfoWindowChanges={false}
            />
          ))}
          {size(coordinates) ? <Polygon coordinates={coordinates} /> : null}
        </MapView>
        <View style={styles.content}>
          <Button
            style={[layout.button, styles.drawBtn]}
            icon="pencil"
            mode="contained"
            onPress={this.handleButtonPress}>
            {isDrawing ? 'Save Polygon' : 'Draw Polygon'}
          </Button>
        </View>
      </View>
    );
  };
}

const MapSettings = () => {
  const [open, setOpen] = useState(false);
  console.log('🚀 ~ file: SurveyMap.js ~ line 40 ~ MapSettings ~ open', open);

  return (
    <Provider>
      <Portal>
        <FAB.Group
          visible
          open={open}
          icon={open ? 'calendar-today' : 'plus'}
          actions={[
            {icon: 'plus', onPress: () => console.log('Pressed add')},
            {
              icon: 'star',
              label: 'Star',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'email',
              label: 'Email',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => console.log('Pressed notifications'),
              small: false,
            },
          ]}
          onStateChange={noop}
          // onStateChange={onStateChange}
          onPress={() => {
            setOpen(!open);
            console.log('am i here ?');
          }}
        />
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
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
