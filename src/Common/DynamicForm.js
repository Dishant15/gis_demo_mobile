import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import {
  Button,
  Caption,
  Title,
  Chip,
  HelperText,
  Text,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Input from '~Common/Input';
import {FormSelect} from './components/FormFields';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors, layout, THEME_COLORS} from '~constants/constants';
import get from 'lodash/get';

export const FIELD_TYPES = {
  Input: 'input',
  TextArea: 'textArea',
  CheckBox: 'checkBox',
  // single select
  Select: 'select',
  ChipSelect: 'chipSelect',
  SelectMulti: 'selectMulti',
  SelectCreatable: 'selectCreatable',
};

/**
 * Render dynamicall generated formConfig based forms
 *
 * @formConfigs {sections: { title, fieldConfigs: [ { field_key, label, field_type } ] } }
 * @data initial data for edit forms
 *
 * Parent:
 *    GisLayerForm
 */
const DynamicForm = forwardRef(
  (
    {formConfigs, data, onSubmit, onCancel, isLoading, skipTitleIndex = null},
    ref,
  ) => {
    const {sections} = formConfigs;
    const {bottom} = useSafeAreaInsets();

    const {
      formState: {errors},
      register,
      control,
      setError,
      clearErrors,
      handleSubmit,
    } = useForm({
      defaultValues: data,
    });

    useImperativeHandle(ref, () => ({
      onError: (fieldKey, errorMsg) => {
        setError(fieldKey, {type: 'custom', message: errorMsg});
      },
    }));

    const onFormSubmit = useCallback(data => {
      onSubmit(data, setError, clearErrors);
    }, []);

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={[styles.container, {paddingBottom: Math.max(bottom, 12)}]}>
        {sections.map((section, s_id) => {
          const {title, fieldConfigs, showCloseIcon} = section;
          return (
            <View key={title}>
              {skipTitleIndex === s_id ? null : <Title>{title}</Title>}
              {!!fieldConfigs ? (
                <View>
                  {fieldConfigs.map(config => {
                    const {
                      field_key,
                      label,
                      field_type,
                      type,
                      validationProps,
                      disabled,
                    } = config;
                    switch (field_type) {
                      case FIELD_TYPES.Input:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => (
                              <Input
                                ref={ref}
                                label={label}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={!!value ? String(value) : ''}
                                error={get(errors, [field_key, 'message'])}
                                disabled={disabled}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                keyboardType={
                                  type === 'number' ? 'number-pad' : 'default'
                                }
                              />
                            )}
                          />
                        );
                      case FIELD_TYPES.TextArea:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => (
                              <Input
                                ref={ref}
                                label={label}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={!!value ? String(value) : ''}
                                error={get(errors, [field_key, 'message'])}
                                disabled={disabled}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next" // next will not show new line in keyboard
                                blurOnSubmit={true}
                                multiline={true}
                                // onSubmitEditing={handleFocus('address')}
                                inputStyle={{
                                  height: 100,
                                }}
                                keyboardType={
                                  type === 'number' ? 'number-pad' : 'default'
                                }
                              />
                            )}
                          />
                        );
                      case FIELD_TYPES.CheckBox:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({field: {onChange, value}}) => {
                              const errMessage = get(errors, [
                                field_key,
                                'message',
                              ]);
                              return (
                                <>
                                  <Pressable
                                    style={styles.checkboxWrapper}
                                    onPress={() => onChange(!value)}>
                                    <MaterialCommunityIcons
                                      size={26}
                                      name={
                                        value
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      color={
                                        value
                                          ? colors.primaryMain
                                          : colors.primaryFontColor
                                      }
                                      style={{textAlign: 'center'}}
                                    />
                                    <Text style={styles.checkboxText}>
                                      {label}
                                    </Text>
                                  </Pressable>
                                  {!!errMessage ? (
                                    <HelperText
                                      type="error"
                                      visible={!!errMessage}>
                                      {errMessage}
                                    </HelperText>
                                  ) : null}
                                </>
                              );
                            }}
                          />
                        );
                      case FIELD_TYPES.ChipSelect:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => {
                              const errMessage = get(errors, [
                                field_key,
                                'message',
                              ]);
                              return (
                                <>
                                  <View style={styles.categoryWrapper}>
                                    <Caption>{label}</Caption>
                                    <View style={styles.chipWrapper}>
                                      {get(config, 'options', []).map(opt => {
                                        const selected = opt.value === value;
                                        return (
                                          <Chip
                                            key={opt.value}
                                            style={[
                                              styles.chip,
                                              selected && styles.chipActive,
                                            ]}
                                            selected={selected}
                                            selectedColor={
                                              selected ? colors.white : null
                                            }
                                            onPress={() => onChange(opt.value)}>
                                            {opt.label}
                                          </Chip>
                                        );
                                      })}
                                    </View>
                                  </View>
                                  {!!errMessage ? (
                                    <HelperText
                                      type="error"
                                      visible={!!errMessage}>
                                      {errMessage}
                                    </HelperText>
                                  ) : null}
                                </>
                              );
                            }}
                          />
                        );
                      case FIELD_TYPES.Select:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => {
                              const errMessage = get(errors, [
                                field_key,
                                'message',
                              ]);
                              return (
                                <>
                                  <FormSelect
                                    inputLabel={label}
                                    tagList={config.options || []}
                                    onSubmit={onChange}
                                    selectedTags={value}
                                    simpleValue
                                  />
                                  {!!errMessage ? (
                                    <HelperText
                                      type="error"
                                      visible={!!errMessage}>
                                      {errMessage}
                                    </HelperText>
                                  ) : null}
                                </>
                              );
                            }}
                          />
                        );
                      case FIELD_TYPES.SelectMulti:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => {
                              const errMessage = get(errors, [
                                field_key,
                                'message',
                              ]);
                              return (
                                <>
                                  <FormSelect
                                    inputLabel={label}
                                    tagList={config.options || []}
                                    onSubmit={onChange}
                                    selectedTags={value}
                                    isMulti
                                    simpleValue
                                  />
                                  {!!errMessage ? (
                                    <HelperText
                                      type="error"
                                      visible={!!errMessage}>
                                      {errMessage}
                                    </HelperText>
                                  ) : null}
                                </>
                              );
                            }}
                          />
                        );

                      case FIELD_TYPES.SelectCreatable:
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={validationProps}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => {
                              const errMessage = get(errors, [
                                field_key,
                                'message',
                              ]);
                              return (
                                <>
                                  <FormSelect
                                    inputLabel={label}
                                    tagList={config.options || []}
                                    onSubmit={onChange}
                                    selectedTags={value}
                                    simpleValue
                                    isMulti
                                    creatable
                                  />
                                  {!!errMessage ? (
                                    <HelperText
                                      type="error"
                                      visible={!!errMessage}>
                                      {errMessage}
                                    </HelperText>
                                  ) : null}
                                </>
                              );
                            }}
                          />
                        );
                      default:
                        return <Caption key={field_key}>{label}</Caption>;
                    }
                  })}
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={styles.btnWrapper}>
          <Button
            style={styles.btn1}
            contentStyle={layout.button}
            color={colors.black}
            uppercase
            mode="outlined"
            onPress={onCancel}>
            Cancel
          </Button>
          <Button
            style={styles.btn2}
            loading={isLoading}
            contentStyle={layout.button}
            labelStyle={{
              color: THEME_COLORS.secondary.contrastText,
            }}
            color={THEME_COLORS.secondary.main}
            uppercase
            mode="contained"
            onPress={handleSubmit(onFormSubmit)}>
            Submit
          </Button>
        </View>
      </KeyboardAwareScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  categoryWrapper: {
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 10,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
  },
  chipActive: {
    backgroundColor: colors.primaryMain + 'cc',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 8,
  },
  checkboxText: {
    fontSize: 17,
    paddingLeft: 8,
  },
  btnWrapper: {
    flexDirection: 'row',
    paddingVertical: 24,
  },
  btn1: {
    flex: 1,
    marginRight: 6,
  },
  btn2: {
    flex: 2,
    marginLeft: 6,
  },
});

export default DynamicForm;
