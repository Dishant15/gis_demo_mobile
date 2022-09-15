import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import {View, StyleSheet} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import {Button, Caption, Title, Chip, HelperText} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Input from '~Common/Input';
import TagSelect from './TagSelect';

import {colors, layout} from '~constants/constants';
import {get} from 'lodash';

/**
 * Render dynamicall generated formConfig based forms
 *
 * @formConfigs {sections: { title, fieldConfigs: [ { field_key, label, field_type } ] } }
 * @data initial data for edit forms
 */
const DynamicForm = forwardRef(
  ({formConfigs, data, onSubmit, onCancel, isLoading}, ref) => {
    const {sections} = formConfigs;
    const {top} = useSafeAreaInsets();

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
        style={[styles.container, {paddingTop: Math.max(top, 0)}]}>
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
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => (
                              <Input
                                ref={ref}
                                label={label}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                error={get(errors, [field_key, 'message'])}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                blurOnSubmit={false}
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
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => (
                              <Input
                                ref={ref}
                                label={label}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                error={get(errors, [field_key, 'message'])}
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
                      case 'chipSelect':
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={{
                              required: `${label} is required.`,
                            }}
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
                                        const selected =
                                          opt.value === value.value;
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
                                            onPress={() => onChange(opt)}>
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
                      case 'select':
                        return (
                          <Controller
                            key={field_key}
                            control={control}
                            name={field_key}
                            rules={{
                              required: `${label} is required.`,
                            }}
                            render={({
                              field: {ref, onChange, onBlur, value},
                            }) => (
                              <>
                                <TagSelect
                                  inputLabel={label}
                                  tagList={config.options || []}
                                  onSubmit={onChange}
                                  selectedTags={value}
                                />
                              </>
                            )}
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
            color={colors.black}
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
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
  },
  chipActive: {
    backgroundColor: colors.primaryMain + 'cc',
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
