import {FIELD_TYPES} from '~Common/DynamicForm';

export const LAYER_STATUS_OPTIONS = [
  {value: 'L1', label: 'L1 Design'},
  {value: 'L2', label: 'L2 Design'},
  {value: 'RFS', label: 'Ready For Service'},
  {value: 'IA', label: 'In Active'},
];

export const zIndexMapping = {
  region: 1,
  p_survey_area: 2,
  // 3 - 5 -> Polygons at the bottom
  // 6 - 7 -> Polylines at the bottom
  p_cable: 8,
  p_survey_building: 9,
  p_dp: 10,
  p_splitter: 11,

  edit: 50,
  mapType: 51,
};

export const FEATURE_TYPES = {
  POLYLINE: 'polyline',
  POINT: 'point',
  POLYGON: 'polygon',
  MULTI_POLYGON: 'multi_polygon',
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
