import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {FIELD_TYPES} from '~Common/DynamicForm';

import {default as Icon} from '~assets/markers/manhole_box.svg';
import {default as EditIcon} from '~assets/markers/manhole_pin.svg';

export const LAYER_KEY = 'p_manhole';
export const PRE_UID = 'MH';
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
      title: 'Manhole Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'has_compass_box',
          label: 'Compass Box',
          field_type: FIELD_TYPES.CheckBox,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Compass Box', field: 'has_compass_box', type: 'boolean'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add_associations',
    data: ['p_jointcloser'],
  },
  {
    control: 'association_list',
  },
];
