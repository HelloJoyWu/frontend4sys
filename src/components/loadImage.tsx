import React from 'react';
import {StyleSheet, ActivityIndicator, View, Text} from 'react-native';

export const loadView = (showView: boolean) => {
  return (
    <View style={[styles.loadBox, {display: showView ? 'flex' : 'none'}]}>
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
};

export const hintView = (hintShow: boolean) => {
  return (
    <View style={[styles.hintBox, {display: hintShow ? 'flex' : 'none'}]}>
      <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '500'}}>
        資料已更新
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1D1D1DB2',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '30%',
  },
  hintBox: {
    width: '90%',
    backgroundColor: '#FBC634F1',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 10,
  },
});
