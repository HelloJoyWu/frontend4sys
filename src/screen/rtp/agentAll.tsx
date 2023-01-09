import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  getMonthDate,
  SetAgentDropdown,
  getDayDate,
} from '../../components/agentNGamePicker';
import {AxiosContext} from '../../context/axiosContext';
import * as Progress from 'react-native-progress';
import {RefreshButton} from '../../components/refreshButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type changeIndexProp = {
  changeIndex: number;
  refreshTime: any;
  setRefreshTime: any;
  setShowMaskBox: (showMaskBox: boolean) => void;
};

const AgentAllScreen = ({
  changeIndex,
  refreshTime,
  setRefreshTime,
  setShowMaskBox,
}: changeIndexProp) => {
  const {authCq9Axios: authAxios} = useContext(AxiosContext);

  const [oneMonthAllDate, setOneMonthAllDate] = useState<any[]>([]);
  const [twoMonthAllDate, setTwoMonthAllDate] = useState<any[]>([]);
  const [threeMonthAllDate, setThreeMonthAllDate] = useState<any[]>([]);
  const [allMonthData, setAllMonthData] = useState<any[]>([]);

  const [oneMonth, setOneMonth] = useState<string>('');
  const [twoMonth, setTwoMonth] = useState<string>('');
  const [threeMonth, setThreeMonth] = useState<string>('');

  const [oneMonthLength, setOneMonthLength] = useState<number>(0);
  const [twoMonthLength, setTwoMonthLength] = useState<number>(0);
  const [threeMonthLength, setThreeMonthLength] = useState<number>(0);

  const [pickedOwner, setPickedOwner] = useState<any>();
  const [pickedParent, setPickedParent] = useState<any>();

  const [showValueDisplay, setShowValueDisplay] = useState<boolean>(false);
  const [sendBtnDis, setSendBtnDis] = useState<boolean>(false);

  const [allDate, setAllDate] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [clearTimeOutState, setClearTimeOutState] = useState<any>(); //10's
  const [clearTimeOutCancelBtn, setClearTimeOutCancelBtn] = useState<any>(); //1min
  const [clearOverTime, setClearOverTime] = useState<any>(); //2min

  const [showCancelBtn, setShowCancelBtn] = useState<boolean>(false);
  const [refreshBtnDis, setRefreshBtnDis] = useState<boolean>(false);

  const logoutTimer = useRef(false);

  const logoutTimeFn = () => {
    setSendBtnDis(false);
    setShowValueDisplay(false);
    setProgress(0);
    setShowProgress(false);
    setShowMaskBox(false);
  };

  const setAmount = async () => {
    //跳到畫面最底部
    setAllMonthData([]);
    setOneMonthAllDate([]);
    setTwoMonthAllDate([]);
    setThreeMonthAllDate([]);

    var params: {[k: string]: string | number} = {};

    if (pickedParent) {
      params.agent_type = 'parent';
      params.agent_id = pickedParent.value;
    } else if (pickedOwner) {
      params.agent_type = 'owner';
      params.agent_id = pickedOwner.value;
    } else {
      Alert.alert('Please enter parent or owner!');
      return;
    }

    setShowProgress(true);
    setShowMaskBox(true);

    setShowValueDisplay(false);
    setSendBtnDis(true);

    const ShowCancelBtn = setTimeout(() => {
      setShowCancelBtn(true);
    }, 60000);
    setClearTimeOutCancelBtn(ShowCancelBtn);

    const overTime = setTimeout(() => {
      logoutTimer.current = true;
      logoutTimeFn();
      Alert.alert('連線逾時');
      clearTimeout(clearTimeOutState);
      setClearTimeOutState('');
    }, 120000);
    setClearOverTime(overTime);

    logoutTimer.current = false;

    for (var i = 0; i < allDate.length; i++) {
      if (logoutTimer.current) {
        break;
      }

      const ConnectionLogoutTimer = setTimeout(() => {
        logoutTimer.current = true;
        logoutTimeFn();
        clearTimeout(clearOverTime);
        setClearOverTime('');
        Alert.alert('連線逾時');
      }, 10000);
      setClearTimeOutState(ConnectionLogoutTimer);

      try {
        await fetchDayLatest(params, allDate[i]);
      } catch (error: any) {
        clearTimeout(ConnectionLogoutTimer);
        Alert.alert(error.name, error.message);
        console.error(error.name, error.message);
        break;
      }
      clearTimeout(ConnectionLogoutTimer);
    }
    setShowCancelBtn(false);
    clearTimeout(ShowCancelBtn);
    clearTimeout(overTime);
  };

  const fetchDayLatest = async (params: any, date: any) => {
    await authAxios
      .get('api/v1/inquiry/agent/day/summary', {
        params: {
          agent_type: params.agent_type,
          agent_id: params.agent_id,
          from_time: date.from,
          to_time: date.to,
        },
      })
      .then((resp: any) => {
        const respMonth = resp.data[0].format_date.substring(5, 7);
        if (respMonth === oneMonth) {
          setOneMonthAllDate(oldArray => [...oldArray, resp.data[0]]);
        } else if (respMonth === twoMonth) {
          setTwoMonthAllDate(oldArray => [...oldArray, resp.data[0]]);
        } else if (respMonth === threeMonth) {
          setThreeMonthAllDate(oldArray => [...oldArray, resp.data[0]]);
        }
        setAllMonthData(oldArray => [...oldArray, resp.data[0]]);
        return;
      })
      .catch((error: any) => {
        logoutTimeFn();
        throw error;
      });
  };

  const getDifMonthRTP = (monthData: any, monthLength: number) => {
    if (monthData.length < monthLength && monthData.length > 0) {
      return null;
    }

    const rtp = getMonthRtp(monthData);
    if (showProgress) {
      if (allMonthData.length === allDate.length) {
        setTimeout(() => {
          setShowValueDisplay(true);
          setShowProgress(false);
          setShowMaskBox(false);
          setSendBtnDis(false);
        }, 500);
      }
    }
    return rtp;
  };

  useEffect(() => {
    logoutTimeFn();
    setPickedOwner('');
    setPickedParent('');
    logoutTimer.current = true;

    if (clearTimeOutState) {
      clearTimeout(clearTimeOutState);
      setClearTimeOutState('');
    }
    if (clearTimeOutCancelBtn) {
      clearTimeout(clearTimeOutCancelBtn);
      setClearTimeOutState('');
    }
    if (clearOverTime) {
      clearTimeout(clearOverTime);
      setClearOverTime('');
    }
  }, [changeIndex]); //prohibit add clearTimeOut

  useEffect(() => {
    if (allDate.length === 0) {
      return;
    }
    setProgress(allMonthData.length / allDate.length);
  }, [allMonthData, allDate]);

  useEffect(() => {
    if (showProgress) {
      return;
    }
    if (progress >= 1) {
      setProgress(0);
    }
  }, [progress, showProgress]);

  useEffect(() => {
    const allThreeMonthStr = getMonthDate();
    setOneMonth(allThreeMonthStr.oneMonth);
    setTwoMonth(allThreeMonthStr.twoMonth);
    setThreeMonth(allThreeMonthStr.threeMonth);
    setOneMonthLength(0);
    setTwoMonthLength(0);
    setThreeMonthLength(0);
    const allDateArray = getDayDate();
    setAllDate(allDateArray);
    for (let i = 0; i < allDateArray.length; i++) {
      const monthStr = allDateArray[i].from.substring(5, 7);
      if (monthStr === allThreeMonthStr.oneMonth) {
        setOneMonthLength(prev => prev + 1);
      } else if (monthStr === allThreeMonthStr.twoMonth) {
        setTwoMonthLength(prev => prev + 1);
      } else if (monthStr === allThreeMonthStr.threeMonth) {
        setThreeMonthLength(prev => prev + 1);
      }
    }
  }, []);

  const getMonthRtp = (database: any) => {
    let netWinTot = 0;
    let betTot = 0;
    for (var i = 0; i < database.length; i++) {
      netWinTot += database[i].net_win;
      betTot += database[i].bet;
    }
    const rtp: number = parseFloat(((1 - netWinTot / betTot) * 100).toFixed(2));
    let rtpStr = '';
    if (rtp > 0) {
      rtpStr = rtp.toString() + '%';
    } else if (betTot === 0) {
      rtpStr = '無資料';
    } else {
      rtpStr = '0%';
    }
    return rtpStr;
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.bodyBox}>
          <View style={{zIndex: 1, width: '85%'}}>
            {SetAgentDropdown(
              pickedOwner,
              pickedParent,
              setPickedOwner,
              setPickedParent,
              refreshTime,
            )}
            <TouchableOpacity
              onPress={() => setAmount()}
              style={{width: '100%'}}
              disabled={sendBtnDis}>
              <View style={styles.sendBtnBox}>
                <Text style={styles.sendBtnText}>送出</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '85%',
              display: showValueDisplay ? 'flex' : 'none',
            }}>
            <View style={styles.resultView}>
              <View style={styles.lineBox} />
              <Text style={{color: '#FFFFFFA2'}}>近3個月</Text>
              <View style={styles.lineBox} />
            </View>

            <View style={styles.answerBox}>
              <Text style={styles.answerTitle}>{oneMonth}月整體</Text>
              <Text style={styles.answerText}>
                {getDifMonthRTP(oneMonthAllDate, oneMonthLength)}
              </Text>
            </View>
            <View style={styles.answerBox}>
              <Text style={styles.answerTitle}>{twoMonth}月整體</Text>
              <Text style={styles.answerText}>
                {getDifMonthRTP(twoMonthAllDate, twoMonthLength)}
              </Text>
            </View>
            <View style={styles.answerBox}>
              <Text style={styles.answerTitle}>{threeMonth}月整體</Text>
              <Text style={styles.answerText}>
                {getDifMonthRTP(threeMonthAllDate, threeMonthLength)}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View>
        {RefreshButton(
          authAxios,
          setRefreshTime,
          setRefreshBtnDis,
          refreshBtnDis,
        )}
      </View>
      <View
        style={[styles.maskView, {display: showProgress ? 'flex' : 'none'}]}>
        <View
          style={{
            display: showProgress ? 'flex' : 'none',
            position: 'absolute',
            top: '30%',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Progress.Bar
            progress={progress}
            width={Dimensions.get('window').width * 0.75}
            height={20}
            color={'#CBE7FF'}
            borderColor={'#CBE7FF'}
          />
          <View
            style={{
              marginTop: 50,
              alignItems: 'center',
              display: showCancelBtn ? 'flex' : 'none',
            }}>
            <Text style={styles.font1}>是否繼續等待?</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.cancelBtnBox}
                onPress={() => {
                  logoutTimeFn();
                  logoutTimer.current = true;
                  clearTimeout(clearTimeOutState);
                  setClearTimeOutState('');
                  clearTimeout(clearOverTime);
                  setClearOverTime('');
                }}>
                <Text style={styles.font2}>否</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtnBox}
                onPress={() => {
                  setShowCancelBtn(false);
                }}>
                <Text style={styles.font2}>是</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyBox: {
    flex: 8,
    // paddingHorizontal: 25,
    alignItems: 'center',
  },
  sendBtnBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#CBE7FF',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 8,
  },
  sendBtnText: {
    color: '#2B3F51',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  lineBox: {
    height: 1,
    width: '40%',
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF71',
  },
  answerBox: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4D5B75',
    alignItems: 'center',
  },
  answerTitle: {
    color: '#CBE7FF',
    fontSize: 20,
    fontWeight: '600',
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  maskView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#1D1D1DB2',
    zIndex: 1,
  },
  resultView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cancelBtnBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 30,
    marginHorizontal: 10,
  },
  font1: {
    color: '#CBE7FF',
    fontSize: 17,
    fontWeight: '700',
    marginVertical: 5,
  },
  font2: {color: '#FFFFFF', fontSize: 17, fontWeight: '700'},
});
export default AgentAllScreen;
