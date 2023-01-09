import {Dispatch, SetStateAction} from 'react';
import {Alert} from 'react-native';

export const setApi = (
  authAxios: any,
  database: any,
  setTaskid: any,
  setShowUserSSID: any,
  showLoad: any,
  setShowMaskBox: (showMaskBox: boolean) => void,
) => {
  console.log('送出的database', database);
  const fn: string = database.fn;

  let url: string = '';
  let params: {[k: string]: string | number} = {};

  if (fn === 'user_ssid') {
    setShowUserSSID('');
    return featchUserSSID(
      authAxios,
      database,
      setShowUserSSID,
      showLoad,
      setShowMaskBox,
    );
  } else {
    if (fn === 'set_rtp') {
      if (database.agent_type !== 'playerSSID') {
        url = `/api/v1/cmd/player/${fn}`;
        params = {
          agent_type: database.agent_type,
          agent_id: database.agent_id,
          player_account: database.player_account,
          rtp: database.rtp,
        };
      } else if (database.agent_type === 'playerSSID') {
        url = `/api/v1/cmd/player/${fn}/${database.playerSSID}`;
        params = {rtp: database.rtp};
      }
    } else if (fn === 'frozen' || fn === 'defrozen' || fn === 'logout_one') {
      if (database.agent_type !== 'playerSSID') {
        url = `/api/v1/cmd/player/${fn}`;
        params = {
          agent_type: database.agent_type,
          agent_id: database.agent_id,
          player_account: database.player_account,
        };
      } else if (database.agent_type === 'playerSSID') {
        url = `/api/v1/cmd/player/${fn}/${database.playerSSID}`;
      }
    } else if (fn === 'logout_all_by_game') {
      url = `/api/v1/cmd/game/${fn}`;
      params = {gamecode: database.gamecode};
    } else if (fn === 'rm_parent_blacks' || fn === 'set_parent_blacks') {
      url = `/api/v1/cmd/agent/${fn}`;
      params = {
        agent_id: database.agent_id,
        gamecode: database.gamecode,
      };
      console.log('params', params);
    } else if (fn === 'get_parent_blacks' || fn === 'reset_parent_user_rtp') {
      url = `/api/v1/cmd/agent/${fn}`;
      params = {agent_id: database.agent_id};
      console.log('params', params);
    }
    featchCommonAPI(
      authAxios,
      setTaskid,
      showLoad,
      url,
      params,
      setShowMaskBox,
    );
  }
};

const featchCommonAPI = async (
  authAxios: any,
  changeTaskid: any,
  showLoad: any,
  url: string,
  params: any,
  setShowMaskBox: any,
) => {
  await authAxios
    .get(url, {params: params})
    .then((resp: any) => {
      // console.log('resp', resp);
      // setCheckCount(prevCount => prevCount + 1);
      changeTaskid(resp.data.taskid);
    })
    .catch((error: any) => {
      // setCheckCount(prevCount => prevCount + 1);
      showLoad(false);
      setShowMaskBox(false);
      if (error.apiCode === 10599) {
        Alert.alert(
          error.name,
          error.message + '，請您於通知內查看指令是否完成，再決定是否再次執行',
        );
      } else {
        Alert.alert(error.name, error.message);
      }
      console.error(error?.detail || error?.message);
    });
};

const featchUserSSID = async (
  authAxios: any,
  data: any,
  setShowUserSSID: any,
  showLoad: any,
  setShowMaskBox: any,
) => {
  await authAxios
    .get('/api/v1/inquiry/player/info', {
      params: {
        agent_type: data.agent_type,
        agent_id: data.agent_id,
        player_account: data.player_account,
      },
    })
    .then((resp: any) => {
      // console.log('resp', resp.data);
      showLoad(false);
      setShowMaskBox(false);
      setShowUserSSID(resp.data);
    })
    .catch((error: any) => {
      showLoad(false);
      setShowMaskBox(false);
      Alert.alert(error.name, error.message);
      console.error(error?.detail || error?.message);
    });
};
