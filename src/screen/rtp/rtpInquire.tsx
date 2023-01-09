import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import {RouteProp} from '@react-navigation/native';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import HamburgerButton from '../../components/hamburgerButton';

import AgentAllScreen from './agentAll';
import AgentGameScreen from './agentGame';
import PlayerAllScreen from './playerAll';
import PlayerGameScreen from './playerGame';

interface rtpInquireScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'RtpInquireScreen'>;
  route: RouteProp<RootStackParamList, 'RtpInquireScreen'>;
}

const RtpInquireScreen: React.FC<rtpInquireScreenProps> = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [refreshTime, setRefreshTime] = useState<Date>();
  const [showMaskBox, setShowMaskBox] = useState<boolean>(false);

  const [routes] = useState([
    {key: 'agentAll', title: '代理整體'},
    {key: 'agentGame', title: '代理遊戲'},
    {key: 'playerAll', title: '玩家整體'},
    {key: 'playerGame', title: '玩家遊戲'},
  ]);

  const barBox = (obj: any) => {
    const indexPage = obj.navigationState.index;
    return (
      <View style={styles.tabBar}>
        {obj.navigationState.routes.map((routePage: any, i: number) => {
          const title: string = indexPage === i ? '#2AAB85' : '#758B9E';
          const status: boolean = indexPage === i ? true : false;
          return (
            <TouchableOpacity
              key={i}
              disabled={status}
              style={[styles.tabItem, {backgroundColor: title}]}
              onPress={() => setIndex(i)}>
              <View>
                <Animated.Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '700',
                  }}>
                  {routePage.title}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View
          style={[styles.maskBox, {display: showMaskBox ? 'flex' : 'none'}]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.titleBox}>
          {LogoutTimer()}
          <BackButton
            title={'RTP查詢'}
            color={'#2AAB85'}
            onPress={() => navigation.pop()}
          />
          <HamburgerButton
            onPress={() => navigation.navigate('SettingScreen')}
          />

          <View
            style={[styles.maskBox, {display: showMaskBox ? 'flex' : 'none'}]}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 5,
            backgroundColor: showMaskBox ? '#1D1D1DB2' : '#FFFFFF00',
          }}
        />

        <View style={styles.bodyBox}>
          <View style={styles.bodyBoxBackground} />

          <TabView
            navigationState={{index, routes}}
            renderScene={(routePage: any) => {
              switch (routePage.route.key) {
                case 'agentAll':
                  return (
                    <AgentAllScreen
                      changeIndex={index}
                      refreshTime={refreshTime}
                      setRefreshTime={setRefreshTime}
                      setShowMaskBox={setShowMaskBox}
                    />
                  );
                case 'agentGame':
                  return (
                    <AgentGameScreen
                      changeIndex={index}
                      refreshTime={refreshTime}
                      setRefreshTime={setRefreshTime}
                      setShowMaskBox={setShowMaskBox}
                    />
                  );
                case 'playerAll':
                  return (
                    <PlayerAllScreen
                      changeIndex={index}
                      refreshTime={refreshTime}
                      setRefreshTime={setRefreshTime}
                      setShowMaskBox={setShowMaskBox}
                    />
                  );
                case 'playerGame':
                  return (
                    <PlayerGameScreen
                      changeIndex={index}
                      refreshTime={refreshTime}
                      setRefreshTime={setRefreshTime}
                      setShowMaskBox={setShowMaskBox}
                    />
                  );
                default:
                  return null;
              }
            }}
            renderTabBar={barBox}
            swipeEnabled={false}
            onIndexChange={setIndex}
          />
        </View>

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
    flex: 1,
    flexDirection: 'row',
    // marginBottom: 5,
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
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  tabItem: {
    paddingHorizontal: 5,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  maskBox: {
    backgroundColor: '#1D1D1DB2',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
export default RtpInquireScreen;
