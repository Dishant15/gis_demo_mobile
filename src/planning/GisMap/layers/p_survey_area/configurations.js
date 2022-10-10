import {FIELD_TYPES} from '~Common/DynamicForm';
import {LAYER_STATUS_OPTIONS} from '../common/configuration';

export const LAYER_KEY = 'p_survey_area';

export const INITIAL_ELEMENT_DATA = {
  name: '',
  unique_id: 'REG_SA_',
  ref_code: '',
  status: 'P',
  address: '',
  area: '',
  city: '',
  state: '',
  pincode: '',
  tags: '',
  home_pass: 0,
  over_head_cable: false,
  cabling_required: false,
  poll_cabling_possible: false,
  locality_status: '3',
  broadband_availability: '',
  cable_tv_availability: '',
  coordinates: [],
};

export const AREA_LOCALITY_OPTIONS = [
  {value: '1', label: 'High'},
  {value: '2', label: 'Medium'},
  {value: '3', label: 'Average'},
  {value: '4', label: 'Poor'},
];

export const AREA_TAG_OPTIONS = [
  {label: 'Residential', value: 'residential'},
  {label: 'Commercial', value: 'commercial'},
  {label: 'Government', value: 'government'},
  {label: 'Hospital', value: 'hospital'},
  {label: 'Educational', value: 'educational'},
];

export const AREA_BROADBAND_PROVIDERS = [
  {
    label: 'GTPL',
    value: 'GTPL',
  },
  {
    label: 'JIO',
    value: 'JIO',
  },
  {
    label: 'Airtel',
    value: 'Airtel',
  },
];

export const AREA_TV_PROVIDERS = [
  {
    label: 'GTPL',
    value: 'GTPL',
  },
  {
    label: 'DEN',
    value: 'DEN',
  },
  {
    label: 'IN CABLE',
    value: 'IN CABLE',
  },
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Survey Area Form',
      fieldConfigs: [
        {
          field_key: 'name',
          label: 'Name',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'area',
          label: 'Area',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'city',
          label: 'City',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'state',
          label: 'State',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'pincode',
          label: 'Pincode',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'unique_id',
          label: 'Unique Id',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'ref_code',
          label: 'Reff Code',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'status',
          label: 'Status',
          field_type: FIELD_TYPES.Select,
          options: LAYER_STATUS_OPTIONS,
        },
        {
          field_key: 'tags',
          label: 'Tags',
          field_type: FIELD_TYPES.SelectMulti,
          options: AREA_TAG_OPTIONS,
        },
        {
          field_key: 'home_pass',
          label: 'Home Pass',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'over_head_cable',
          label: 'Over head cable allowed',
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: 'cabling_required',
          label: 'In Building cabeling required',
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: 'poll_cabling_possible',
          label: 'Pole to pole cabling possible',
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: 'broadband_availability',
          label: 'Broadband Service Availability',
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_BROADBAND_PROVIDERS,
        },
        {
          field_key: 'cable_tv_availability',
          label: 'Cable TV Service Availability',
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_TV_PROVIDERS,
        },
        {
          field_key: 'locality_status',
          label: 'Locality Status',
          field_type: FIELD_TYPES.Select,
          options: AREA_LOCALITY_OPTIONS,
        },
      ],
    },
  ],
};
