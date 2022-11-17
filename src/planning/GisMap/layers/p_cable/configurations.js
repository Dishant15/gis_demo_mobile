import {FEATURE_TYPES, LAYER_STATUS_OPTIONS} from '../common/configuration';
import CableIcon from '~assets/markers/line_pin.svg';

export const LAYER_KEY = 'p_cable';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYLINE;

export const getViewOptions = ({color_on_map}) => {
  return {
    strokeColor: color_on_map,
    strokeWidth: 2,
    icon: CableIcon,
    pin: CableIcon,
  };
};

export const INITIAL_ELEMENT_DATA = {
  name: '',
  unique_id: 'REG_CBL_',
  ref_code: '',
  status: 'P',
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
    {
      title: 'Cable Form',
      fieldConfigs: [
        {
          field_key: 'name',
          label: 'Name',
          field_type: 'input',
        },
        {
          field_key: 'unique_id',
          label: 'Unique Id',
          field_type: 'input',
        },
        {
          field_key: 'ref_code',
          label: 'Reff Code',
          field_type: 'input',
        },
        {
          field_key: 'status',
          label: 'Status',
          field_type: 'chipSelect',
          options: LAYER_STATUS_OPTIONS,
        },
        {
          field_key: 'cable_type',
          label: 'Cable Type',
          field_type: 'chipSelect',
          options: CABLE_TYPE_OPTIONS,
        },
        {
          field_key: 'gis_len',
          label: 'Gis Length (Km)',
          field_type: 'input',
          type: 'number',
        },
        {
          field_key: 'actual_len',
          label: 'Actual Length',
          field_type: 'input',
          type: 'number',
        },
        {
          field_key: 'start_reading',
          label: 'Start Reading',
          field_type: 'input',
          type: 'number',
        },
        {
          field_key: 'end_reading',
          label: 'End Reading',
          field_type: 'input',
          type: 'number',
        },
      ],
    },
  ],
};

export const transformAndValidateConfigData = data => data;

export const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Cable Type', field: 'cable_type_display', type: 'simple'},
  {label: 'Gis Length', field: 'gis_len', type: 'simple'},
  {label: 'Actual Length', field: 'actual_len', type: 'simple'},
  {label: 'Start Reading', field: 'start_reading', type: 'simple'},
  {label: 'End Reading', field: 'end_reading', type: 'simple'},
  {label: 'No of tubes', field: 'no_of_tube', type: 'simple'},
  {label: 'Core / Tube', field: 'core_per_tube', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];

export const transformAndValidateData = (
  formData,
  setError,
  isEdit,
  configurationId,
) => {
  if (isEdit) {
    return formData;
  } else {
    return {
      ...formData,
      // convert select fields to simple values
      configuration: configurationId,
    };
  }
};
