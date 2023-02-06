import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {FIELD_TYPES} from '~Common/DynamicForm';

import {default as Icon} from '~assets/markers/building_view.svg';
import {default as EditIcon} from '~assets/markers/building_pin.svg';

export const LAYER_KEY = 'p_gp';
export const PRE_UID = 'GP';
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
  fid: '',
  status: 'RFS',
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Gram Panchayat Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'block_name',
          label: 'Block Name',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'lgd_code',
          label: 'LDG Code',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'ring_id',
          label: 'Ring ID',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'connectivity',
          label: 'Connectivity',
          field_type: FIELD_TYPES.Input,
        },
      ],
    },
  ],
  // this shows where dependant template data comes from
  metaData: {
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Block Name', field: 'block_name', type: 'simple'},
  {label: 'LDG Code', field: 'lgd_code', type: 'simple'},
  {label: 'Ring ID', field: 'ring_id', type: 'simple'},
  {label: 'Connectivity', field: 'connectivity', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add-survey',
  },
  {
    control: 'add-survey-images',
  },
];
