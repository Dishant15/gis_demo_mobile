import {FEATURE_TYPES, LAYER_STATUS_OPTIONS} from '../common/configuration';
import SecondarySpliterIcon from '~assets/markers/spliter_view.svg';
import SecondarySpliterEditIcon from '~assets/markers/spliter_edit.svg';
import PrimarySpliterIcon from '~assets/markers/spliter_view_primary.svg';
import PrimarySpliterEditIcon from '~assets/markers/spliter_edit_primary.svg';

export const LAYER_KEY = 'p_splitter';
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
  unique_id: 'REG_SP_P_',
  ref_code: '',
  status: 'P',
  coordinates: {},
};

export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Splitter Form',
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
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Splitter Type', field: 'splitter_type_display', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Ratio', field: 'ratio', type: 'simple'},
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
