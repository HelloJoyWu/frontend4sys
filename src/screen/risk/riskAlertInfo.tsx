import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import * as StorageHelper from '../../utils/storageHelper';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosContext} from '../../context/axiosContext';

interface riskAlertInfoScrrenProps {
  navigation: StackNavigationProp<RootStackParamList, 'RiskAlertInfoScrren'>;
  route: RouteProp<RootStackParamList, 'RiskAlertInfoScrren'>;
}

const testData: Array<object> = [
  {account: 'player_0', alert_time: '2022-02-09 08:28:05', win: 25},
  {account: 'player_1', alert_time: '2022-02-09 12:12:32', win: 55},
  {account: 'player_2', alert_time: '2022-02-09 14:35:55', win: 78},
];

const RiskAlertInfoScrren: React.FC<riskAlertInfoScrrenProps> = ({
  route,
  navigation,
}) => {
  const keyProps: any = route.params.keyProps || ' ';

  useFocusEffect(
    useCallback(() => {
      getLeaveTime();
      return () => {
        const nowTime = new Date();

        console.log(navigation.isFocused());

        StorageHelper.storeLeaveTime({
          screenName: keyProps.key_id,
          leaveTime: nowTime.toString(),
        });
      };
    }, []),
  );

  const copyToClipboard = (text: string) => {
    console.log('here here here copy', text);
    Clipboard.setString(text);
  };

  const getLeaveTime = async () => {
    const leaveTimeData = await StorageHelper.getLeaveTime(keyProps.key_id);
    console.log('從資料庫裡獲取的時間', leaveTimeData);
  };

  const [dataSource, setDataSource] = useState<object[]>([]);

  const dataLastBox = (database: any) => {
    return (
      <View style={styles.showDataBox}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.obviousText}>{database.alert_time}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => copyToClipboard(database.account)}>
              <Image
                source={require('../../../res/riskBtnCopy.png')}
                style={{marginHorizontal: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../../res/riskBtnBack.png')}
                style={{marginHorizontal: 5}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>{dataBaseInfoList(database)}</View>
      </View>
    );
  };

  const dataBaseInfoList = (datainfo: []) => {
    const newArray: any[] = [];

    for (var name in datainfo) {
      if (name !== 'alert_time') {
        newArray.push(name + ':' + datainfo[name]);
      }
    }

    return newArray.map(obj => {
      return <Text style={styles.contentText}>{obj}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <BackButton
            title={keyProps.CName}
            color={'#4883CE'}
            onPress={() => {
              navigation.pop();
            }}
          />
        </View>
        <View style={styles.bodyBox}>
          <ScrollView>{dataSource.map(obj => obj)}</ScrollView>
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
  },
  databaseBox: {
    flexDirection: 'column-reverse',
  },
  showDataBox: {
    margin: 10,
    backgroundColor: '#2B3F51B6',
    borderRadius: 30,
    padding: 15,
  },
  obviousText: {
    color: '#FFC10B',
    fontSize: 18,
    fontWeight: '600',
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    margin: 3,
  },
});

export default RiskAlertInfoScrren;
