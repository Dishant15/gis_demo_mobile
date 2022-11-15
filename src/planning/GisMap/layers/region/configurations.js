import {FEATURE_TYPES} from '../common/configuration';
import {getFillColor} from '~utils/map.utils';
import Icon from '~assets/markers/pentagon.svg';

export const LAYER_KEY = 'region';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.MULTI_POLYGON;

export const getViewOptions = (props = {}) => {
  const {layer} = props;
  const color = getFillColor(layer);

  return {
    strokeColor: color,
    strokeWidth: 2,
    fillColor: 'transparent',
    icon: Icon,
    pin: Icon,
  };
};

export const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
];
