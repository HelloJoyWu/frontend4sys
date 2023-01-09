// This file contains the TypeScript Types.
// The extension .d.ts allows using the types in other files without importing them.
type gameCode2NameType = {[code: string]: string}; // gameName-gameType

type gamename2CodeType = {[name: string]: string}; // gameCode-gameType

interface gameListType {
  code2name: gameCode2NameType;
  name2code: gamename2CodeType;
}

type parentListType = {
  [oarent_account: string]: {pid: number; owner_account: string; oid: number};
};

type ownerListType = {
  [owner_account: string]: {oid: number; parents: string[]};
}; //parents = [parentAccount-pid]

interface agentListType {
  owner_list: ownerListType;
  parent_list: parentListType;
}

interface authTokenInterface {
  [backendURL: string]: {accessToken: string; refreshToken: string};
}

interface authInfoInterface {
  username: string;
  lastName: string;
  groups: Array<string>;
  email: string;
}

type authContextType = {
  authToken: authTokenInterface;
  authInfo: authInfoInterface;
  authState: boolean;
  setAuthState: (authStatus: boolean) => void;
  isLoading: boolean;
  setIsLoading: (lodingOrNot: boolean) => void;
  logout: () => void;
  storeAuthToken: (tokenInfo: authTokenInterface) => void;
  storeAuthInfo: (insertAuthInfo: authInfoInterface) => void;
  showExtensionTime: boolean;
  setShowExtensionTime: (displayStatus: boolean) => void;
  loginTime: number;
  setLoginTime: (time: number) => void;
  timeDelayAgain: boolean;
  setTimeDelayAgain: (displayStatus: boolean) => void;
  logoutAfterSecs: number;
  setLogoutAfterSecs: (time: number) => void;
};

type RootStackParamList = {
  LoginScreen: undefined;
  MenuScreen: undefined;
  RiskAlertScreen: undefined;
  RiskAlertInfoScrren: {keyProps: any};
<<<<<<< HEAD
  HedgeInquireScreen: undefined;
  CommandRobotScreen: {keyProps: any};
  Inquire168Screen: {keyProps: any};
  RtpInquireScreen: {keyProps: any};
=======
  GameTypeScreen: undefined;
  CommandRobotScreen: undefined;
  Inquire168Screen: undefined;
  RtpInquireScreen: undefined;
>>>>>>> e966e72998117df12f748330f2dc910cdf8773d5
  DemandReportScreen: undefined;
  SettingScreen: undefined;
  SpinnerScreen: undefined;
};
