import {size} from 'lodash';
import React, {Component, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {FAB, Portal, Provider, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {INIT_MAP_LOCATION, layout} from '~constants/constants';
import {noop} from '~utils/app.utils';

const DRAWING_MODE = {
  MARKER: 'marker',
  POLYGON: 'polygon',
};

export default class SurveyMap extends Component {
  mapRef = React.createRef();
  state = {
    drawingMode: null,
    coordinates: [],
    finalJson: {},
  };

  render = () => {
    const {drawingMode, coordinates, markers} = this.state;
    console.log(
      '🚀 ~ file: SurveyMap.js ~ line 27 ~ SurveyMap ~ this.state',
      this.state,
    );
    const isPolygonDrawing = drawingMode === DRAWING_MODE.POLYGON;
    return (
      <View style={[layout.container, styles.relative]}>
        <MapView
          ref={this.mapRef}
          style={styles.map}
          initialRegion={INIT_MAP_LOCATION}
          provider={PROVIDER_GOOGLE}
          onPress={e => {
            if (!e.nativeEvent.coordinate) return;
            if (isPolygonDrawing) {
              this.setState({
                coordinates: [
                  ...this.state.coordinates,
                  {...e.nativeEvent.coordinate},
                ],
              });
            }
          }}>
          {isPolygonDrawing ? (
            <>
              {
                // loop through markers array & render all markers
                coordinates.map((marker, i) => (
                  <Marker coordinate={marker} key={i} />
                ))
              }
              {size(coordinates) ? <Polygon coordinates={coordinates} /> : null}
            </>
          ) : null}
        </MapView>
        <View style={styles.content}>
          <Button
            style={[layout.button, styles.drawBtn]}
            icon="pencil"
            mode="contained"
            onPress={() => {
              if (isPolygonDrawing) {
                console.log('data', this.state);
                this.setState({drawingMode: null});
              } else {
                this.setState({
                  drawingMode: DRAWING_MODE.POLYGON,
                });
              }
            }}>
            {isPolygonDrawing ? 'Save Polygon' : 'Draw Polygon'}
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
