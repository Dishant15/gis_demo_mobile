import React from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';

import {Button} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';

import {layout, THEME_COLORS} from '~constants/constants';

const testImage =
  'https://images.unsplash.com/photo-1675935121015-63fea33e25d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=2000&q=60';

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
      <View style={{alignItems: 'flex-end', paddingEnd: 16}}>
        <Button
          contentStyle={[layout.button]}
          color={THEME_COLORS.secondary.main}
          mode="contained"
          labelStyle={{
            color: THEME_COLORS.secondary.contrastText,
          }}
          uppercase
          onPress={chooseImageHandler}
          icon="plus">
          Add Photo
        </Button>
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          data={[{}, {}]}
          renderItem={({item, index}) => {
            return (
              <View style={styles.imageListItem}>
                <View style={styles.imageWrapper}>
                  <FastImage
                    source={{uri: testImage}}
                    style={styles.img}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text maxFontSizeMultiplier={1} style={styles.caption}>
                    Sample Image {index}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{padding: 8}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    borderTopWidth: 3,
    borderColor: '#e8e8e8',
    marginTop: 16,
  },
  imageListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
  },
  img: {
    flex: 1,
    width: null,
    height: null,
  },
  caption: {
    fontSize: 14,
    color: 'black',
    marginStart: 8,
    textAlign: 'center',
  },
});

export default SurverImageUpload;
