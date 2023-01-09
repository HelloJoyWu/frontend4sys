import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/authContext';
import {objToQueryString} from '../core/util';
import {cq9BackendURL} from '../context/axiosContext';
import version from '../version.json';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BiometryID from '../core/biometryID';
import * as Keychain from 'react-native-keychain';

interface loginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
}

const LoginScreen: React.FC<loginScreenProps> = ({}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const [resetButtonDis, setResetButtonDis] = useState<boolean>(false);
  const [disTextPassword, setDisTextPassword] = useState<boolean>(true);
  const versionText: any = version.version;
  const [disabledBiometrySwitch, setDisabledBiometrySwitch] = useState(false);

  const closeEyes = '../../res/btn/eyesClose.png';
  const openEyes = '../../res/btn/eyesOpen.png';

  useEffect(() => {
    BiometryID.isSupported()
      .then(async biometryType => {
        console.log('Receieve biometry isSupported', biometryType.toString());
        if (biometryType) {
          setDisabledBiometrySwitch(false);
        } else {
          setDisabledBiometrySwitch(true);
          console.log('biometryType NOT support');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const onBiometryLogin = async () => {
    try {
      authContext.setIsLoading(true);
      let login_data = {
        username: '',
        password: '',
      };
      await Keychain.getGenericPassword()
        .then(async result => {
          console.log('Get Keychain response');
          if (result) {
            const loginInfo = JSON.parse(result.password);
            if (!loginInfo.password || loginInfo.password === '') {
              Alert.alert(
                'Nothing is stored for biometry. Please setup again!',
              );
              await Keychain.resetGenericPassword();
              authContext.setIsLoading(false);
              return;
            }
            await BiometryID.authenticate('使用生物識別登入')
              .then(() => {
                console.log('get biometry success!');
                login_data.username = loginInfo.username;
                login_data.password = loginInfo.password;
              })
              .catch(async error => {
                console.log('BiometryID get auth', error);
                console.log(error.details);
                if (error.details.name === 'LAErrorAuthenticationFailed') {
                  await axios
                    .get(
                      `${cq9BackendURL}/api/v1/deactive/${login_data.username}`,
                    )
                    .catch(respError => {
                      console.log('Bio-auth error for deactive', respError);
                    });
                }
                authContext.setIsLoading(false);
              });
          } else {
            Alert.alert('請確認', '是否使用當前帳號密碼於生物識別登入!', [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Set-confirmation canceled');
                  authContext.setIsLoading(false);
                },
              },
              {
                text: 'OK',
                onPress: async () => {
                  login_data.username = username;
                  login_data.password = password;
                  await BiometryID.authenticate('設定生物識別登入')
                    .then(async () => {
                      await Keychain.setGenericPassword(
                        'login',
                        JSON.stringify(login_data),
                      );
                      Alert.alert('設定成功！', '請再次點擊生物識別登入');
                    })
                    .catch(error => {
                      Alert.alert('生物識別設定失敗', error);
                      console.log('BiometryID set auth', error);
                    });
                },
              },
            ]);
            return;
          }
        })
        .catch(error => {
          Alert.alert('Something went wrong', `Keychain failed with ${error}`);
          console.log('Keychain failed', error);
        });

      if (login_data.username === '' || login_data.password === '') {
        authContext.setIsLoading(false);
        return;
      }

      const cq9Response = await axios.post(
        `${cq9BackendURL}/api/v1/auth/token`,
        objToQueryString(login_data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );

      authContext.setAuthState(cq9Response.data.access_token != null);
      authContext.storeAuthToken({
        [cq9BackendURL]: {
          accessToken: cq9Response.data.access_token,
          refreshToken: cq9Response.data.refresh_token,
        },
      });

      let nowTimestamp = new Date().getTime();
      await AsyncStorage.setItem(
        'bgInactive@performanceAPP',
        nowTimestamp.toString(),
      );
    } catch (error: any) {
      authContext.setAuthState(false);
      Alert.alert('Login Failed', error.message);
      console.error('Login Failed', error.name, error.message);
    } finally {
      console.log('Set setIsLoading false');
      authContext.setIsLoading(false);
    }
  };

  const onLogin = async () => {
    try {
      authContext.setIsLoading(true);
      let login_data = {
        username: username,
        password: password,
      };

      const cq9Response = await axios.post(
        `${cq9BackendURL}/api/v1/auth/token`,
        objToQueryString(login_data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
        },
      );

      authContext.setAuthState(cq9Response.data.access_token != null);
      authContext.storeAuthToken({
        [cq9BackendURL]: {
          accessToken: cq9Response.data.access_token,
          refreshToken: cq9Response.data.refresh_token,
        },
      });

      let nowTimestamp = new Date().getTime();
      await AsyncStorage.setItem(
        'bgInactive@performanceAPP',
        nowTimestamp.toString(),
      );
    } catch (error: any) {
      authContext.setAuthState(false);
      Alert.alert('Login Failed', error.message);
      console.error('Login Failed', error.name, error.message);
    } finally {
      authContext.setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../res/bg.png')}
        style={styles.backGroundSet}>
        <View style={styles.logoBox}>
          <Image
            source={require('../../res/logo/D2MLogo.png')}
            style={{width: 80, height: 80, resizeMode: 'contain'}}
          />
          <View style={{alignItems: 'center'}}>
            <Text style={styles.font1}>welcome</Text>
            <Text style={styles.font2}>Login!</Text>
          </View>
        </View>

        <View style={styles.bodyBox}>
          <KeyboardAwareScrollView
            style={{height: '70%', width: '100%'}}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
            }}
            keyboardDismissMode={'on-drag'}
            bounces={false}
            overScrollMode="never">
            <View style={styles.textInputView}>
              <TextInput
                placeholder="email or username"
                placeholderTextColor="#FFFFFF75"
                style={styles.textInputBox}
                autoCapitalize="none"
                onChangeText={text => setUsername(text)}
                value={username}
              />
            </View>
            <View style={styles.textInputView}>
              <TextInput
                placeholder="password"
                placeholderTextColor="#FFFFFF75"
                style={[styles.textInputBox, {width: '90%'}]}
                secureTextEntry={disTextPassword}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <TouchableOpacity
                onPress={() => {
                  setDisTextPassword(!disTextPassword);
                }}
                style={styles.eyesView}>
                {disTextPassword ? (
                  <Image source={require(closeEyes)} style={styles.image1} />
                ) : (
                  <Image source={require(openEyes)} style={styles.image1} />
                )}
              </TouchableOpacity>
            </View>

            <View style={{width: '90%'}}>
              <TouchableOpacity style={{marginBottom: 25}} onPress={onLogin}>
                <View style={styles.loginButton}>
                  <Text style={styles.loginText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.textBox}>
              <View style={styles.lineBox} />
              <Text style={styles.font3}>或用以下方式</Text>
              <View style={styles.lineBox} />
            </View>

            <View style={styles.otherLoginView}>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={async () => {
                  if (disabledBiometrySwitch) {
                    Alert.alert('Biometry not support!');
                  } else {
                    await onBiometryLogin();
                  }
                }}>
                <Image
                  source={require('../../res/btn/faceicon.png')}
                  style={styles.image2}
                />
                <Text style={styles.font4}>指紋/臉部登入</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.textBox}
              onLongPress={() => {
                setResetButtonDis(!resetButtonDis);
              }}>
              <View style={styles.lineBox} />
              <Text style={styles.font3}>重新設定生物識別</Text>
              <View style={styles.lineBox} />
            </TouchableOpacity>
            <View
              style={[
                styles.otherLoginView,
                {display: resetButtonDis ? 'flex' : 'none'},
              ]}>
              <TouchableOpacity
                style={[
                  styles.otherLoginView,
                  {
                    display: resetButtonDis ? 'flex' : 'none',
                  },
                ]}
                onPress={() => {
                  console.log('重新設定指紋');
                  Alert.alert('重設帳號密碼', '請確認使否重設儲存的帳號密碼', [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        return;
                      },
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        await Keychain.resetGenericPassword();
                      },
                    },
                  ]);
                }}>
                <Image
                  source={require('../../res/btn/resetbiometrics.png')}
                  style={styles.imgae3}
                />
              </TouchableOpacity>
            </View>

            <View style={{position: 'absolute', bottom: 10, right: 0}}>
              <Text style={styles.font5}>版本{versionText}</Text>
            </View>
          </KeyboardAwareScrollView>
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
  logoBox: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bodyBox: {
    flex: 8,
    backgroundColor: '#072357',
    borderTopLeftRadius: 30,
    marginTop: 10,
    paddingHorizontal: 30,
    paddingTop: '15%',
  },
  textInputView: {
    borderBottomColor: '#FFFFFF71',
    borderBottomWidth: 3,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputBox: {
    fontSize: 26,
    padding: 5,
    color: '#FFFFFF',
  },
  loginButton: {
    marginTop: 30,
    justifyContent: 'center',
    backgroundColor: '#CBE7FF',
    borderRadius: 10,
    padding: 5,
  },
  textBox: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  lineBox: {
    height: 1,
    width: '25%',
    borderBottomColor: '#FFFFFF71',
    borderBottomWidth: 2,
  },
  loginText: {
    color: '#072357',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  eyesView: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
  },
  otherLoginView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    width: '100%',
  },
  image1: {width: 25, height: 25, resizeMode: 'contain'},
  image2: {width: 60, height: 60, resizeMode: 'contain'},
  imgae3: {width: 40, height: 40, resizeMode: 'contain'},
  font1: {fontSize: 20, color: '#FFFFFF'},
  font2: {fontSize: 45, color: '#FFFFFF', fontWeight: 'bold'},
  font3: {fontSize: 14, color: '#FFFFFF', marginHorizontal: '5%'},
  font4: {color: '#A2A2A2', fontSize: 12, marginTop: 3},
  font5: {color: '#FFFFFF', fontSize: 12},
});

export default LoginScreen;
