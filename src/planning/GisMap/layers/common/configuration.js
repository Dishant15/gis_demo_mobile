import {FIELD_TYPES} from '~Common/DynamicForm';

export const zIndexMapping = {
  region: 1,
  p_survey_area: 2,
  // 3 - 5 -> Polygons at the bottom
  // 6 - 7 -> Polylines at the bottom
  p_survey_building: 8,
  p_pop: 9,
  p_spop: 10,
  p_fsa: 11,
  p_dsa: 12,
  p_csa: 13,
  p_pole: 14,
  p_manhole: 15,
  p_jointcloser: 16,
  p_olt: 17,
  p_splitter: 18,
  p_dp: 19,
  p_cable: 20,

  edit: 50,
  highlighted: 60,
  mapType: 61,
};

export const LAYER_STATUS_OPTIONS = [
  {value: 'L1', label: 'L1 Design'},
  {value: 'L2', label: 'L2 Design'},
  {value: 'RFS', label: 'Ready For Service'},
  {value: 'IA', label: 'In Active'},
];

export const FEATURE_TYPES = {
  POLYLINE: 'polyline',
  POINT: 'point',
  POLYGON: 'polygon',
  MULTI_POLYGON: 'multi_polygon',
};

export const ELEMENT_FORM_CONFIG_ABSTRACT_SECTION = {
  title: 'Configuration',
  section_type: 'configuration',
  fieldConfigs: [
    {
      field_key: 'configuration',
      label: 'Configuration',
      field_type: FIELD_TYPES.Select,
    },
  ],
};

export const ELEMENT_FORM_ABSTRACT_TEMPLATE = [
  {
    field_key: 'name',
    label: 'Name',
    field_type: FIELD_TYPES.Input,
    validationProps: {
      required: 'Name is required.',
    },
  },
  {
    field_key: 'unique_id',
    label: 'Unique Id',
    field_type: FIELD_TYPES.Input,
    disabled: true,
  },
  {
    field_key: 'network_id',
    label: 'Network Id',
    field_type: FIELD_TYPES.Input,
    disabled: true,
  },
  {
    field_key: 'ref_code',
    label: 'Reff Code',
    field_type: FIELD_TYPES.Input,
  },
  {
    field_key: 'status',
    label: 'Status',
    field_type: FIELD_TYPES.ChipSelect,
    options: LAYER_STATUS_OPTIONS,
  },
];

export const ELEMENT_TABLE_ABSTRACT_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Network Id', field: 'network_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];
