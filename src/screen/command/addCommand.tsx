import React, {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import locationData from './database.json';
import {Dropdown} from 'react-native-element-dropdown';
import {format} from 'date-fns';
import {AxiosContext} from '../../context/axiosContext';
import * as commonApi from './commonAPI';
import * as StorageHelper from '../../utils/storageHelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loadView} from '../../components/loadImage';
import {ShowTaskidResult} from '../../components/returnTaskid';
import Tooltip from 'rn-tooltip';
import Clipboard from '@react-native-clipboard/clipboard';
import {RefreshButton} from '../../components/refreshButton';

type AddCommandScreenProp = {
  setCheckCount: Dispatch<SetStateAction<number>>;
  setShowMaskBox: (showMaskBox: boolean) => void;
};

const AddCommandScreen = ({
  setCheckCount,
  setShowMaskBox,
}: AddCommandScreenProp) => {
  const {authCq9Axios: authAxios} = useContext(AxiosContext);
  const [ownerArray, setOwnerArray] = useState<any>([]);
  const [parentArray, setParentArray] = useState<any>([]);
  const [gameCodeArray, setGameCodeArray] = useState<any>([]);

  const [sendData, setSendData] = useState<object>();
  const [showMessage, setShowMessage] = useState<any[]>([]);

  const [storeTaskid, setStoreTaskid] = useState<string>(''); //show view
  const [showLoad, setShowLoad] = useState<boolean>(false);

  const [storeError, setStoreError] = useState<string>('');

  const [showUserSSID, setShowUserSSID] = useState<any>('');
  const [showParentBlack, setShowParentBlack] = useState<any>('');
  const [refreshTime, setRefreshTime] = useState<Date>();

  useEffect(() => {
    getStorageItem();
  }, [refreshTime]);

  const getStorageItem = () => {
    const owner_list = StorageHelper.getOwnerList();
    const parent_list = StorageHelper.getParentList();
    const gameCode_list = StorageHelper.getGameCodeList();

    setOwnerArray(owner_list);
    setParentArray(parent_list);
    setGameCodeArray(gameCode_list);
  };

  const selectFN: any[] = [
    {
      label: '剔出單一玩家 logout_one',
      value: 'logout_one',
      cnLable: '剔出單一玩家',
    },
    {
      label: '剔除遊戲所有玩家 logout_all_by_game',
      value: 'logout_all_by_game',
      cnLable: '剔除遊戲所有玩家',
    },
    {
      label: '設定玩家凍結狀態 frozen',
      value: 'frozen',
      cnLable: '設定玩家凍結狀態',
    },
    {
      label: '設定玩家開啟狀態 defrozen',
      value: 'defrozen',
      cnLable: '設定玩家開啟狀態',
    },
    {label: '設定玩家RTP set_rtp', value: 'set_rtp', cnLable: '設定玩家RTP'},
    {
      label: '設定代理玩家RTP 96% set_parent_rtp',
      value: 'reset_parent_user_rtp',
      cnLable: '設定代理玩家RTP 96%',
    },
    {
      label: '代理新增黑名單 set_parent_blacks',
      value: 'set_parent_blacks',
      cnLable: '代理新增黑名單',
    },
    {
      label: '代理移除黑名單 rm_parent_blacks',
      value: 'rm_parent_blacks',
      cnLable: '代理移除黑名單',
    },
    {
      label: '代理查詢黑名單 get_parent_blacks',
      value: 'get_parent_blacks',
      cnLable: '代理查詢黑名單',
    },
    {
      label: '查詢玩家資訊 user_ssid',
      value: 'user_ssid',
      cnLable: '查詢玩家資訊',
    },
  ];

  const [showTitle, setShowTitle] = useState<String>(''); //儲存顯示在上方 已選擇指令標題
  const [pickedFN, setPickedFN] = useState<any>({label: '', value: ''}); //儲存已選擇指令

  const [selectMode, setSelectMode] = useState<any>([]); //儲存所有指令格式選項
  const [pickedMode, setPickedMode] = useState<any>(); //儲存選中的指令格式選項

  const [nowTime, setNowTime] = useState<String>(''); //儲存送出資料時顯示的時間

  const [showEXText, setShowEXText] = useState<String>(''); //儲存選擇的指令範例

  const [showInputArray, setShowInputArray] = useState<any[]>([]);

  //set area displayer
  const [modeDisplay, setModeDisplay] = useState<boolean>(false);
  const [datalistDisplay, setDatalistDisplay] = useState<boolean>(false);
  const [exTextDisplay, setEXTextDisplay] = useState<boolean>(false);
  const [sendBtnDisplay, setSendBtnDisplay] = useState<boolean>(false);
  const [sendMessageDisplay, setSendMessageDisplay] = useState<boolean>(false);

  //set select item
  const [selectOwner, setSelectOwner] = useState<any>(); //儲存選中的owner
  const [selectParent, setSelectParent] = useState<any>(); //儲存選中的parent
  const [selectGameCode, setSelectGameCode] = useState<any>(); //儲存選中的gameCode

  //set input text
  const [playerSSIDText, setPlayerSSIDText] = useState<string>('');
  const [playerAccountText, setPlayerAccuntText] = useState<string>('');
  const [rtpText, setRTPText] = useState<string>('');

  const [refreshBtnDis, setRefreshBtnDis] = useState<boolean>(false);

  const CorrespondingContent: any = {
    playerSSID: ['請輸入playerSSID', playerSSIDText, setPlayerSSIDText],
    player_account: ['請輸入會員帳號', playerAccountText, setPlayerAccuntText],
    rtp: ['請輸入RTP', rtpText, setRTPText],
  };

  const sendBtnFN = () => {
    // setSendInformation(showMessage);
    setSendMessageDisplay(true);
    setShowMaskBox(true);
  };

  const nameCorrespondInpute = () => {
    //送出結果後再一次顯示選填資料的部分
    const fnLabel = 'fn :' + pickedFN.label;
    const fnValue = pickedFN.value;
    const inputeTextArray: any = [fnLabel]; //show view
    //send api 物件裡的名稱與api一致
    var sendMessage: {[k: string]: string | any} = {fn: fnValue};

    //用來判斷使用者選擇指令應該顯示的文字訊息
    for (var i = 0; i < showInputArray.length; i++) {
      if (showInputArray[i] === 'playerSSID') {
        if (playerSSIDText.length <= 0) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請輸入playerSSID');
          return;
        }
        inputeTextArray.push('playerSSID :' + playerSSIDText);
        sendMessage.agent_type = 'playerSSID';
        sendMessage.playerSSID = playerSSIDText;
      } else if (showInputArray[i] === 'owner_name') {
        if (!selectOwner) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請選擇總代');
          return;
        }
        inputeTextArray.push('owner :' + selectOwner.label);
        sendMessage.agent_type = 'owner';
        sendMessage.agent_id = selectOwner.value;
      } else if (showInputArray[i] === 'player_account') {
        if (playerAccountText.length <= 0) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請輸入會員帳號');
          return;
        }
        inputeTextArray.push('account :' + playerAccountText);
        sendMessage.player_account = playerAccountText;
      } else if (showInputArray[i] === 'parent_name') {
        if (!selectParent) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請選擇子代');
          return;
        }
        inputeTextArray.push('parent :' + selectParent.label);
        sendMessage.agent_type = 'parent';
        sendMessage.agent_id = selectParent.value;
      } else if (showInputArray[i] === 'game_code') {
        if (!selectGameCode) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請選擇GameCode');
          return;
        }
        inputeTextArray.push('gameCode :' + selectGameCode.label);
        sendMessage.gamecode = selectGameCode.value;
      } else if (showInputArray[i] === 'rtp') {
        if (rtpText.length <= 0) {
          setSendMessageDisplay(false);
          setShowMaskBox(false);
          Alert.alert('請輸入RTP');
          return;
        }
        inputeTextArray.push('rtp :' + rtpText + '%');
        sendMessage.rtp = rtpText;
      }
    }

    console.log('testMessage', sendMessage);

    setSendData(sendMessage);
    setShowMessage(inputeTextArray);
  };

  const createFuzzySearch = (
    items: any,
    selectItem: any,
    changeFN: any,
    placeholderText: string,
    text: string,
  ) => {
    return (
      <View>
        <Text style={styles.titleText}>{text}</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.containerStyle}
          inputSearchStyle={styles.selectedTextStyle}
          activeColor={'#1A1C2E'}
          data={items}
          // dropdownPosition={'top'} //判斷鍵盤是否彈出+輸入框位置
          labelField="label"
          valueField="value"
          renderRightIcon={() => (
            <Image source={require('../../../res/btn/selectArrow.png')} />
          )}
          search
          searchPlaceholder={'請輸入關鍵字'}
          value={selectItem}
          placeholder={placeholderText}
          autoScroll={false}
          onChange={item => {
            if (placeholderText !== 'game_code') {
              clearAllText();
            }
            changeFN(item);
          }}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const fnPlayerSSID = (data: any) => {
    return data.map((obj: any, index: number) => {
      if (obj === 'owner_name') {
        return createFuzzySearch(
          ownerArray,
          selectOwner,
          setSelectOwner,
          'owner_name',
          '請選擇總代',
        );
      }
      if (obj === 'parent_name') {
        return createFuzzySearch(
          parentArray,
          selectParent,
          setSelectParent,
          'parent_name',
          '請選擇子代',
        );
      }
      if (obj === 'game_code') {
        return createFuzzySearch(
          gameCodeArray,
          selectGameCode,
          setSelectGameCode,
          'game_code',
          '請選擇遊戲代號',
        );
      }
      const keyboardType = obj === 'rtp' ? 'numeric' : 'default';
      return (
        <View key={'fnPlayerSSID_' + index}>
          <Text style={[styles.titleText, {marginTop: 5}]}>
            {CorrespondingContent[obj][0]}
          </Text>
          <View
            style={[styles.dropdown, {width: '100%', flexDirection: 'row'}]}>
            <TextInput
              style={[styles.placeholderStyle, {padding: 7, width: '93%'}]}
              value={CorrespondingContent[obj][1]}
              placeholder={obj}
              onChangeText={CorrespondingContent[obj][2]}
              placeholderTextColor="#6F7485"
              // keyboardType="numeric"
              keyboardType={keyboardType}
            />
            <TouchableOpacity
              style={styles.playerSSIDColseBtn}
              onPress={() => {
                CorrespondingContent[obj][2]('');
              }}>
              <Image
                source={require('../../../res/picture/close.png')}
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  const changeFNOption = (data: any) => {
    if (!data) {
      setPickedFN(selectFN[0]);
    } else {
      setPickedFN(data);
    }

    setSendBtnDisplay(false);
    setDatalistDisplay(false);
    setPickedMode(null);
  };

  const clearAllText = () => {
    setSelectOwner('');
    setSelectParent('');
    setSelectGameCode('');

    setPlayerAccuntText('');
    setPlayerSSIDText('');
    setRTPText('');
  };

  const showMessageText = (showMessageArray: any[]) => {
    return showMessageArray.map((obj: any, index: number) => {
      return (
        <View key={'showMessageText_' + index}>
          <Text style={styles.font8}>{obj}</Text>
        </View>
      );
    });
  };

  const setMessage = (btn: boolean) => {
    if (btn) {
      clearAllText();
      console.log('sendData', sendData);
      setShowLoad(true);
      setShowMaskBox(true);

      commonApi.setApi(
        authAxios,
        sendData,
        setStoreTaskid,
        setShowUserSSID,
        setShowLoad,
        setShowMaskBox,
      );
    }
    setSendMessageDisplay(false);
  };

  const renderItem = (item: any, selecded: any) => {
    return (
      <View
        style={[
          styles.item,
          {backgroundColor: selecded ? '#CBE7FF' : '#1A1C2E'},
        ]}>
        <Text
          style={[styles.textItem, {color: selecded ? '#1A1C2E' : '#FFFFFF'}]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const createShowRenderView = (userData: any) => {
    if (!userData) {
      return null;
    }
    return (
      <View style={[styles.blacksPlistBoxBg]}>
        <View style={styles.infoDataBox}>
          <View style={{height: '95%', width: '100%', paddingTop: 10}}>
            <Text style={styles.font1}>玩家資訊</Text>
            <View style={styles.showPlayerData}>
              <Text style={styles.font2}>玩家帳號：</Text>
              <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: '700'}}>
                {userData.accounts}
              </Text>
            </View>
            <View style={styles.showPlayerData}>
              <Text style={styles.font2}>註冊日期(UTC+0)：</Text>
              <Text style={styles.font2}>{userData.registered_date}</Text>
            </View>
            <View style={styles.showPlayerData}>
              <Text style={styles.font2}>玩家ID：</Text>
              <Text style={styles.font2}>{userData.uid}</Text>
            </View>
            <View
              style={{
                width: '100%',
                borderRadius: 10,
                borderColor: '#FFFFFF',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 1,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <Text style={[styles.font2]}>玩家SSID</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  {
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '700',
                  },
                ]}>
                {userData.user_ssid}
              </Text>
              <TouchableOpacity
                style={{position: 'absolute', right: 0, top: 0}}
                onPress={() => {
                  Clipboard.setString(userData.user_ssid);
                }}>
                <Image
                  source={require('../../../res/picture/copy.png')}
                  style={{width: 15.75, height: 18, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{position: 'absolute', bottom: 10}}
            onPress={() => {
              setShowUserSSID('');
            }}>
            <Image
              source={require('../../../res/picture/circleClose.png')}
              style={styles.image2}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const sortArray = (array: any[]) => {
    //先將數字跟字串分開
    const stringArray: any[] = [];
    const numberArray: any[] = [];
    for (var i = 0; i < array.length; i++) {
      if (isNaN(Number(array[i]))) {
        stringArray.push(array[i]);
      } else {
        numberArray.push(Number(array[i]));
      }
    }
    const newNumberArray = numberArray.sort(function (a, b) {
      return a - b;
    });
    const newStringArray = stringArray.sort();
    return newNumberArray.concat(newStringArray);
  };

  const createShowGameCode = (gameCodes: string[]) => {
    return gameCodes.map((gameCode: string, index: number) => {
      return (
        <View style={styles.showTooltopBox}>
          <Tooltip
            popover={<Text style={styles.font9}>{gameCode}</Text>}
            actionType={'press'}
            height={40}
            width={100}>
            <Text style={styles.font10} numberOfLines={1}>
              {gameCode}
            </Text>
          </Tooltip>
        </View>
      );
    });
  };

  const createShowParentBlack = (parentBlack: any) => {
    if (!parentBlack) {
      return null;
    }
    setShowMaskBox(true);

    return (
      <View style={styles.blacksPlistBoxBg}>
        <View style={styles.blacksPlistDataBox}>
          <View style={{height: '90%'}}>
            <View style={{marginBottom: 5}}>
              <Text style={styles.font12}>
                Gamehall：{parentBlack.gamehall}
              </Text>
            </View>
            {parentBlack.gamecode.length > 0 ? (
              <ScrollView>
                <View style={styles.showGameCodeBox}>
                  <View style={{width: '100%', height: 1}} />
                  {createShowGameCode(sortArray(parentBlack.gamecode))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.showNoGameCodeBox}>
                <Image
                  source={require('../../../res/picture/exclamation.png')}
                  style={styles.image3}
                />
                <Text style={styles.font11}>無黑名單</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={{
              height: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setShowParentBlack('');
              setShowMaskBox(false);
            }}>
            <Image
              source={require('../../../res/picture/circleClose.png')}
              style={styles.image2}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const createError = (error: any) => {
    if (error.length <= 0) {
      return null;
    }
    return (
      <View style={styles.errorBox}>
        <TouchableOpacity
          onPress={() => {
            setStoreError('');
          }}>
          <Image
            source={require('../../../res/picture/close.png')}
            style={{
              width: 15,
              height: 15,
              marginRight: 5,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={styles.font3}>{error}</Text>
        </View>
      </View>
    );
  };

  const changepickedFNSelect = (item: any) => {
    changeFNOption(item);
    setShowTitle(item.cnLable);

    const allData: any = locationData;
    const checked: any = item.value;
    const showText: any = allData[checked].ex;

    setShowEXText(showText);

    const options: any = allData[checked].data;

    if (!options) {
      return;
    }
    const newArray: any = [];

    for (var i = 0; i < options.length; i++) {
      for (var name in options[i]) {
        newArray.push({label: name, value: name, index: i});
      }
    }
    setSelectMode(newArray);
    if (newArray.length <= 0) {
      setModeDisplay(false);
      setSendBtnDisplay(true);
      setDatalistDisplay(true);
      setPickedMode(newArray[0]);
    } else {
      setModeDisplay(true);
      setSendBtnDisplay(false);
      setDatalistDisplay(false);
    }

    setEXTextDisplay(true);
  };

  const changepickedModeSelect = (item: any) => {
    setPickedMode(item);

    const allData: any = locationData;
    const checked = pickedFN?.value;

    //Which items must be filled in when judging sending
    const options = allData[checked].data;
    const modepicked = item.index;
    const option = options[modepicked];

    for (var name in option) {
      setShowInputArray(option[name]);
    }

    if (item) {
      setSendBtnDisplay(true);
      setDatalistDisplay(true);
    }
  };

  const createDropdown = (
    items: any,
    selectItem: any,
    changeFN: any,
    placeholderText: string,
  ) => {
    return (
      <View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.containerStyle}
          activeColor={'#1A1C2E'}
          data={items}
          labelField="value"
          valueField="value"
          renderRightIcon={() => (
            <Image source={require('../../../res/btn/selectArrow.png')} />
          )}
          value={selectItem}
          placeholder={placeholderText}
          autoScroll={false}
          onChange={item => {
            clearAllText();
            changeFN(item);
          }}
          renderItem={renderItem}
        />
      </View>
    );
  };

  const createCheckDataView = () => {
    return (
      <View style={styles.sendConfirmationBox}>
        <View style={styles.checkDataBox}>
          <Image
            source={require('../../../res/picture/check.png')}
            style={{width: 51, height: 51, resizeMode: 'contain'}}
          />
          <Text style={styles.font5}>{nowTime}</Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderBottomColor: '#CBE7FF',
            borderBottomWidth: 1,
            paddingBottom: 20,
            marginVertical: 10,
          }}>
          {showMessageText(showMessage)}
        </View>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '700',
            marginVertical: 10,
          }}>
          是否執行指令?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.checkBox}>
            <TouchableOpacity
              style={styles.checkBtnBox}
              onPress={() => setMessage(false)}>
              <Text style={styles.lastBtnText}>取消</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.checkBox}>
            <TouchableOpacity
              style={styles.checkBtnBox}
              onPress={() => setMessage(true)}>
              <Text style={styles.lastBtnText}>確認</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const showExTextView = (textObj: any) => {
    if (textObj.length <= 0) {
      return null;
    }
    return textObj.map((obj: string, index: number) => {
      return (
        <View key={'showEXtext_' + index}>
          <Text style={styles.font6}>{obj}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}>
        <View style={styles.bodyBox}>
          <ScrollView style={{height: '90%', paddingHorizontal: 25}}>
            <View>
              <View style={{height: 20, marginTop: 5}}>
                <Text style={styles.font7}>{showTitle}</Text>
              </View>
              <View style={{paddingHorizontal: 5}}>
                <Text style={styles.titleText}>選擇指令</Text>
                {createDropdown(selectFN, pickedFN, changepickedFNSelect, 'fn')}
              </View>
            </View>

            <View style={{padding: 5, display: modeDisplay ? 'flex' : 'none'}}>
              <Text style={styles.titleText}>請選擇指令格式</Text>
              {createDropdown(
                selectMode,
                pickedMode,
                changepickedModeSelect,
                '格式',
              )}
            </View>

            <View
              style={{
                paddingHorizontal: 5,
                display: datalistDisplay ? 'flex' : 'none',
              }}>
              {fnPlayerSSID(showInputArray)}
            </View>

            <View
              style={{
                paddingVertical: 5,
                display: exTextDisplay ? 'flex' : 'none',
              }}>
              {showExTextView(showEXText)}
            </View>

            <View
              style={{
                marginTop: 5,
                display: sendBtnDisplay ? 'flex' : 'none',
              }}>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  sendBtnFN();
                  const nowDateTime = new Date();
                  const date = format(nowDateTime, 'yyyy/MM/dd');
                  const time = format(nowDateTime, 'hh:mm');
                  const hour =
                    nowDateTime.getHours() >= 12 ? ' 下午 ' : ' 上午 ';
                  setNowTime(date + hour + time);
                  nameCorrespondInpute();
                }}>
                <View style={styles.sendButton}>
                  <Text style={styles.sendText}>送出</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
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

        <View style={styles.showReturnItemBox}>{createError(storeError)}</View>
        {createShowRenderView(showUserSSID)}
        {createShowParentBlack(showParentBlack)}
        <View
          style={[
            styles.blacksPlistBoxBg,
            {display: sendMessageDisplay ? 'flex' : 'none'},
          ]}>
          {createCheckDataView()}
        </View>
        {loadView(showLoad)}
        <View style={{position: 'absolute', top: '1%', alignSelf: 'center'}}>
          {ShowTaskidResult(
            storeTaskid,
            setStoreTaskid,
            setShowLoad,
            setStoreError,
            setShowParentBlack,
            pickedFN.value,
            setCheckCount,
            setShowMaskBox,
          )}
        </View>
      </KeyboardAwareScrollView>
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
  },
  bodyBox: {
    flex: 8,
    // backgroundColor: '#102243',
  },
  sendButton: {
    backgroundColor: '#CBE7FF',
    borderRadius: 5,
    width: '100%',
    paddingVertical: 7,
  },
  blacksPlistBoxBg: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#1D1D1DB2',
    height: '100%',
    alignItems: 'center',
    paddingTop: 40,
  },
  blacksPlistDataBox: {
    marginTop: 40,
    width: '80%',
    backgroundColor: '#6480B7',
    borderRadius: 10,
    height: '70%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sendConfirmationBox: {
    width: '80%',
    backgroundColor: '#6480B7',
    borderRadius: 10,
    height: '60%',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 20,
  },
  checkBox: {
    paddingHorizontal: 10,
  },
  checkBtnBox: {
    borderRadius: 15,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    paddingVertical: 2,

    // width: '100%',
    paddingHorizontal: 20,
  },
  checkDataBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginVertical: 5,
  },
  playerSSIDColseBtn: {
    width: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    borderColor: '#CBE7FF',
    backgroundColor: '#072357',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  containerStyle: {
    backgroundColor: '#1A1C2E',
    borderColor: '#CBE7FF',
    padding: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#CBE7FF',
    textAlign: 'left',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#CBE7FF',
  },
  item: {
    paddingVertical: 7.5,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  infoDataBox: {
    width: '80%',
    backgroundColor: '#6480B7',
    borderRadius: 10,
    height: '70%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#99FF00',
    position: 'absolute',
    borderRadius: 5,
    alignItems: 'flex-end',
    paddingVertical: 5,
    bottom: 10,
    padding: 8,
    paddingBottom: 15,
  },
  showPlayerData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  showReturnItemBox: {
    position: 'absolute',
    width: '80%',
    alignSelf: 'center',
    bottom: 0,
    flexDirection: 'column-reverse',
  },
  showTooltopBox: {
    marginVertical: '1.5%',
    width: '22%',
    backgroundColor: '#C7EAF3',
    marginHorizontal: '1.5%',
    padding: 3,
    borderRadius: 3,
  },
  showGameCodeBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  showNoGameCodeBox: {
    marginTop: '35%',
    alignItems: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  sendText: {
    color: '#2B3F51',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  font1: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  font2: {color: '#FFFFFF', fontSize: 16, fontWeight: '400'},
  font3: {color: '#565656', fontSize: 16, fontWeight: '600'},
  font4: {color: '#FFFFFF', fontSize: 20, fontWeight: '800'},
  font5: {color: '#FFFFFF', fontSize: 16, fontWeight: '400', marginTop: 10},
  font6: {color: '#CBE7FF', fontSize: 12},
  font7: {color: '#00FFF5', textAlign: 'center', fontSize: 18},
  font8: {color: '#FFFFFF', fontSize: 18, fontWeight: '400', margin: 3},
  font9: {color: '#FFFFFF', textAlign: 'center', fontSize: 16},
  font10: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  font11: {
    textAlign: 'center',
    color: '#C7EAF3',
    fontSize: 25,
    fontWeight: '400',
  },
  font12: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textItem: {width: '100%', fontSize: 16, textAlign: 'center'},
  closeText: {color: '#FFFFFF', fontSize: 20, fontWeight: '500'},
  lastBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  image1: {width: 25, height: 25, resizeMode: 'contain'},
  image2: {width: 30, height: 30, resizeMode: 'contain'},
  image3: {width: 55, height: 55, resizeMode: 'contain', marginBottom: 20},
});
export default AddCommandScreen;
