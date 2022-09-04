export const LAYER_KEY = "p_splitter";

export const INITIAL_DATA = {
  config_name: "",
  splitter_type: "",
  ratio: "",
  specification: "",
  vendor: "",
};

// this will become function -> generate From Configs
export const FORM_CONFIGS = {
  sections: [
    {
      title: "Spliter Form",
      fieldConfigs: [
        {
          field_key: "config_name",
          label: "Name",
          field_type: "input",
        },
        {
          field_key: "splitter_type",
          label: "Splitter Type",
          field_type: "select",
          options: [
            { value: "P", label: "Primary" },
            { value: "S", label: "Secondary" },
          ],
        },
        {
          field_key: "ratio",
          label: "Ratio",
          field_type: "input",
        },
        {
          field_key: "specification",
          label: "Specification",
          field_type: "textArea",
        },
        {
          field_key: "vendor",
          label: "Vendor",
          field_type: "input",
        },
      ],
      showCloseIcon: true,
    },
  ],
};

export const onSubmit = (data, layerKey) => {
  console.log(
    "🚀 ~ file: configurations.js ~ line 47 ~ onSubmit ~ data",
    data,
    layerKey
  );
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
