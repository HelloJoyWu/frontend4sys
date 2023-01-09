import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as StorageHelper from '../utils/storageHelper';
import {Dropdown} from 'react-native-element-dropdown';
import {toDateString} from '../core/util';

export const getMonthDate = () => {
  const nowDate = new Date();

  var pre2MonthDate = new Date();
  var pre1MonthDate = new Date();
  var preMonthDate = new Date();
  pre2MonthDate.setMonth(nowDate.getMonth() - 2);
  pre1MonthDate.setMonth(nowDate.getMonth() - 1);
  preMonthDate.setMonth(nowDate.getMonth());

  const monthStr_2 = (pre2MonthDate.getMonth() + 1).toString();
  const monthStr_1 = (pre1MonthDate.getMonth() + 1).toString();
  const monthStr = (preMonthDate.getMonth() + 1).toString();

  const monthStart = monthStr.length === 1 ? 0 + monthStr : monthStr;
  const monthMid = monthStr_1.length === 1 ? 0 + monthStr_1 : monthStr_1;
  const monthEnd = monthStr_2.length === 1 ? 0 + monthStr_2 : monthStr_2;

  return {oneMonth: monthStart, twoMonth: monthMid, threeMonth: monthEnd};
};

export const getDayDate = (): {from: string; to: string}[] => {
  // For progress=bar query
  var today = new Date();
  var pre2MonthDate = new Date(today);
  pre2MonthDate.setMonth(pre2MonthDate.getMonth() - 2);
  pre2MonthDate.setDate(1);
  var _queryDates = [];
  while (pre2MonthDate < today) {
    var nextDate = new Date(pre2MonthDate);
    nextDate.setDate(nextDate.getDate() + 1);
    var _queryDate = {
      from: toDateString(pre2MonthDate),
      to: toDateString(nextDate),
    };
    _queryDates.push(_queryDate);
    pre2MonthDate.setDate(pre2MonthDate.getDate() + 1);
  }

  // console.log('_queryDates', _queryDates);

  return _queryDates;
};

export const SetAgentDropdown = (
  selectOwnerItem: any,
  selectParentItem: any,
  ownerChangeFN: any,
  parentChangeFN: any,
  refreshTime: any,
) => {
  const [parentArray, setParentArray] = useState<any>([]);
  const [ownerArray, setOwnerArray] = useState<any>([]);
  const [allParentArray, setAllParentArray] = useState<any>([]);

  const loadItems = () => {
    console.log('loading Owner and Parent items');
    setParentArray(StorageHelper.getParentList());
    setOwnerArray(StorageHelper.getOwnerList());
    setAllParentArray(StorageHelper.getParentList());
  };

  useEffect(() => {
    loadItems();
  }, [refreshTime]);

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

  const createDropdown = (
    item: any,
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
          inputSearchStyle={styles.selectedTextStyle}
          activeColor={'#1A1C2E'}
          data={item}
          keyboardAvoiding={false}
          labelField="label"
          valueField="value"
          renderRightIcon={() => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  if (placeholderText === 'owner') {
                    ownerChangeFN('');
                    parentChangeFN('');
                    setParentArray(allParentArray);
                  } else {
                    parentChangeFN('');
                  }
                }}>
                <Image
                  source={require('../../res/picture/close.png')}
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 5,
                    display: selectItem ? 'flex' : 'none',
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Image source={require('../../res/btn/selectArrow.png')} />
            </View>
          )}
          search
          searchPlaceholder={'請輸入關鍵字'}
          value={selectItem}
          placeholder={placeholderText}
          autoScroll={false}
          onChange={selected => {
            changeFN(selected);
            if (placeholderText === 'owner') {
              parentChangeFN('');
              setParentArray(
                StorageHelper.getParentListUnderOnwer(selected.value),
              );
            }
          }}
          renderItem={renderItem}
        />
      </View>
    );
  };
  return (
    <View>
      <View>
        <Text style={styles.titleText}>請選擇總代</Text>
        {createDropdown(ownerArray, selectOwnerItem, ownerChangeFN, 'owner')}
      </View>
      <View>
        <Text style={styles.titleText}>請選擇子代</Text>
        {createDropdown(
          parentArray,
          selectParentItem,
          parentChangeFN,
          'parent',
        )}
      </View>
    </View>
  );
};

export const SetGameCodeDropdown = (
  selectGameCodeItem: any,
  gameCodeChangeFN: any,
) => {
  const [gameCodeArray, setGameCodeArray] = useState<any>([]);

  const loadItems = () => {
    console.log('loading gameCode items');
    const gameCode_list = StorageHelper.getGameCodeList();
    setGameCodeArray(gameCode_list);
  };

  useEffect(() => {
    loadItems();
  }, []);

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

  const createDropdown = (
    item: any,
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
          inputSearchStyle={styles.selectedTextStyle}
          activeColor={'#1A1C2E'}
          data={item}
          labelField="label"
          valueField="value"
          renderRightIcon={() => (
            <Image source={require('../../res/btn/selectArrow.png')} />
          )}
          search
          searchPlaceholder={'請輸入關鍵字'}
          value={selectItem}
          placeholder={placeholderText}
          autoScroll={false}
          onChange={selected => {
            changeFN(selected);
          }}
          renderItem={renderItem}
        />
      </View>
    );
  };
  return (
    <View>
      <View>
        <Text style={styles.titleText}>請選擇遊戲代碼</Text>
        {createDropdown(
          gameCodeArray,
          selectGameCodeItem,
          gameCodeChangeFN,
          'gameCode',
        )}
      </View>
    </View>
  );
};

export const SetAccountTextInputBox = (
  accountText: any,
  setAccountText: any,
) => {
  return (
    <View>
      <Text style={styles.titleText}>請輸入會員帳號</Text>
      <View style={styles.accountInputBox}>
        <TextInput
          style={[styles.dateText, {width: '93%'}]}
          // onChangeText={setAccountText}
          onChangeText={text => setAccountText(text)}
          value={accountText}
          placeholder="account"
          placeholderTextColor="#6F7485"
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setAccountText('');
          }}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#6F7485',
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
  textItem: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  headingText: {
    marginLeft: 10,
    marginVertical: 3,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  accountInputBox: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#CBE7FF',
    backgroundColor: '#072357',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dateText: {
    color: '#CBE7FF',
    fontSize: 18,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  closeButton: {
    width: '7%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
});
