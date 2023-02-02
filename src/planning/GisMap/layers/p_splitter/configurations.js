import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
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
      ...ELEMENT_FORM_CONFIG_ABSTRACT_SECTION,
      title: 'Spliter Configuration',
    },
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
          field_key: 'contact_name',
          label: 'Contact Name',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'contact_no',
          label: 'Contact No',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'is_rented',
          label: 'Rented',
          field_type: FIELD_TYPES.CheckBox,
        },
        {
          field_key: 'rent_amount',
          label: 'Amount',
          field_type: FIELD_TYPES.Input,
          isHidden: props => {
            return !props.is_rented;
          },
        },
        // {
        //   field_key: "agreement_start_date",
        //   label: "Agreement start date",
        //   field_type: FIELD_TYPES.DateTime,
        //   isHidden: (props) => {
        //     return !props.is_rented;
        //   },
        // },
        // {
        //   field_key: "agreement_end_date",
        //   label: "Agreement end date",
        //   field_type: FIELD_TYPES.DateTime,
        //   isHidden: (props) => {
        //     return !props.is_rented;
        //   },
        // },
      ],
    },
  ],
  dependencyFields: ['is_rented'],
  // this shows where dependant template data comes from
  metaData: {
    getElementAddressData: (address, submitData) => {
      submitData.address = address.address;
    },
  },
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Splitter Type', field: 'splitter_type_display', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Contact Name', field: 'contact_name', type: 'simple'},
  {label: 'Contact No', field: 'contact_no', type: 'simple'},
  {label: 'Rented', field: 'is_rented', type: 'boolean'},
  {label: 'Rent Amount', field: 'rent_amount', type: 'simple'},
  {
    label: 'Agreement start date',
    field: 'agreement_start_date',
    type: 'date',
  },
  {label: 'Agreement end date', field: 'agreement_end_date', type: 'date'},
  {label: 'Input Ports', field: 'input_ports', type: 'simple'},
  {label: 'Output Ports', field: 'output_ports', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'connections',
  },
  {
    control: 'ports',
  },
];
