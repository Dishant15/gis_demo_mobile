import React, {Component} from 'react';
import {Polyline} from 'react-native-maps';

export default class HighlightedPolyline extends Component {
  polylineOptions = {
    strokeWidth: 4,
    lineDashPattern: [0, 15, 30],
    lineCap: 'square',
    geodesic: true,
  };
  render = () => {
    return <Polyline {...this.polylineOptions} {...this.props} />;
  };
}
