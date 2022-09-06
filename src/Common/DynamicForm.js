import React from 'react';
import {View, StyleSheet} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import {Button, Caption, Title} from 'react-native-paper';

import Input from '~Common/Input';
import {colors} from '~constants/constants';

/**
 * Render dynamicall generated formConfig based forms
 *
 * @formConfigs {sections: { title, fieldConfigs: [ { field_key, label, field_type } ] } }
 * @data initial data for edit forms
 */
const DynamicForm = ({formConfigs, data, onSubmit, onClose, isLoading}) => {
  const {sections} = formConfigs;

  const {register, control, handleSubmit} = useForm({
    defaultValues: data,
  });

  return (
    <View style={styles.container}>
      {sections.map((section, s_id) => {
        const {title, fieldConfigs, showCloseIcon} = section;
        return (
          <View key={title}>
            <Title>{title}</Title>
            {!!fieldConfigs ? (
              <View>
                {fieldConfigs.map(config => {
                  const {field_key, label, field_type} = config;

                  switch (field_type) {
                    case 'input':
                      return (
                        <Controller
                          key={field_key}
                          control={control}
                          name={field_key}
                          rules={{
                            required: `${label} is required.`,
                          }}
                          render={({field: {ref, onChange, onBlur, value}}) => (
                            <Input
                              ref={ref}
                              label={label}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                              // error={errors.name?.message}
                              underlineColorAndroid="transparent"
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="next"
                              blurOnSubmit={false}
                              // onSubmitEditing={handleFocus('address')}
                            />
                          )}
                        />
                      );
                    case 'textArea':
                      return (
                        <Controller
                          key={field_key}
                          control={control}
                          name={field_key}
                          rules={{
                            required: `${label} is required.`,
                          }}
                          render={({field: {ref, onChange, onBlur, value}}) => (
                            <Input
                              ref={ref}
                              label={label}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              value={value}
                              // error={errors.name?.message}
                              underlineColorAndroid="transparent"
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="done"
                              blurOnSubmit={true}
                              multiline={true}
                              // onSubmitEditing={handleFocus('address')}
                              inputStyle={{
                                minHeight: 100,
                              }}
                            />
                          )}
                        />
                      );
                    default:
                      return <Caption key={field_key}>{label}</Caption>;
                  }
                })}
                <Button
                  // loading={isLoading}
                  // contentStyle={layout.button}
                  color={colors.black}
                  uppercase
                  mode="contained"
                  // onPress={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});

export default DynamicForm;
