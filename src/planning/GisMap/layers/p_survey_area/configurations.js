import {FIELD_TYPES} from '~Common/DynamicForm';
import {FEATURE_TYPES, LAYER_STATUS_OPTIONS} from '../common/configuration';
import {percentToHex} from '~utils/app.utils';
import Icon from '~assets/markers/path.svg';

export const LAYER_KEY = 'p_survey_area';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

const STROKE_COLOR = '#CE855A';
const FILL_COLOR = '#CE855A' + percentToHex(30);

export const getViewOptions = () => ({
  strokeColor: STROKE_COLOR,
  strokeWidth: 2,
  fillColor: FILL_COLOR,
  icon: Icon,
  pin: Icon,
});

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
          type: 'number',
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
          type: 'number',
        },
        {
          field_key: 'over_head_cable',
          label: 'Over head cable allowed',
          field_type: FIELD_TYPES.CheckBox,
          required: false,
        },
        {
          field_key: 'cabling_required',
          label: 'In Building cabeling required',
          field_type: FIELD_TYPES.CheckBox,
          required: false,
        },
        {
          field_key: 'poll_cabling_possible',
          label: 'Pole to pole cabling possible',
          field_type: FIELD_TYPES.CheckBox,
          required: false,
        },
        {
          field_key: 'broadband_availability',
          label: 'Broadband Service Availability',
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_BROADBAND_PROVIDERS,
          required: false,
        },
        {
          field_key: 'cable_tv_availability',
          label: 'Cable TV Service Availability',
          field_type: FIELD_TYPES.SelectCreatable,
          options: AREA_TV_PROVIDERS,
          required: false,
        },
        {
          field_key: 'locality_status',
          label: 'Locality Status',
          field_type: FIELD_TYPES.ChipSelect,
          options: AREA_LOCALITY_OPTIONS,
          required: false,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Area', field: 'area', type: 'simple'},
  {label: 'City', field: 'city', type: 'simple'},
  {label: 'State', field: 'state', type: 'simple'},
  {label: 'Pincode', field: 'pincode', type: 'simple'},
  {label: 'Tags', field: 'tags', type: 'simple'},
  {label: 'Home Pass', field: 'home_pass', type: 'simple'},
  {label: 'Over Head Cable', field: 'over_head_cable', type: 'boolean'},
  {label: 'Cabling Required', field: 'cabling_required', type: 'boolean'},
  {
    label: 'Poll Cabling possible',
    field: 'poll_cabling_possible',
    type: 'boolean',
  },
  {
    label: 'Locality Status',
    field: 'locality_status_display',
    type: 'simple',
  },
  // multi select comma separeted string
  {
    label: 'Broadband Availability',
    field: 'broadband_availability',
    type: 'simple',
  },
  {
    label: 'Cable Tv Availability',
    field: 'cable_tv_availability',
    type: 'simple',
  },
  {label: 'Status', field: 'status', type: 'status'},
];
