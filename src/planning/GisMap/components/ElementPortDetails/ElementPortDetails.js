import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';

import BackHeader from '~Common/components/Header/BackHeader';
import CommonPortDetails from './CommonPortDetails';
import Loader from '~Common/Loader';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {fetchElementPortDetails} from '~planning/data/layer.services';

import {LAYER_KEY as CableLayerKey} from '~planning/GisMap/layers/p_cable';
import {LAYER_KEY as OltLayerKey} from '~planning/GisMap/layers/p_olt';
import {LAYER_KEY as SplitterLayerKey} from '~planning/GisMap/layers/p_splitter';
import {
  cableTableConfig,
  oltTableConfig,
  splitterTableConfig,
} from './port.utils';

import {layout} from '~constants/constants';

const ElementPortDetails = () => {
  const navigation = useNavigation();

  const {layerKey, data: mapStateData} = useSelector(getPlanningMapState);
  const {elementId} = mapStateData;

  const {data: portDetails, isLoading} = useQuery(
    ['elementPortDetails', layerKey, elementId],
    fetchElementPortDetails,
  );

  const Content = useMemo(() => {
    if (layerKey === CableLayerKey) {
      return (
        <CommonPortDetails
          portDetails={portDetails}
          tableConfig={cableTableConfig}
        />
      );
    }
    //
    else if (layerKey === OltLayerKey) {
      return (
        <CommonPortDetails
          portDetails={portDetails}
          tableConfig={oltTableConfig}
          inputTitle="Uplink ports"
          outputTitle="Downlink ports"
        />
      );
    }
    //
    else if (layerKey === SplitterLayerKey) {
      return (
        <CommonPortDetails
          portDetails={portDetails}
          tableConfig={splitterTableConfig}
        />
      );
    }
  }, [layerKey, portDetails]);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Port details" onGoBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {Content}
      </ScrollView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 8,
    paddingBottom: 60,
    flexGrow: 1,
  },
});

export default ElementPortDetails;
