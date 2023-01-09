import React, {
  useEffect,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {AxiosContext} from '../context/axiosContext';

export const ShowTaskidResult = (
  storeTaskId: string,
  setStoreTaskId: any,
  showLoad: any,
  storeError: any,
  showParentBlackData: any,
  fnName: string,
  setCheckCount: Dispatch<SetStateAction<number>>,
  setShowMaskBox: any,
) => {
  const [fnStatus, setFnStatus] = useState<string>('');
  const {authCq9Axios: authAxios} = useContext(AxiosContext);

  const [showText, setShowText] = useState<string>('');
  const [showColor, setShowColor] = useState<string>('');

  const [countdownTime, setCountdownTime] = useState<number>(30); //connection 30's

  useEffect(() => {
    let timerRef = countdownTime;

    const setClearInterval = () => {
      clearInterval(valueTimer);
      setCountdownTime(30);
      showLoad(false);
      setShowMaskBox(false);
      setStoreTaskId('');
    };

    const updateShowTextStatus = (
      status: string,
      showStatus: string,
      showStatusColor: string,
    ) => {
      setFnStatus(status);
      setShowText(showStatus);
      setShowColor(showStatusColor);
    };

    const featchTaskid = async (taskid: string) => {
      const resps = await authAxios
        .get('/api/v1/task/', {
          params: {
            taskid: taskid,
          },
        })
        .then((resp: any) => {
          const statusStr = resp.data.status;
          if (statusStr === 'SUCCESS' || statusStr === 'FAILURE') {
            if (fnName === 'get_parent_blacks') {
              if (resp.data.data) {
                showParentBlackData(resp.data.data[0]);
              } else {
                showParentBlackData({gamecode: []});
              }
            }

            if (statusStr === 'SUCCESS') {
              updateShowTextStatus(statusStr, '指令成功', '#00A171');
            }
            if (statusStr === 'FAILURE') {
              Alert.alert(resp.data.message);
              updateShowTextStatus(statusStr, '指令失敗', '#FF5757');
            }
            setTimeout(() => {
              setFnStatus('');
            }, 2000);
            setClearInterval();
            setCheckCount(prevCount => prevCount + 1);
          }
          return resp;
        })
        .catch((error: any) => {
          console.log('error', error);
          setClearInterval();
          Alert.alert(error.toString());
          return error;
        });
    };

    if (storeTaskId.length <= 0) {
      return;
    }

    const valueTimer = setInterval(() => {
      if (storeTaskId.length <= 0) {
        return;
      }

      updateShowTextStatus('update', '狀態更新中', '#FFEB5C');
      setShowMaskBox(true);
      timerRef -= 1;

      if (timerRef < 0) {
        setClearInterval();
        updateShowTextStatus('TimeOut', '連線逾時', '#FF5757');
        setTimeout(() => {
          setFnStatus('');
        }, 2000);
      } else {
        setCountdownTime(timerRef);
      }

      featchTaskid(storeTaskId);
    }, 1000);

    return () => {
      setClearInterval();
    };
  }, [
    authAxios,
    storeTaskId,
    setStoreTaskId,
    showLoad,
    fnName,
    storeError,
    showParentBlackData,
    setCheckCount,
  ]);

  useEffect(() => {
    setFnStatus('');
  }, []);

  const returnImg = (status: string) => {
    if (status === 'SUCCESS') {
      return (
        <Image
          source={require('../../res/picture/circle_check.png')}
          style={styles.image1}
        />
      );
    } else if (status === 'FAILURE' || status === 'TimeOut') {
      return (
        <Image
          source={require('../../res/picture/circle_close.png')}
          style={styles.image1}
        />
      );
    } else if (status === 'update') {
      return (
        <Image
          source={require('../../res/picture/circle_load.png')}
          style={styles.image1}
        />
      );
    } else {
      return null;
    }
  };

  const createReturnItem = (status: string, textStr: string) => {
    if (status.length <= 0) {
      return null;
    }

    let textColot: string = '#FFFFFF';
    if (status === 'update') {
      textColot = '#3B517A';
    }

    return (
      <View style={[styles.returnItemBox, {backgroundColor: showColor}]}>
        <Text style={[styles.font1, {color: textColot}]}>{textStr}</Text>
        {returnImg(status)}
      </View>
    );
  };

  return <View>{createReturnItem(fnStatus, showText)}</View>;
};

const styles = StyleSheet.create({
  returnItemBox: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
  },
  image1: {width: 25, height: 25, resizeMode: 'contain', marginRight: 5},
  font1: {fontSize: 20, fontWeight: '600'},
});
