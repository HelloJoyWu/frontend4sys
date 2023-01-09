import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  AppState,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthContext} from '../context/authContext';
import {LogoutTimer, ExtensionTime} from '../components/logoutTimer';
import {AxiosContext} from '../context/axiosContext';
import * as StorageHelper from '../utils/storageHelper';
import {loadView} from '../components/loadImage';
import HamburgerButton from '../components/hamburgerButton';

interface menuScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'MenuScreen'>;
}

const MenuScreen: React.FC<menuScreenProps> = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const {authCq9Axios: authAxios} = useContext(AxiosContext);
  const [isInitialInfo, setIsInitialInfo] = useState<boolean>(true);

  const fetchOwnerGameList = useCallback(async () => {
    try {
      // If having data, let user use old info first and sync in background
      const localInfos = await StorageHelper.getInfoFromLocal();
      if (localInfos.agentInfo) {
        console.log('Already have info!');
        StorageHelper.storeAgentInfos(localInfos.agentInfo);
        StorageHelper.storeGameInfos(localInfos.gameInfo);
        setIsInitialInfo(false);
      }

      var t0 = performance.now();
      const [respAgent, respGame] = await Promise.all([
        await authAxios.get('/api/v1/inquiry/agent/list'),
        await authAxios.get('/api/v1/inquiry/game/list'),
      ]);
      var t1 = performance.now();
      console.log(
        'Fetch latest Agent and Game list success!' +
          (t1 - t0) / 1000 +
          'seconds',
      );

      var t2 = performance.now();
      StorageHelper.storeAgentInfos(respAgent.data);
      StorageHelper.storeGameInfos(respGame.data);
      await StorageHelper.storeInfo2Local(respAgent.data, respGame.data);
      console.log(
        'Store latest Agent and Game list success!' +
          (t2 - t1) / 1000 +
          'seconds',
      );
      setIsInitialInfo(false);
    } catch (error: any) {
      console.error(
        'Fetch latest Agent and GameCode failed',
        error.name,
        error.message,
      );
      setIsInitialInfo(false);
      Alert.alert(error.name, error.message);
    }
  }, [authAxios]);

  useEffect(() => {
    fetchOwnerGameList();
    authContext.setLoginTime(new Date().getTime());
    authContext.setShowExtensionTime(false);
    authContext.setTimeDelayAgain(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>
            welcome {authContext.authInfo.username}!
          </Text>
          <View style={{marginBottom: 12}}>
            <HamburgerButton
              onPress={() => navigation.navigate('SettingScreen')}
            />
          </View>
        </View>

        {LogoutTimer('menu')}
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
          <View style={styles.alertBtnBox}>
            {/* <View style={styles.alertBtnView}>
              <TouchableOpacity
                onPress={() => navigation.push('RiskAlertScreen')}
                style={styles.alertBtn}>
                <Image
                  source={require('../../res/menu/RiskAlert.png')}
                  style={styles.image1}
                />
                <Text style={styles.font1}>警示通知</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.alertBtnView}>
              <TouchableOpacity
                onPress={() => navigation.push('RtpInquireScreen')}
                style={styles.alertBtn}>
                <Image
                  source={require('../../res/menu/RTP.png')}
                  style={styles.image1}
                />
                <Text style={styles.font1}>RTP查詢</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.alertBtnView}>
              <TouchableOpacity
                onPress={() => navigation.push('CommandRobotScreen')}
                style={styles.alertBtn}>
                <Image
                  source={require('../../res/menu/commandRobot.png')}
                  style={styles.image1}
                />
                <Text style={styles.font1}>風控機器人</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.alertBtnView}>
              <TouchableOpacity
                onPress={() => navigation.push('HedgeInquireScreen')}
                style={styles.alertBtn}>
                <Image
                  source={require('../../res/menu/hedgeInquire.png')}
                  style={styles.image1}
                />
                <Text style={styles.font1}>對沖查詢</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.alertBtnView}>
              <TouchableOpacity
                onPress={() =>
                  navigation.push('Inquire168Screen')
                }
                style={styles.alertBtn}>
                <Image
                  source={require('../../res/menu/168.png')}
                  style={styles.image1}
                />
                <Text style={styles.font1}>168查詢</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
        {loadView(isInitialInfo)}
        {ExtensionTime()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 25,
    margin: 10,
  },
  alertBtnBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '90%',
  },
  menuBtn: {
    marginVertical: 5,
    marginHorizontal: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  alertBtnView: {
    marginVertical: 5,
    alignItems: 'center',
    width: '50%',
  },
  alertBtn: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  image1: {
    resizeMode: 'contain',
    width: 170,
    height: 170,
  },
  font1: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 3,
  },
});

export default MenuScreen;
