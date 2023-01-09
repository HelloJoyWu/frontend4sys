import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import {AxiosContext} from '../../context/axiosContext';
import {format} from 'date-fns';

type CheckCommandScreenProp = {
  checkCount: number;
};

const CheckCommandScreen = ({checkCount}: CheckCommandScreenProp) => {
  const {authCq9Axios: authAxios} = useContext(AxiosContext);
  const [noticeData, setNoticeData] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const featchTaskid = async (id: any) => {
    return await authAxios
      .get('/api/v1/task/', {
        params: {
          taskid: id,
        },
      })
      .then((resp: any) => {
        return resp.data.message;
      })
      .catch((error: any) => {
        console.log('error', error);
        Alert.alert(error.toString());
        return error;
      });
  };

  const featchDataTaskid = async (data: any[]) => {
    for (var i = 0; i < data.length; i++) {
      if (
        data[i].taskname === 'tasks.teamgateway.reset_parent_user_rtp' ||
        data[i].taskstatus === 'FAILURE'
      ) {
        data[i].taskid_message = await featchTaskid(data[i].task_id);
      }
    }
    setNoticeData(data);
  };

  const featchData = useCallback(async () => {
    setRefresh(true);
    try {
      const respAgent = await authAxios.get('/api/v1/cmd/recent/detail');
      console.log('Loading latest robot command detail success');
      featchDataTaskid(respAgent.data);

      setRefresh(false);
    } catch (error: any) {
      setRefresh(false);
      console.error(
        'Fetch latest robot command detail failed',
        error.name,
        error.message,
      );
    }
  }, [authAxios]);

  useEffect(() => {
    featchData();
  }, [featchData, checkCount]);

  const convertData = (date: string) => {
    const nowDateTime = new Date(date);
    const time = format(nowDateTime, 'hh:mm');
    const hour = nowDateTime.getHours() >= 12 ? ' 下午 ' : ' 上午 ';
    const alldata = hour + time;
    return alldata;
  };

  const returnText = (textObj: any) => {
    let text = textObj.replace(/"/g, '');
    text = text.replace(/{/g, '');
    text = text.replace(/}/g, '');
    text = text.replace(/task_name/g, 'fn');

    return text;
  };

  const returnTaskidText = (taskidText: string) => {
    let text = taskidText.replace(/;/g, '\n');
    return text;
  };

  const createbox = (database: any[]) => {
    if (database.length <= 0) {
      return (
        <View style={styles.textCenterBox}>
          <Text style={styles.font1}>暫無資料</Text>
        </View>
      );
    }

    let showDate: string = '';
    let lastDate: string = '';
    return database.map((obj: any, index: number) => {
      const successBackgroundColor =
        obj.taskstatus === 'SUCCESS' ? '#00A171' : '#FF5757';
      const successText = obj.taskstatus === 'SUCCESS' ? 'Success' : 'Error';
      showDate =
        lastDate === format(new Date(obj.tasktime), 'yyyy/MM/dd')
          ? ''
          : format(new Date(obj.tasktime), 'yyyy/MM/dd');
      lastDate = format(new Date(obj.tasktime), 'yyyy/MM/dd');

      let btnDisPlay: boolean = true;

      if (
        obj.taskname === 'tasks.teamgateway.reset_parent_user_rtp' ||
        obj.taskstatus === 'FAILURE'
      ) {
        btnDisPlay = false;
      }

      return (
        <View style={styles.singleMessageBox} key={'message_' + index}>
          <View
            style={[
              styles.dateMessageBox,
              {display: showDate.length > 0 ? 'flex' : 'none'},
            ]}>
            <Text style={styles.font2}>{showDate}</Text>
          </View>
          <View style={styles.timeStatusBox}>
            <Text style={styles.font3}>{convertData(obj.tasktime)}</Text>
            <View
              style={[
                styles.statusBox,
                {backgroundColor: successBackgroundColor},
              ]}>
              <Text style={styles.font4}>{successText}</Text>
            </View>
          </View>
          <View style={{width: '100%'}}>
            <Text style={styles.font5}>{obj.user}'s order on</Text>
            <Text style={styles.font5}>{returnText(obj.taskinfo)}</Text>
            {obj.taskid_message ? (
              <Text style={styles.font5}>
                {returnTaskidText(obj.taskid_message)}
              </Text>
            ) : null}
          </View>
        </View>
      );
    });
  };

  const renderBoxes = useMemo(() => {
    return createbox(noticeData);
  }, [noticeData]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            tintColor={'#FFFFFF'}
            onRefresh={() => featchData()}
          />
        }>
        <View style={styles.bodyBox}>{renderBoxes}</View>
      </ScrollView>
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
    paddingHorizontal: 25,
  },
  singleMessageBox: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateMessageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  timeStatusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusBox: {
    borderRadius: 15,
    width: 70,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1D1D1DB2',
    alignItems: 'center',
  },
  dataBaseBox: {
    backgroundColor: '#6480B7',
    borderRadius: 10,
    width: '80%',
    height: '35%',
    top: '20%',
    alignItems: 'center',
  },
  dataBaseImgBox: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataBaseInfoBox: {
    height: '30%',
    alignItems: 'center',
  },
  textCenterBox: {alignItems: 'center', marginTop: 10},
  font1: {color: '#FFFFFF', fontSize: 20},
  font2: {color: '#000000', fontSize: 14},
  font3: {color: '#BFF2FF', fontSize: 14, fontWeight: '500'},
  font4: {color: '#FFFFFF', fontSize: 14, fontWeight: '500'},
  font5: {color: '#FFFFFF', fontSize: 14},
  font6: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },

  image1: {width: 95, height: 75, resizeMode: 'contain'},
  image2: {width: 30, height: 30, resizeMode: 'contain'},
});
export default CheckCommandScreen;
