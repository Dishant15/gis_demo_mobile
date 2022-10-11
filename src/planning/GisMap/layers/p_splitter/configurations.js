import {LAYER_STATUS_OPTIONS} from '../common/configuration';

export const LAYER_KEY = 'p_splitter';

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
