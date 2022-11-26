import React from 'react';
import {View, Text} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {fetchElementAssociations} from '~planning/data/layer.services';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';

const ShowAssociatedElements = () => {
  const dispatch = useDispatch();

  const {layerKey, data} = useSelector(getPlanningMapState);
  const {elementId} = data;

  const {data: associations, isLoading} = useQuery(
    ['elementAssociations', layerKey, elementId],
    fetchElementAssociations,
  );
  console.log(
    '🚀 ~ file: ShowAssociatedElements.js ~ line 15 ~ ShowAssociatedElements ~ associations',
    associations,
  );
  return (
    <View>
      <Text>ShowAssociatedElements</Text>
    </View>
  );
};

export default ShowAssociatedElements;
