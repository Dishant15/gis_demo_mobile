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

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Element Details" onGoBack={navigation.goBack} />
      <TableContent
        elemData={elemData}
        isLoading={isLoading}
        layerKey={layerKey}
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
