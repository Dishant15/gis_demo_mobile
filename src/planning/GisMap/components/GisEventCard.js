import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import MapCard from '~Common/components/MapCard';
import AddGisMapLayer from './AddGisMapLayer';
import EditGisLayer from './EditGisLayer';

import {PLANNING_EVENT} from '../utils';
import {
  getPlanningMapStateEvent,
  getPlanningTicketData,
} from '~planning/data/planningGis.selectors';
import {Button} from 'react-native-paper';
import {colors, THEME_COLORS} from '~constants/constants';
import {get} from 'lodash';
import {toggleTicketElements} from '~planning/data/planningGis.reducer';

const GisMapCard = () => {
  const dispatch = useDispatch();
  const ticketData = useSelector(getPlanningTicketData);
  const event = useSelector(getPlanningMapStateEvent);

  const handleToggle = useCallback(() => {
    dispatch(toggleTicketElements());
  }, []);

  if (event === PLANNING_EVENT.addElementGeometry) {
    return <AddGisMapLayer />;
  } else if (event === PLANNING_EVENT.editElementGeometry) {
    return <EditGisLayer />;
  } else if (ticketData?.id) {
    const isHidden = get(ticketData, 'isHidden');
    const ActionContent = (
      <Button
        mode="text"
        color={colors.white}
        style={{backgroundColor: THEME_COLORS.secondary.main}}
        onPress={handleToggle}>
        {isHidden ? 'Show Ticket' : 'Hide Ticket'}
      </Button>
    );
    return <MapCard title={ticketData.name} actionContent={ActionContent} />;
  } else {
    return <MapCard title="Planning Map" />;
  }
};

export default GisMapCard;