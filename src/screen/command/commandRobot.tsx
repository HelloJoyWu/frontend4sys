import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import BackButton from '../../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import {RouteProp} from '@react-navigation/native';
import {LogoutTimer, ExtensionTime} from '../../components/logoutTimer';
import HamburgerButton from '../../components/hamburgerButton';

import AddCommandScreen from './addCommand';
import CheckCommandScreen from './checkCommand';

interface CommandRobotScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'CommandRobotScreen'>;
  route: RouteProp<RootStackParamList, 'CommandRobotScreen'>;
}

const CommandRobotScreen: React.FC<CommandRobotScreenProps> = ({
  navigation,
}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'addCommand', title: '新增指令'},
    {key: 'checkCommand', title: '指令通知'},
  ]);
  const [checkCount, setCheckCount] = useState<number>(0);
  const [showMaskBox, setShowMaskBox] = useState<boolean>(false);

  const barBox = (obj: any) => {
    const indexPage = obj.navigationState.index;

    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.tabBarBackground} />
        <View style={styles.tabBar}>
          {obj.navigationState.routes.map((routePage: any, i: number) => {
            var showCheckCount = false;
            const title: string = indexPage === i ? '#00D6CE' : '#637294';
            const status: boolean = indexPage === i ? true : false;
            if (routePage.key === 'checkCommand') {
              showCheckCount = true;
            }
            return (
              <TouchableOpacity
                key={i}
                disabled={status}
                style={[styles.tabItem, {backgroundColor: title}]}
                onPress={() => {
                  setIndex(i);
                  setCheckCount(0);
                }}>
                {checkCount > 0 && showCheckCount ? (
                  <View style={styles.cuePoint}>
                    <Text style={styles.font1}>{checkCount}</Text>
                  </View>
                ) : null}
                <View>
                  <Animated.Text style={styles.font2}>
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
            title="風控機器人"
            color="#2AABB5"
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
                case 'addCommand':
                  return (
                    <AddCommandScreen
                      setCheckCount={setCheckCount}
                      setShowMaskBox={setShowMaskBox}
                    />
                  );
                case 'checkCommand':
                  return <CheckCommandScreen checkCount={checkCount} />;
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
  tabBarBackground: {
    width: '100%',
    height: '65%',
    position: 'absolute',
    // backgroundColor: '#102243',
    // bottom: 0,
    // borderTopLeftRadius: 30,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  tabItem: {
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cuePoint: {
    position: 'absolute',
    right: -5,
    top: 0,
    backgroundColor: '#F13F51',
    width: 18,
    height: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskBox: {
    backgroundColor: '#1D1D1DB2',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  font1: {color: '#FFFFFF', fontSize: 14, fontWeight: '700'},
  font2: {color: '#FFFFFF', fontSize: 18},
});

export default CommandRobotScreen;
