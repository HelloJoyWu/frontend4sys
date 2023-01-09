import React, {useCallback, useContext, useEffect} from 'react';
import {Alert, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MenuScreen from './src/screen/menuScreen';
import RiskAlertScreen from './src/screen/risk/riskAlert';
import HedgeInquireScreen from './src/screen/hedgeInquire/hedgeInquireScreen';
import CommandRobotScreen from './src/screen/command/commandRobot';
import Inquire168Screen from './src/screen/inquire/inquire168';
import RtpInquireScreen from './src/screen/rtp/rtpInquire';
import DemandReportScreen from './src/screen/demand/demandReport';
import RiskAlertInfoScrren from './src/screen/risk/riskAlertInfo';
import LoginScreen from './src/screen/loginScreen';
import SettingScreen from './src/screen/settingScreen';
import {AuthContext} from './src/context/authContext';
import {AxiosContext} from './src/context/axiosContext';
import {SpinnerScreen} from './src/screen/spinnerScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const authContext = useContext(AuthContext);
  const {authCq9Axios: authAxios} = useContext(AxiosContext);

  const getUserInfo = useCallback(async () => {
    try {
      const user_data = await authAxios.get('/api/v1/users/me');
      authContext.storeAuthInfo({
        username: user_data.data.username,
        lastName: user_data.data.last_name,
        groups: user_data.data.groups,
        email: user_data.data.email,
      });
      console.log('Get user information success');
    } catch (error: any) {
      console.error('Get user info failed', error.name, error.message);
      Alert.alert('請洽相關人員', '取得使用者資訊失敗!');
      authContext.logout();
    }
  }, [authAxios, authContext]);

  useEffect(() => {
    if (authContext.authState) {
      getUserInfo();
    }
  }, [authContext.authState]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authContext.isLoading) {
    return <SpinnerScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authContext.authState ? 'MenuScreen' : 'LoginScreen'}
        screenOptions={{
          headerShown: false,
        }}>
        {authContext.authState ? (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="MenuScreen" component={MenuScreen} />
            <Stack.Screen name="RiskAlertScreen" component={RiskAlertScreen} />
            <Stack.Screen
              name="RiskAlertInfoScrren"
              component={RiskAlertInfoScrren}
            />
            <Stack.Screen
              name="HedgeInquireScreen"
              component={HedgeInquireScreen}
            />
            <Stack.Screen
              name="CommandRobotScreen"
              component={CommandRobotScreen}
            />
            <Stack.Screen
              name="Inquire168Screen"
              component={Inquire168Screen}
            />
            <Stack.Screen
              name="RtpInquireScreen"
              component={RtpInquireScreen}
            />
            <Stack.Screen
              name="DemandReportScreen"
              component={DemandReportScreen}
            />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="SpinnerScreen" component={SpinnerScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
