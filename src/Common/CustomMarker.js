import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';

import EditPin from '~assets/markers/survey_pin.svg';
import {zIndexMapping} from '~planning/GisMap/layers/common/configuration';

/**
 * anchor can change based on svg
 */
const CustomMarker = props => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const stopTrackingViewChanges = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  return (
    <Marker
      zIndex={zIndexMapping.edit}
      {...props}
      anchor={{
        x: 0.5,
        y: 0.9,
      }}>
      <EditPin />
    </Marker>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
});

export default CustomMarker;
