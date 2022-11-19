import {
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {getFillColor} from '~utils/map.utils';
import Icon from '~assets/markers/pentagon.svg';

export const LAYER_KEY = 'region';
export const PRE_UID = 'RGN';
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

export const ELEMENT_TABLE_FIELDS = [...ELEMENT_TABLE_ABSTRACT_FIELDS];
