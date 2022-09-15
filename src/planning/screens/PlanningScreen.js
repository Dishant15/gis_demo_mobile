import React, {useEffect} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';
import {LayerEventComponent} from '~planning/GisMap/components/LayerToComponentMap';

import {setMapState} from '~planning/data/planningGis.reducer';
import {colors, layout} from '~constants/constants';
import MapTitleBox from '~planning/GisMap/components/MapTitleBox';

const PlanningScreen = props => {
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      dispatch(setMapState({}));
    };
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <StatusBar barStyle="dark-content" />
      <ActionBar />
      <GisMap />
      <LayerEventComponent />
      <MapTitleBox />
    </View>
  );
};

const styles = StyleSheet.create({
  backWrapper: {
    paddingLeft: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  iconWrapper: {
    height: 44,
    width: 44,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default PlanningScreen;
