import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import HamburgerButton from '../../components/hamburgerButton';
import BackButton from '../../components/backButton';
import {format} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import {AxiosContext} from '../../context/axiosContext';
import * as StorageHelper from '../../utils/storageHelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RefreshButton} from '../../components/refreshButton';
import {loadView} from '../../components/loadImage';

interface hedgeInquireScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'HedgeInquireScreen'>;
  route: RouteProp<RootStackParamList, 'HedgeInquireScreen'>;
  setRefreshTime: any;
}

const GameTypeScreen: React.FC<hedgeInquireScreenProps> = ({navigation}) => {
  const {authCq9Axios: authAxios} = useContext(AxiosContext);
  const [hedgeData, setHedgeData] = useState<any[]>([]);
  const [showHedgeData, setShowHedgeData] = useState<boolean>(false);
  const [parentArray, setParentArray] = useState<any[]>([]);
  const [parentName, setParentName] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [timeZoneValue, setTimeZoneValue] = useState<any>();
  const [refreshBtnDis, setRefreshBtnDis] = useState<boolean>(false);
  const [refreshTime, setRefreshTime] = useState<Date>();
  const [showLoad, setShowLoad] = useState<boolean>(false);

  const selectItems: any = [
    {value: 8, label: 'UTC  +8'},
    {value: 0, label: 'UTC  +0'},
  ];

  const loadItems = () => {
    setParentArray(StorageHelper.getParentList());
  };

  useEffect(() => {
    console.log('load parent');
    loadItems();
  }, [refreshTime]);

  const fetchLatest = async (params: any) => {
    await authAxios
      .get('api/v1/inquiry/player/hedge/info', {
        params: {
          agent_type: 'parent',
          agent_id: params.agent_id,
          player_account: params.player_account,
          check_time: params.check_time,
          timezone: params.timezone,
        },
      })
      .then(resp => {
        setHedgeData(resp.data);
        setShowHedgeData(true);
        return;
      })
      .catch(error => {
        Alert.alert(error.name, error.message);
      });
    setShowLoad(false);
  };

  const createTextInput = (
    showText: string,
    placeholderText: string,
    resultText: string,
    changeText: (changetext: string) => void,
  ) => {
    return (
      <View style={styles.electiveView}>
        <Text style={styles.font2}>{showText}</Text>
        <View style={styles.electiveBox}>
          <TextInput
            style={styles.inputBox}
            onChangeText={text => changeText(text)}
            value={resultText}
            placeholder={placeholderText}
            placeholderTextColor="#626262"
          />
          <Pressable
            onPress={() => {
              changeText('');
            }}>
            <Image
              source={require('../../../res/picture/close.png')}
              style={styles.image1}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderItem = (item: any, selecded: any) => {
    return (
      <View
        style={[
          styles.selectItem,
          {backgroundColor: selecded ? '#CBE7FF' : '#1A1C2E'},
        ]}>
        <Text style={[styles.font1, {color: selecded ? '#1A1C2E' : '#FFFFFF'}]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const createDropdown = () => {
    return (
      <View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.font5}
          selectedTextStyle={styles.font4}
          containerStyle={styles.containerStyle}
          activeColor={'#1A1C2E'}
          data={selectItems}
          labelField="label"
          valueField="value"
          value={timeZoneValue}
          placeholder="選擇時區"
          onChange={item => {
            setTimeZoneValue(item);
          }}
          renderItem={renderItem}
          renderRightIcon={() => (
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={{marginHorizontal: 2}}
                onPress={() => {
                  setTimeZoneValue('');
                }}>
                <Image
                  source={require('../../../res/picture/close.png')}
                  style={styles.image1}
                />
              </Pressable>
              <View style={{marginHorizontal: 2}}>
                <Image
                  source={require('../../../res/picture/arrow.png')}
                  style={styles.image2}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  const createDateSelect = () => {
    return (
      <View style={[styles.maskBox, {display: openDate ? 'flex' : 'none'}]}>
        <View style={styles.dateSelectFrameBox}>
          <View style={{width: '100%', height: '90%', alignItems: 'center'}}>
            <Text style={styles.font6}>選擇日期</Text>
            <DateTimePicker
              value={selectDate}
              style={{width: '90%', height: '91%'}}
              themeVariant="dark"
              display="inline"
              locale={'zh'}
              mode="date"
              onChange={(_: any, date?: any) => setSelectDate(date)}
            />
          </View>
          <View style={styles.dateSelectBtnBox}>
            <Pressable
              onPress={() => {
                setSelectDate(new Date());
              }}
              style={styles.dateSelectBtn}>
              <Text style={styles.font7}>回到今天</Text>
            </Pressable>
            <View style={styles.independentLine} />
            <Pressable
              onPress={() => {
                setOpenDate(false);
                setDateStr(format(selectDate, 'yyyy-MM-dd'));
              }}
              style={styles.dateSelectBtn}>
              <Text style={styles.font7}>確認</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const createDateBox = () => {
    return (
      <View style={[styles.electiveBox, {justifyContent: 'space-between'}]}>
        <View style={styles.showTextElectiveBox}>
          {dateStr ? (
            <Text style={styles.font4}>{dateStr}</Text>
          ) : (
            <Text style={styles.font5}>選擇日期</Text>
          )}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={{marginHorizontal: 2}}
            onPress={() => {
              setDateStr('');
            }}>
            <Image
              source={require('../../../res/picture/close.png')}
              style={styles.image1}
            />
          </Pressable>
          <Pressable
            style={{marginHorizontal: 2}}
            onPress={() => {
              setOpenDate(true);
            }}>
            <Image
              source={require('../../../res/picture/arrow.png')}
              style={styles.image2}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const checkInputData = () => {
    if (parentName.length <= 0) {
      Alert.alert('請輸入子代');
      return;
    }
    if (playerName.length <= 0) {
      Alert.alert('請輸入會員帳號');
      return;
    }
    if (dateStr.length <= 0) {
      Alert.alert('請選擇日期');
      return;
    }
    if (timeZoneValue.value < 0) {
      Alert.alert('請選擇時區');
      return;
    }

    const index = parentArray.findIndex(item => item.label === parentName);
    if (index < 0) {
      Alert.alert('請確認子代是否輸入正確');
      return;
    }
    const pid = parentArray[index].value;
    const params: {[k: string]: string | number} = {
      agent_id: pid,
      player_account: playerName,
      check_time: dateStr,
      timezone: timeZoneValue.value,
    };
    console.log('params', params);
    setShowLoad(true);
    fetchLatest(params);
  };

  const createResult = (database: any[]) => {
    if (database.length <= 0) {
      return (
        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
          <Image
            source={require('../../../res/picture/exclamation_pink.png')}
            style={styles.image3}
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.font10}>近七天</Text>
            <Text style={styles.font11}>無對打嫌疑</Text>
          </View>
        </View>
      );
    }
    // console.log(database);

    return database.map((data: any, index: number) => {
      return (
        <View key={'result_' + index} style={styles.resultBox}>
          <View style={styles.resultBox_date}>
            <Text style={styles.font12}>{data.date}</Text>
          </View>
          <View style={styles.resultBox_info}>
            <View style={styles.resultBox_info_up}>
              <View style={styles.resultBox_info_mid}>
                <Text style={styles.font9}>對打玩家數</Text>
                <Text style={styles.font9}>{data.hedge_players}</Text>
              </View>
              <View style={{backgroundColor: '#CBE7FF', width: 2}} />
              <View style={styles.resultBox_info_mid}>
                <Text style={styles.font9}>對打場次數</Text>
                <Text style={styles.font9}>{data.hedge_times}</Text>
              </View>
            </View>
            <View style={styles.resultBox_info_down}>
              <Text style={styles.font9}>玩家當日損益</Text>
              <Text style={styles.font9}>{data.net_win}</Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          {LogoutTimer('other')}
          <BackButton
            title={'RTP查詢'}
            color={'#E9898C'}
            onPress={() => navigation.pop()}
          />
          <HamburgerButton
            onPress={() => navigation.navigate('SettingScreen')}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 5,
          }}
        />
        <View style={styles.bodyBox}>
          <View style={styles.bodyBoxBackground} />
          <View
            style={{
              marginTop: '10%',
            }}>
            <View style={{height: '100%'}}>
              <KeyboardAwareScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}>
                <View style={{alignItems: 'center'}}>
                  <View style={{width: '90%', alignItems: 'center'}}>
                    <Text style={styles.font3}>查詢會員對沖</Text>
                    {createTextInput(
                      '請輸入子代',
                      'parent_name',
                      parentName,
                      setParentName,
                    )}
                    {createTextInput(
                      '請輸入會員帳號',
                      'player_account',
                      playerName,
                      setPlayerName,
                    )}
                    <View style={styles.electiveView}>
                      <Text style={styles.font2}>請選擇日期</Text>
                      {createDateBox()}
                    </View>
                    <View style={styles.electiveView}>
                      <Text style={styles.font2}>請選擇時區</Text>
                      {createDropdown()}
                    </View>
                    <Pressable
                      style={styles.sendButton}
                      onPress={() => {
                        setShowHedgeData(false);
                        checkInputData();
                      }}>
                      <Text style={styles.font8}>送出</Text>
                    </Pressable>
                  </View>
                </View>

                <View
                  style={{
                    padding: '5%',
                    display: showHedgeData ? 'flex' : 'none',
                  }}>
                  {createResult(hedgeData)}
                </View>
              </KeyboardAwareScrollView>
              <View
                style={{
                  height: '10%',
                  justifyContent: 'flex-end',
                }}>
                {RefreshButton(
                  authAxios,
                  setRefreshTime,
                  setRefreshBtnDis,
                  refreshBtnDis,
                )}
              </View>
            </View>
          </View>
        </View>
        {createDateSelect()}
        {ExtensionTime()}
        {loadView(showLoad)}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#415d97',
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
  bodyBoxBackground: {
    position: 'absolute',
    backgroundColor: '#102243',
    bottom: 0,
    borderTopLeftRadius: 38,
    height: '96%',
    width: '100%',
  },
  maskBox: {
    backgroundColor: '#1D1D1DB2',
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  electiveView: {width: '100%', marginVertical: 5},
  electiveBox: {
    flexDirection: 'row',
    width: '100%',
    height: 43,
    borderColor: '#CBE7FF',
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  inputBox: {
    width: '93%',
    color: '#CBE7FF',
    fontSize: 16,
    fontWeight: '700',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  showTextElectiveBox: {
    width: '80%',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  dropdown: {
    height: 43,
    borderColor: '#CBE7FF',
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#CBE7FF',
    padding: 5,
  },
  selectItem: {
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  dateSelectFrameBox: {
    backgroundColor: '#071631',
    width: 352,
    height: '45%',
    borderColor: '#CBE7FF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 7,
  },
  dateSelectBtnBox: {
    flexDirection: 'row',
    width: '90%',
    height: '10%',
    justifyContent: 'space-around',
    borderTopColor: '#CBE7FF',
    borderTopWidth: 1,
    paddingTop: 3,
  },
  dateSelectBtn: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  independentLine: {
    backgroundColor: '#CBE7FF',
    width: 1,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: '#CBE7FF',
    borderRadius: 10,
    height: 43,
    width: '100%',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 10,
  },
  resultBox_date: {
    backgroundColor: '#E9898C',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  resultBox_info: {
    borderTopWidth: 0,
    borderColor: '#CBE7FF',
    borderWidth: 2,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 10,
  },
  resultBox_info_up: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultBox_info_mid: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 10,
  },
  resultBox_info_down: {
    flexDirection: 'row',
    borderTopColor: '#CBE7FF',
    borderTopWidth: 2,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 10,
  },

  font1: {width: '100%', fontSize: 17, textAlign: 'center', fontWeight: '600'},
  font2: {color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 10},
  font3: {color: '#FFD9DA', fontSize: 20, fontWeight: '700'},
  font4: {color: '#CBE7FF', fontSize: 16, fontWeight: '700'},
  font5: {color: '#626262', fontSize: 16, fontWeight: '700'},
  font6: {color: '#E9898C', fontSize: 20, fontWeight: '700', width: '90%'},
  font7: {color: '#CBE7FF', fontSize: 20, fontWeight: '700'},
  font8: {color: '#2B3F51', fontSize: 20, fontWeight: '700'},
  font9: {color: '#CBE7FF', fontSize: 15, fontWeight: '700'},
  font10: {color: '#FFFFFF', fontSize: 25, fontWeight: '700'},
  font11: {color: '#E9898C', fontSize: 25, fontWeight: '700'},
  font12: {color: '#072357', fontSize: 16, fontWeight: '700'},

  image1: {width: 15, height: 15, resizeMode: 'contain'},
  image2: {width: 16.14, height: 12.92, resizeMode: 'contain'},
  image3: {width: 55, height: 55, margin: 10},
});

export default GameTypeScreen;
