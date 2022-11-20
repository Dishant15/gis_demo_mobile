import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import Icon from '~assets/markers/p_dp_view.svg';
import EditIcon from '~assets/markers/p_dp_edit.svg';
import {FIELD_TYPES} from '~Common/DynamicForm';

export const LAYER_KEY = 'p_dp';
export const PRE_UID = 'DP';
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
  unique_id: '',
  ref_code: '',
  status: 'RFS',
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Distribution Point Form',
      showCloseIcon: true,
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'remark',
          label: 'Remark',
          field_type: FIELD_TYPES.TextArea,
          required: false,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Address', field: 'address', type: 'simple'},
];
