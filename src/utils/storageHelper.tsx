import AsyncStorage from '@react-native-async-storage/async-storage';

type agentGameMemoryCache = {
  parentList: any[];
  ownerList: any[];
  gameList: any[];
  parentsFinder: {[oid: string]: {}[]};
};

const agentGameMemoryCache: agentGameMemoryCache = {
  parentList: [],
  ownerList: [],
  gameList: [],
  parentsFinder: {},
};
/**
 * 要把所有存儲的key跟value 屬性什麼的都要記錄好
 * 目前要紀錄 所有推播訊息的離開時間
 * 要有 當前畫面 跟 離開時間
 */

/**
 * 紀錄離開推播訊息畫面的時間
 * @param value
 * screenName 哪個畫面
 * leaveTime 離開時間
 */
export const storeLeaveTime = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value.leaveTime);
    console.log('資料返序列化', jsonValue.length);

    await AsyncStorage.setItem(value.screenName, jsonValue);
  } catch (e) {
    console.log('save error', e);
  }
};

export const getLeaveTime = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.log('reading error', e);
  }
};

export const getInfoFromLocal = async (): Promise<{
  agentInfo: {}[];
  gameInfo: {}[];
}> => {
  try {
    const agentInfoJSON = await AsyncStorage.getItem('agentInfo');
    const gameInfoJSON = await AsyncStorage.getItem('gameInfo');

    return {
      agentInfo: agentInfoJSON ? JSON.parse(agentInfoJSON) : [],
      gameInfo: gameInfoJSON ? JSON.parse(gameInfoJSON) : [],
    };
  } catch (e) {
    console.log('AsyncStorage get infos failed', e);
    return {
      agentInfo: [],
      gameInfo: [],
    };
  }
};

export const storeInfo2Local = async (agentInfos: {}[], gameInfos: {}[]) => {
  const agentInfoJSON = JSON.stringify(agentInfos);
  const gameInfoJSON = JSON.stringify(gameInfos);
  try {
    await AsyncStorage.setItem('agentInfo', agentInfoJSON);
    await AsyncStorage.setItem('gameInfo', gameInfoJSON);
  } catch (e) {
    console.log('AsyncStorage store infos failed', e);
  }
};

export const storeAgentInfos = (
  agentInfos: {[k: string]: string | number}[],
) => {
  agentGameMemoryCache.parentList = [];
  agentGameMemoryCache.ownerList = [];
  agentGameMemoryCache.parentsFinder = {};
  for (let agentInfo of agentInfos) {
    if (agentInfo.agent_type === 'parent') {
      var parentInfo = {
        label: agentInfo.account,
        value: agentInfo.id,
        oid: agentInfo.oid,
      };
      agentGameMemoryCache.parentList.push(parentInfo);
      if (!agentGameMemoryCache.parentsFinder[agentInfo.oid]) {
        agentGameMemoryCache.parentsFinder[agentInfo.oid] = [];
      }
      agentGameMemoryCache.parentsFinder[agentInfo.oid].push(parentInfo);
    } else if (agentInfo.agent_type === 'owner') {
      agentGameMemoryCache.ownerList.push({
        label: agentInfo.account,
        value: agentInfo.id,
      });
    }
  }
};

export const storeGameInfos = (gameInfos: {[k: string]: string | number}[]) => {
  agentGameMemoryCache.gameList = [];
  for (let gameInfo of gameInfos) {
    agentGameMemoryCache.gameList.push({
      value: gameInfo.code,
      label: gameInfo.code + ' ' + gameInfo.name,
      gameType: gameInfo.game_type,
    });
  }
};

export const getParentListUnderOnwer = (oid: number): {}[] => {
  return agentGameMemoryCache.parentsFinder[oid];
};

export const getParentList = () => {
  return agentGameMemoryCache.parentList;
};

export const getOwnerList = () => {
  return agentGameMemoryCache.ownerList;
};

export const getGameCodeList = () => {
  return agentGameMemoryCache.gameList;
};
