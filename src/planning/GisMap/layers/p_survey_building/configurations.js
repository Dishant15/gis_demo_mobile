import {FIELD_TYPES} from '~Common/DynamicForm';
import {LAYER_STATUS_OPTIONS} from '../common/configuration';
import {AREA_TAG_OPTIONS} from '../p_survey_area';

export const LAYER_KEY = 'p_survey_building';

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
  unique_id: 'REG_SB_',
  ref_code: '',
  status: 'P',
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'Survey Building Form',
      fieldConfigs: [
        {
          field_key: 'name',
          label: 'Name',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'address',
          label: 'Address',
          field_type: FIELD_TYPES.TextArea,
        },
        {
          field_key: 'unique_id',
          label: 'Unique Id',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'ref_code',
          label: 'Reff Code',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'status',
          label: 'Status',
          field_type: FIELD_TYPES.Select,
          options: LAYER_STATUS_OPTIONS,
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
