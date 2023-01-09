import React, {useState} from 'react';
import {AxiosInstance} from 'axios';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import * as StorageHelper from '../utils/storageHelper';

export const RefreshButton = (
  authAxios: AxiosInstance,
  updateTime: any,
  setBtnDis: any,
  btnDis: boolean,
) => {
  const featchTypeData = async () => {
    try {
      const [respAgent, respGame] = await Promise.all([
        await authAxios.get('/api/v1/inquiry/agent/list'),
        await authAxios.get('/api/v1/inquiry/game/list'),
      ]);

      console.log('Loading latest Agent and Game info success');
      StorageHelper.storeAgentInfos(respAgent.data);
      StorageHelper.storeGameInfos(respGame.data);
      updateTime(new Date());
      setBtnDis(false);

      Alert.alert('更新成功');
      await StorageHelper.storeInfo2Local(respAgent.data, respGame.data);
    } catch (error: any) {
      if (error?.code === 'ECONNABORTED') {
        // Catching axios config timeout
        console.log(error);
      }
      console.error(
        'Fetch latest Agent and Game failed',
        error.name,
        error.message,
      );
      Alert.alert('更新失敗', error.message);
      setBtnDis(false);
    }
  };

  return (
    <View pointerEvents="box-none" style={[styles.showView]}>
      <TouchableOpacity
        style={styles.refreshBtn}
        disabled={btnDis}
        onPress={() => {
          featchTypeData();
          setBtnDis(true);
        }}>
        <View>
          <Text style={styles.font1}>重新</Text>
          <Text style={styles.font1}>整理</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  showView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 10,
    marginBottom: 7,
    width: '100%',
  },
  refreshBtn: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#CBE7FF',
  },

  font1: {color: '#072357', fontSize: 14, fontWeight: '700'},
});

// export default refreshButton;
