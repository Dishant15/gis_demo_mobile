import React, {Component} from 'react';

import {Marker} from 'react-native-maps';

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
    const {children, ...restProps} = this.props;
    return (
      <Marker {...this.markerOptions} {...restProps}>
        {children}
      </Marker>
    );
  };
}
