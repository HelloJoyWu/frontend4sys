import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/backButton';
// import android.os.Bundle;
import {StackNavigationProp} from '@react-navigation/stack';

//預先讀取資料
const testData: Array<any> = [
  {
    name: '風控警示',
    time: '17:50',
    label: '吧吧吧吧吧吧吧吧吧吧吧吧',
    account: '1',
    key_id: 'test_A',
  },
  {
    name: 'table game會員對沖行為',
    time: '14:44',
    label: '吧吧吧吧吧吧吧吧吧吧吧ㄅ',
    account: '2',
    key_id: 'test_B',
  },
  {
    name: 'TOTAL-hour-highNetWin',
    time: '12:22',
    label: '的的的的的的的的的的的的',
    account: '3',
    key_id: 'test_C',
  },
  {
    name: '風控警示',
    time: '14:10',
    label: '給給給給給給給給給給給給',
    account: '4',
    key_id: 'test_D',
  },
];

interface riskAlertScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'RiskAlertScreen'>;
}

const RiskAlertScreen: React.FC<riskAlertScreenProps> = ({navigation}) => {
  const [dataSource, setDataSource] = useState([]);

  const randomHexColor = () => {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
      finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
  };

  const showDateBase = (cases: any) => {
    navigation.push('RiskAlertInfoScrren', {keyProps: cases});
  };

  const dataList = (database: any) => {
    return database.map((obj: any) => {
      return (
        <TouchableOpacity
          style={styles.listBox}
          onPress={() => showDateBase(obj)}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', width: '85%'}}>
              <View
                style={{
                  backgroundColor: randomHexColor(),
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 10,
                }}>
                <Image source={require('../../../res/notice.png')} />
              </View>
              <View style={{marginLeft: 10, width: '100%'}}>
                <Text style={styles.listBoxTitleOther}>{obj.time}</Text>
                <Text
                  style={styles.listBoxTitleMain}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {obj.name}
                  {obj.name}
                </Text>
                <Text style={styles.listBoxTitleOther}>{obj.label}</Text>
              </View>
            </View>
            <View style={styles.listRedBox}>
              <View style={styles.textRedBox}>
                <Text style={styles.textRedBoxset}>99+</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <View>
            <BackButton
              title="警示通知"
              color="#4883CE"
              onPress={() => navigation.pop()}
            />
          </View>
        </View>
        <View style={styles.bodyBox}>
          <View>{dataList([])}</View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#758a9d',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
  },
  bodyBox: {
    flex: 8,
    backgroundColor: '#2B3F51B6',
    borderTopLeftRadius: 30,
    padding: 20,
  },
  listBox: {
    borderBottomColor: '#758B9E',
    borderBottomWidth: 1,
    paddingVertical: 10,
    height: 80,
  },
  listBoxImg: {
    backgroundColor: '#F6C12D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
  },
  listBoxTitleMain: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    width: '80%',
  },
  listBoxTitleOther: {
    color: '#FFFFFF79',
    fontSize: 13,
    fontWeight: '600',
    // marginTop: 8,
    // marginLeft: 8
  },
  listRedBox: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none',
  },
  textRedBox: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  textRedBoxset: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default RiskAlertScreen;
