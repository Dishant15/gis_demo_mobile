import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {FIELD_TYPES} from '~Common/DynamicForm';

import {default as Icon} from '~assets/markers/pop_box.svg';
import {default as EditIcon} from '~assets/markers/pop_pin.svg';

export const LAYER_KEY = 'p_pop';
export const PRE_UID = 'POP';
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
      title: 'Pop Location Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'snippet',
          label: 'Snippet',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'block_code',
          label: 'Block Code',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'district',
          label: 'District',
          field_type: FIELD_TYPES.Input,
        },
      ],
    },
  ],
  // this shows where dependant template data comes from
  // metaData: {
  //   getElementAddressData: (address, submitData) => {
  //     submitData.address = address.address;
  //   },
  // },
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Snippet', field: 'snippet', type: 'simple'},
  {label: 'Block Code', field: 'block_code', type: 'simple'},
  {label: 'District', field: 'district', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add-survey',
  },
  {
    control: 'add-survey-images',
  },
];
