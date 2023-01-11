import React, {Component} from 'react';
import {View} from 'react-native';

import {Marker} from 'react-native-maps';
import styles from './highlightedStyles';

export default class MapMarker extends Component {
  markerOptions = {
    tappable: false,
    draggable: false,
    stopPropagation: true,
    flat: true,
    tracksViewChanges: false,
    tracksInfoWindowChanges: false,
  };

  render = () => {
    const {children, highlighted, ...restProps} = this.props;
    if (highlighted) {
      return (
        <Marker {...this.markerOptions} {...restProps}>
          <View style={styles.markerWrapper}>{children}</View>
        </Marker>
      );
    } else {
      return (
        <Marker {...this.markerOptions} {...restProps}>
          {children}
        </Marker>
      );
    }
  };
}
