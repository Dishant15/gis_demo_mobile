import {View, Text} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
import {layout, THEME_COLORS} from '~constants/constants';
import ImagePicker from 'react-native-image-crop-picker';

const SurverImageUpload = () => {
  const chooseImageHandler = () => {
    ImagePicker.openCamera({compressImageQuality: 1})
      .then(image => {
        const mime = image.mime;
        const ext = mime.split('/')[1];
        const imageData = {
          name: `survey-photo-${Number(new Date())}.${ext}`,
          type: mime,
          uri: image.path,
        };
        console.log(
          '🚀 ~ file: SurverImageUpload.js:18 ~ ImagePicker.openCamera ~ imageData',
          imageData,
        );
      })
      .catch(err => {
        // console.log('err ', err)
      });
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          contentStyle={[layout.button]}
          color={THEME_COLORS.primary.main}
          mode="contained"
          uppercase
          onPress={chooseImageHandler}>
          Take Photo
        </Button>
      </View>
    </View>
  );
};

export default SurverImageUpload;
