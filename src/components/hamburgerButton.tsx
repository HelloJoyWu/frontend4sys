import React from 'react';
import {Image, Text, StyleSheet, View, TouchableOpacity} from 'react-native';

/**
 * onPress: button trigger event
 */
interface Props {
  onPress: () => void;
}
const hamburgerButton: React.FC<Props> = props => {
  return (
    <View style={styles.settingBox}>
      <TouchableOpacity onPress={props.onPress}>
        <Image
          source={require('../../res/menu/hamburger.png')}
          style={styles.settingBtn}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  settingBox: {
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
  },
  settingBtn: {
    marginVertical: 5,
    marginHorizontal: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default hamburgerButton;
