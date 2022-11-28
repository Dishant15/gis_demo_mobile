import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';

import {default as Icon} from '~assets/markers/pole_box.svg';
import {default as EditIcon} from '~assets/markers/pole_pin.svg';

export const LAYER_KEY = 'p_pole';
export const PRE_UID = 'PL';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = () => ({
  icon: Icon,
  pin: EditIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  unique_id: '',
  network_id: '',
  ref_code: '',
  status: 'RFS',
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Pole Form',
      fieldConfigs: [...ELEMENT_FORM_ABSTRACT_TEMPLATE],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [...ELEMENT_TABLE_ABSTRACT_FIELDS];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add_associations',
    data: ['p_splitter', 'p_dp'],
  },
  {
    control: 'association_list',
  },
];
