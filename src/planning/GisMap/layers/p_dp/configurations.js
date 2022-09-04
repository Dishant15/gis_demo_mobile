export const LAYER_KEY = "p_dp";

export const INITIAL_DATA = {
  name: "",
  address: "",
  unique_id: "REG_DP_",
  status: { value: "P", label: "Planned" },
};

// this will become function -> generate From Configs
export const FORM_CONFIGS = {
  sections: [
    {
      title: "Distribution Point Form",
      fieldConfigs: [
        {
          field_key: "name",
          label: "Name",
          field_type: "input",
        },
        {
          field_key: "address",
          label: "Address",
          field_type: "textArea",
        },
        {
          field_key: "unique_id",
          label: "Unique Id",
          field_type: "input",
        },
        {
          field_key: "status",
          label: "Status",
          field_type: "select",
          options: [
            { value: "T", label: "Ticket Open" },
            { value: "P", label: "Planned" },
            { value: "V", label: "Verified" },
          ],
        },
      ],
    },
  ],
};

export const onSubmit = (data) => {
  console.log("🚀 ~ file: configurations.js ~ line 47 ~ onSubmit ~ data", data);
};
// export detailsPopup = {
//   "name" : "String"
// }

// export addForm

// export editForm = {
//   "name" : "String"
//   "multi sel": {
//     options :
//   }
// }
