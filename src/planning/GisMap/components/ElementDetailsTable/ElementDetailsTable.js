import React from 'react';
import {View} from 'react-native';
import {useQuery} from 'react-query';
import {useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import BackHeader from '~Common/components/Header/BackHeader';
import TableContent from './TableContent';
import TableActions from './TableActions';

import {fetchElementDetails} from '~planning/data/layer.services';
import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';

import {layout} from '~constants/constants';
import {LayerKeyMappings} from '~planning/GisMap/utils';
import {get} from 'lodash';

const ElementDetailsTable = ({layerKey, onEditDataConverter}) => {
  const navigation = useNavigation();

  const {elementId} = useSelector(getPlanningMapStateData);

  const {data: elemData, isLoading} = useQuery(
    ['elementDetails', layerKey, elementId],
    fetchElementDetails,
    {
      // assign same coordinates to geometry to handle data for gislayerform -> workorder add
      select: data => ({...data, geometry: data.coordinates}),
    },
  );
  const rowDefs = get(LayerKeyMappings, [layerKey, 'elementTableFields'], []);
  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Element Details" onGoBack={navigation.goBack} />
      <TableContent
        elemData={elemData}
        isLoading={isLoading}
        rowDefs={rowDefs}
      />
      <TableActions
        elemData={elemData}
        layerKey={layerKey}
        onEditDataConverter={onEditDataConverter}
      />
    </View>
  );
};

export default ElementDetailsTable;
