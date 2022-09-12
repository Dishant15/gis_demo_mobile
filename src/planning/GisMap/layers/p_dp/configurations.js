export const LAYER_KEY = 'p_dp';

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  unique_id: 'REG_DP_',
  ref_code: '',
  status: {value: 'P', label: 'Planned'},
  coordinates: {},
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
          options: [
            {value: 'T', label: 'Ticket Open'},
            {value: 'P', label: 'Planned'},
            {value: 'V', label: 'Verified'},
          ],
        },
        {
          field_key: 'remark',
          label: 'Remark',
          field_type: 'textArea',
        },
      ],
    },
  ],
};
