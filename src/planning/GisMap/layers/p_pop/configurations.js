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
          field_key: 'contact_name',
          label: 'Contact Name',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'contact_no',
          label: 'Contact No',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'is_rented',
          label: 'Rented',
          field_type: FIELD_TYPES.CheckBox,
        },
        // {
        //   field_key: "agreement_start_date",
        //   label: "Agreement start date",
        //   field_type: FIELD_TYPES.DateTime,
        // },
        // {
        //   field_key: "agreement_end_date",
        //   label: "Agreement end date",
        //   field_type: FIELD_TYPES.DateTime,
        // },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Contact Name', field: 'contact_name', type: 'simple'},
  {label: 'Contact No', field: 'contact_no', type: 'simple'},
  {label: 'Rented', field: 'is_rented', type: 'simple'},
  // {
  //   label: "Agreement start date",
  //   field: "agreement_start_date",
  //   type: "date",
  // },
  // { label: "Agreement end date", field: "agreement_end_date", type: "date" },
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add_associations',
    data: ['p_olt'],
  },
  {
    control: 'association_list',
  },
];
