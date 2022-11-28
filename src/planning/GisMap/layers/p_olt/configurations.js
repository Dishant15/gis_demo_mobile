import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {FIELD_TYPES} from '~Common/DynamicForm';

import {default as Icon} from '~assets/markers/olt_box.svg';
import {default as EditIcon} from '~assets/markers/olt_pin.svg';

export const LAYER_KEY = 'p_olt';
export const PRE_UID = 'OLT';
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
      title: 'OLT Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'ip_address',
          label: 'IP Address',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'nms_ref_name',
          label: 'NMS Reference Name',
          field_type: FIELD_TYPES.Input,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'IP Address', field: 'ip_address', type: 'simple'},
  {label: 'NMS Reference Name', field: 'nms_ref_name', type: 'simple'},
  {label: 'Uplink Port Count', field: 'uplink_port_count', type: 'simple'},
  {
    label: 'Downlink Port Count',
    field: 'downlink_port_count',
    type: 'simple',
  },
];

export const INITIAL_CONFIG_DATA = {
  config_name: '',
  uplink_port_count: '',
  downlink_port_count: '',
};

export const CONFIG_LIST_TABLE_COL_DEFS = [
  {headerName: 'Name', field: 'config_name'},
  {headerName: 'Uplink port count', field: 'uplink_port_count'},
  {headerName: 'Downlink port count', field: 'downlink_port_count'},
];

export const ELEMENT_CONFIG_TEMPLATE = {
  sections: [
    {
      title: 'OLT Form',
      fieldConfigs: [
        {
          field_key: 'config_name',
          label: 'Name',
          field_type: 'input',
        },
        {
          field_key: 'uplink_port_count',
          label: 'Uplink port count',
          field_type: 'input',
        },
        {
          field_key: 'downlink_port_count',
          label: 'Downlink port count',
          field_type: 'input',
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'connections',
  },
];
