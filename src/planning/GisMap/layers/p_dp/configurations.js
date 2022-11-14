import {FEATURE_TYPES, LAYER_STATUS_OPTIONS} from '../common/configuration';
import {latLongMapToCoords} from '~utils/map.utils';
import Icon from '~assets/markers/p_dp_view.svg';
import EditIcon from '~assets/markers/p_dp_edit.svg';

export const LAYER_KEY = 'p_dp';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = () => ({
  tappable: false,
  draggable: false,
  stopPropagation: true,
  flat: true,
  tracksInfoWindowChanges: false,
  icon: Icon,
  pin: EditIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  unique_id: 'REG_DP_',
  ref_code: '',
  status: 'P',
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Distribution Point Form',
      showCloseIcon: true,
      fieldConfigs: [
        {
          field_key: 'name',
          label: 'Name',
          field_type: 'input',
        },
        {
          field_key: 'address',
          label: 'Address',
          field_type: 'textArea',
        },
        {
          field_key: 'unique_id',
          label: 'Unique Id',
          field_type: 'input',
        },
        {
          field_key: 'status',
          label: 'Status',
          field_type: 'chipSelect',
          options: LAYER_STATUS_OPTIONS,
        },
        {
          field_key: 'remark',
          label: 'Remark',
          field_type: 'textArea',
          required: false,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];
