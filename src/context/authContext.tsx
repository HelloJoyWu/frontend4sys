import React, {createContext, useState} from 'react';
import {cq9BackendURL} from './axiosContext';

const AuthContext = createContext<authContextType>({} as authContextType);
const {Provider} = AuthContext;

interface authProviderProp {
  children: React.ReactNode;
}

const AuthProvider: React.FC<authProviderProp> = ({children}) => {
  const [authState, setAuthState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<authTokenInterface>({});
  const [authInfo, setAuthInfo] = useState<authInfoInterface>({
    username: '',
    lastName: '',
    groups: [],
    email: '',
  });
  const [showExtensionTime, setShowExtensionTime] = useState<boolean>(false);
  const [loginTime, setLoginTime] = useState<number>(new Date().getTime());
  const [timeDelayAgain, setTimeDelayAgain] = useState<boolean>(false);
  const [logoutAfterSecs, setLogoutAfterSecs] = useState<number>(35);

  const storeAuthToken = (tokenInfo: authTokenInterface) => {
    if (tokenInfo) {
      console.log('Update authToken');
      setAuthToken(Object.assign(authToken, tokenInfo));
    }
  };

  const storeAuthInfo = (insertAuthInfo: authInfoInterface) => {
    if (insertAuthInfo) {
      console.log('Update authInfo', insertAuthInfo);
      setAuthInfo(Object.assign(authInfo, insertAuthInfo));
    }
  };

  const logout = () => {
    setAuthToken(
      Object.assign(authToken, {
        [cq9BackendURL]: {},
      }),
    );
    setAuthState(false);
    // console.log('logout', authToken);
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState,
        logout,
        authToken,
        storeAuthToken,
        authInfo,
        storeAuthInfo,
        isLoading,
        setIsLoading,
        showExtensionTime,
        setShowExtensionTime,
        loginTime,
        setLoginTime,
        timeDelayAgain,
        setTimeDelayAgain,
        logoutAfterSecs,
        setLogoutAfterSecs,
      }}>
      {children}
    </Provider>
  );
};

export {AuthContext, AuthProvider};
