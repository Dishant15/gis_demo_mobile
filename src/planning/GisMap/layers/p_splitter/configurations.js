import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import SecondarySpliterIcon from '~assets/markers/spliter_view.svg';
import SecondarySpliterEditIcon from '~assets/markers/spliter_edit.svg';
import PrimarySpliterIcon from '~assets/markers/spliter_view_primary.svg';
import PrimarySpliterEditIcon from '~assets/markers/spliter_edit_primary.svg';
import {FIELD_TYPES} from '~Common/DynamicForm';

export const LAYER_KEY = 'p_splitter';
export const PRE_UID = 'SP';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POINT;

export const getViewOptions = ({splitter_type}) => ({
  tappable: false,
  draggable: false,
  stopPropagation: true,
  flat: true,
  tracksInfoWindowChanges: false,
  icon: splitter_type === 'P' ? PrimarySpliterIcon : SecondarySpliterIcon,
  pin:
    splitter_type === 'P' ? PrimarySpliterEditIcon : SecondarySpliterEditIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  unique_id: '',
  ref_code: '',
  status: 'RFS',
  coordinates: {},
};

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Splitter Form',
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
  {label: 'Splitter Type', field: 'splitter_type_display', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Ratio', field: 'ratio', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'connections',
  },
];
