import {FIELD_TYPES} from '~Common/DynamicForm';
import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {AREA_TAG_OPTIONS} from '../p_survey_area';

import Icon from '~assets/markers/building_view.svg';
import EditIcon from '~assets/markers/building_pin.svg';

export const LAYER_KEY = 'p_survey_building';
export const PRE_UID = 'SB';
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

export const BUILDING_CATEGORY_OPTIONS = [
  {value: 'M', label: 'MDU'},
  {value: 'S', label: 'SDU'},
];

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  tags: '',
  category: 'M',
  floors: 0,
  house_per_floor: 0,
  total_home_pass: 0,
  unique_id: '',
  ref_code: '',
  status: 'RFS',
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Survey Building Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'tags',
          label: 'Tags',
          field_type: FIELD_TYPES.SelectMulti,
          options: AREA_TAG_OPTIONS,
        },
        {
          field_key: 'category',
          label: 'Category',
          field_type: FIELD_TYPES.ChipSelect,
          options: BUILDING_CATEGORY_OPTIONS,
        },
        {
          field_key: 'floors',
          label: 'Floors',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
        {
          field_key: 'house_per_floor',
          label: 'House Per Floor',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
        {
          field_key: 'total_home_pass',
          label: 'Total Home Pass',
          field_type: FIELD_TYPES.Input,
          type: 'number',
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Tags', field: 'tags', type: 'simple'},
  {label: 'Categories', field: 'category_display', type: 'simple'},
  {label: 'Floors', field: 'floors', type: 'simple'},
  {label: 'House Per Floor', field: 'house_per_floor', type: 'simple'},
  {label: 'Total Home Pass', field: 'total_home_pass', type: 'simple'},
];
