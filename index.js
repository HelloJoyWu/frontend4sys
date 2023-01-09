/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/context/authContext';
import {AxiosProvider} from './src/context/axiosContext';
import 'react-native-gesture-handler';
import React from 'react';

const Root = () => {
  return (
    <AuthProvider>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </AuthProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
