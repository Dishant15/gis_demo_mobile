import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Marker, Polyline} from 'react-native-maps';

import get from 'lodash/get';
import last from 'lodash/last';
import size from 'lodash/size';

import styles from './highlightedStyles';

export default class HighlightedPolyline extends Component {
  polylineOptions = {
    strokeWidth: 4,
    lineDashPattern: [0, 15, 30],
    lineCap: 'square',
    geodesic: true,
  };

  render = () => {
    const {showStartEndPoints = true} = this.props;
    if (showStartEndPoints) {
      const startPoint = get(this.props, 'coordinates.0');
      const endPoint = last(get(this.props, 'coordinates', []));
      return (
        <>
          {size(startPoint) ? this.renderMarker('A', startPoint) : null}
          <Polyline {...this.polylineOptions} {...this.props} />
          {size(endPoint) ? this.renderMarker('B', endPoint) : null}
        </>
      );
    } else {
      return <Polyline {...this.polylineOptions} {...this.props} />;
    }
  };

  renderMarker = (text, coord) => {
    return (
      <Marker coordinate={coord} anchor={{x: 0.5, y: 0.5}}>
        <View style={styles.polylineIndicator}>
          <Text style={styles.polylineIndicatorText}>{text}</Text>
        </View>
      </Marker>
    );
  };
}
