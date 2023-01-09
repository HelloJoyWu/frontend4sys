import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthContext} from '../context/authContext';
import version from '../version.json';

// import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

interface settingScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'SettingScreen'>;
}
const SettingScreen: React.FC<settingScreenProps> = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const versionText: any = version.version;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bg.png')}
        style={styles.backGroundSet}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}>
          <Image
            source={require('../../res/settingBack.png')}
            style={styles.image1}
          />
        </TouchableOpacity>
        <View style={styles.listBoxSet}>
          <Image
            source={require('../../res/logo/D2MLogo.png')}
            style={styles.image2}
          />
          <Text style={styles.font1}> {authContext.authInfo.lastName}</Text>
          <Text style={styles.font2}>關於D2M</Text>
          <Text style={styles.font3}>版本: {versionText}</Text>
          <TouchableOpacity
            onPress={() => authContext.logout()}
            style={styles.logoutBtn}>
            <Text style={styles.font4}>登出</Text>
          </TouchableOpacity>
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
  backBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  listBoxSet: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 10,
  },
  imgView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
  },
  bottomTextBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    padding: 10,
  },
  bottomText: {
    fontSize: 18,
    color: '#3C3C3C',
  },
  backGroundSet: {
    flex: 1,
    resizeMode: 'cover',
  },
  logoutBtn: {
    backgroundColor: '#CBE7FF',
    borderRadius: 10,
    marginVertical: '10%',
    paddingHorizontal: '25%',
    paddingVertical: 5,
  },
  image1: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  image2: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: '10%',
  },

  font1: {fontSize: 25, color: '#FFFFFF', marginVertical: 15},
  font2: {color: '#CBE7FF', fontSize: 24, marginTop: '10%'},
  font3: {
    color: '#FFFFFF',
    fontSize: 20,
    marginVertical: 10,
    marginRight: 5,
  },
  font4: {
    color: '#072357',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 5,
    fontWeight: '500',
  },
});

export default SettingScreen;
