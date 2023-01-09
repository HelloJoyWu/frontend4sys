import React from 'react';
import {Image, Text, StyleSheet, View, TouchableOpacity} from 'react-native';

/**
 * tltle: show title
 * color: back button backgorund color
 * onPress: button trigger event
 */
interface Props {
  title: string;
  color: string;
  onPress: () => void;
}
const backButton: React.FC<Props> = props => {
  return (
    <View style={styles.titleBox}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={{
            backgroundColor: props.color,
            width: 40,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            marginRight: 10,
          }}>
          <Image
            style={{width: 21, height: 26, resizeMode: 'contain'}}
            source={require('../../res/btn_back.png')}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.titleBoxText}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleBoxImg: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 10,
  },
  titleBoxText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default backButton;
