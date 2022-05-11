import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Marker} from 'react-native-maps';

const CustomMarker = props => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const stopTrackingViewChanges = useCallback(() => {
    setTracksViewChanges(false);
  }, []);

  return (
    <Marker {...props} tracksViewChanges={tracksViewChanges}>
      <FastImage
        source={require('../../assets/img/circle_40.png')}
        onLoad={stopTrackingViewChanges}
        fadeDuration={0}
        style={styles.image}
      />
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
