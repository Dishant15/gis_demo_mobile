import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import CableIcon from '~assets/markers/line_pin.svg';
import {FIELD_TYPES} from '~Common/DynamicForm';

export const LAYER_KEY = 'p_cable';
export const PRE_UID = 'CBL';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYLINE;

export const getViewOptions = ({color_on_map, cable_type}) => {
  let options = {
    strokeColor: color_on_map,
    icon: CableIcon,
    pin: CableIcon,
    geodesic: true,
  };
  if (cable_type === 'U') {
    // underground : dot line
    options.lineDashPattern = [5, 10];
    options.lineCap = 'round';
    options.strokeWidth = 5;
  } else if (cable_type === 'W') {
    // wall clamp: dash line
    options.lineDashPattern = [0, 15, 30];
    options.lineCap = 'square';
  }
  return options;
};

export const INITIAL_ELEMENT_DATA = {
  name: '',
  unique_id: '',
  ref_code: '',
  status: 'RFS',
  coordinates: [],
  // editable
  cable_type: 'O',
  // gis_len ,actual_len, start_reading ,end_reading
};

export const CABLE_TYPE_OPTIONS = [
  {value: 'O', label: 'Overhead'},
  {value: 'U', label: 'Underground'},
  {value: 'W', label: 'Wall Clamped'},
];

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    // {
    //   ...ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
    //   title: 'Cable Configuration',
    //   table_fields: [],
    // },
    {
      title: 'Cable Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'cable_type',
          label: 'Cable Type',
          field_type: 'chipSelect',
          options: CABLE_TYPE_OPTIONS,
        },
        {
          field_key: 'gis_len',
          label: 'Gis Length (Km)',
          field_type: FIELD_TYPES.Input,
          type: 'number',
          disabled: true,
        },
        {
          field_key: 'actual_len',
          label: 'Actual Length',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
        {
          field_key: 'start_reading',
          label: 'Start Reading',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
        {
          field_key: 'end_reading',
          label: 'End Reading',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
      ],
    },
  ],
  // this shows where dependant template data comes from
  metaData: {
    geometryUpdateFields: ['gis_len'],
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Cable Type', field: 'cable_type_display', type: 'simple'},
  {label: 'Gis Length', field: 'gis_len', type: 'simple'},
  {label: 'Actual Length', field: 'actual_len', type: 'simple'},
  {label: 'Start Reading', field: 'start_reading', type: 'simple'},
  {label: 'End Reading', field: 'end_reading', type: 'simple'},
  {label: 'No of tubes', field: 'no_of_tube', type: 'simple'},
  {label: 'Core / Tube', field: 'core_per_tube', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'ports',
  },
];
