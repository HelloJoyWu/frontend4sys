import React, {useState} from 'react';
import {StyleSheet, Text, View, ImageBackground} from 'react-native';

const DemandReportScreen: React.FC<{}> = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../res/bg.png')}
        style={styles.backGroundSet}>
        <View>
          <Text>努力中...</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBtnBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  alertBtn: {
    margin: 5,
  },
});
export default DemandReportScreen;
