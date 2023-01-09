import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/backButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {LogoutTimer} from '../../components/logoutTimer';
import {AuthContext} from '../../context/authContext';
import HamburgerButton from '../../components/hamburgerButton';

interface inquire168ScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Inquire168Screen'>;
  route: RouteProp<RootStackParamList, 'Inquire168Screen'>;
}

const Inquire168Screen: React.FC<inquire168ScreenProps> = ({
  route,
  navigation,
}) => {
  const authContext = useContext(AuthContext);
  const keyProps: any = route.params.keyProps || ' ';
  const [angntBtnDisabled, setAngntBtnDisabled] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const testData = [
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
    {name: '123', bet: 10, bet_p: 10, player: 10, bet_avg: 10, round_avg: 10},
  ];

  const createBarDatabase = (database: any, disBoolean: boolean) => {
    return (
      <View style={{padding: 10, display: disBoolean ? 'flex' : 'none'}}>
        <View style={styles.barTitleBox}>
          <Text style={styles.font1}>近30天概況</Text>
          <Text style={styles.font2}>換算幣別:CNY</Text>
        </View>
        <View>
          <View style={styles.barInfoBigBox}>
            <Text style={styles.font3}>日均碼量</Text>
            <Text style={styles.font4}>{database.bet}</Text>
          </View>
          <View style={styles.barInfoBigBox}>
            <Text style={styles.font3}>日均碼量佔比</Text>
            <Text style={styles.font4}>{database.bet_p}</Text>
          </View>
          <View style={styles.barInfoBigBox}>
            <Text style={styles.font3}>日均人數</Text>
            <Text style={styles.font4}>{database.player}</Text>
          </View>
          <View style={styles.barInfoBigBox}>
            <Text style={styles.font3}>平均投注</Text>
            <Text style={styles.font4}>{database.bet_avg}</Text>
          </View>
          <View style={[styles.barInfoBigBox, {borderBottomWidth: 0}]}>
            <Text style={styles.font3}>平均場次</Text>
            <Text style={styles.font4}>{database.round_avg}</Text>
          </View>
        </View>
      </View>
    );
  };

  const createBar = (allData: any[]) => {
    return allData.map((obj: any, index: number) => {
      return (
        <View style={styles.barBox} key={'bar_' + index}>
          <TouchableOpacity
            onPress={() => {
              angntBtnDisabled[index] = !angntBtnDisabled[index];
            }}
            activeOpacity={0.7}
            style={styles.barBtn}>
            <Text style={styles.font6}>{obj.name}</Text>
            <Image
              source={require('../../../res/picture/inquireArrow.png')}
              style={{
                transform: [
                  {rotate: angntBtnDisabled[index] ? '90deg' : '0deg'},
                ],
              }}
            />
          </TouchableOpacity>
          {createBarDatabase(obj, angntBtnDisabled[index])}
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
          {LogoutTimer()}
          <BackButton
            title={'168查詢'}
            color={'#A383CE'}
            onPress={() => navigation.pop()}
          />
          <HamburgerButton
            onPress={() => navigation.navigate('SettingScreen')}
          />
        </View>
        <View style={styles.bodyBox}>
          <ScrollView>
            <TouchableOpacity style={styles.sendBtn}>
              <Text style={styles.font5}>送出查詢</Text>
            </TouchableOpacity>
            <View style={{marginTop: 10}}>{createBar(testData)}</View>
          </ScrollView>
        </View>
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
    marginBottom: 5,
  },
  bodyBox: {
    flex: 8,
    paddingHorizontal: '5%',
    marginTop: 5,
  },
  sendBtn: {
    width: '90%',
    backgroundColor: '#CBE7FF',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 7,
  },
  barBox: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#072357',
    borderRadius: 7,
  },
  barBtn: {
    width: '100%',
    backgroundColor: '#A383CE',
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    borderRadius: 7,
  },
  barTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
  },
  barInfoBigBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },

  font1: {color: '#BDB7FF', fontSize: 25, fontWeight: '700'},
  font2: {color: '#FFFFFF', fontSize: 12, fontWeight: '700'},
  font3: {color: '#CBE7FF', fontSize: 16, fontWeight: '700'},
  font4: {color: '#FFFFFF', fontSize: 22, fontWeight: '400'},
  font5: {color: '#000000', fontSize: 20, fontWeight: '700'},
  font6: {color: '#FFFFFF', fontSize: 20, fontWeight: '700'},
});
export default Inquire168Screen;
