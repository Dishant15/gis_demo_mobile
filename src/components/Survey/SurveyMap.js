import {size} from 'lodash';
import React, {Component, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {FAB, Portal, Provider, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import CIRCLE_ICON from '~assets/img/circle_40.png';
import {INIT_MAP_LOCATION, layout} from '~constants/constants';
import {
  updateServeyDetails,
  updateCoordinates,
} from '~redux/reducers/surveyDetails.reducer';
import {getSurveyCoords} from '~redux/selectors/surveyDetails.selectors';
import {noop} from '~utils/app.utils';

@connect(store => ({
  coordinates: getSurveyCoords(store),
}))
export default class SurveyMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: props.coordinates,
      isDrawing: false,
    };

    this.mapRef = React.createRef();
  }

  handleButtonPress = () => {
    const {isDrawing, coordinates} = this.state;
    if (isDrawing) {
      dispatch(updateCoordinates(coordinates));
      if (onSavePress) {
        onSavePress();
      }
    } else {
      this.setState({isDrawing: true});
    }
  };

  render = () => {
    const {coordinates, isDrawing} = this.state;
    return (
      <View style={[layout.container, styles.relative]}>
        <MapView
          ref={this.mapRef}
          style={styles.map}
          initialRegion={INIT_MAP_LOCATION}
          provider={PROVIDER_GOOGLE}
          onPress={e => {
            if (!e.nativeEvent.coordinate) return;
            const coords = e.nativeEvent.coordinate;
            this.setState({
              coordinates: [...this.state.coordinates, coords],
              isDrawing: true,
            });
          }}>
          {coordinates.map((marker, i) => (
            <Marker
              coordinate={marker}
              key={i}
              // icon={CIRCLE_ICON}
              image={CIRCLE_ICON}
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
