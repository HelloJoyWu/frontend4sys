import React, {createContext, useContext} from 'react';
import {Alert} from 'react-native';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {AuthContext} from './authContext';
import {objToQueryString, sleep} from '../core/util';
import * as coreErrors from '../core/errors';

type axiosContextType = {
  authCq9Axios: AxiosInstance;
  authChamplandAxios: AxiosInstance;
  authKimbabaAxios: AxiosInstance;
};

const AxiosContext = createContext({} as axiosContextType);
const {Provider} = AxiosContext;
export const cq9BackendURL = 'https://riskmanagement.cqgame.games';
// export const cq9BackendURL = 'https://riskmanagement.cqgame.cc';
export const champlandBackendURL = 'https://riskmanagement.ballking.cc';
export const kimbabaBackendURL = 'https://riskmanagement.rebirth.games';

const AxiosProvider: React.FC<axiosContextType> = ({children}) => {
  const authContext = useContext(AuthContext);

  // Authorized axios instance
  const authCq9Axios = axios.create({
    baseURL: cq9BackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  authCq9Axios.interceptors.request.use(
    config => {
      return authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(
        new coreErrors.requestError(error.code, error.config),
      );
    },
  );

  authCq9Axios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(
        new coreErrors.requestError(error.code, error.config, error.response),
        error.config,
      );
    },
  );

  const authChamplandAxios = axios.create({
    baseURL: champlandBackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  authChamplandAxios.interceptors.request.use(
    config => {
      return authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(
        new coreErrors.requestError(error.code, error.config),
      );
    },
  );

  authChamplandAxios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(
        new coreErrors.requestError(error.code, error.config, error.response),
        error.config,
      );
    },
  );

  const authKimbabaAxios = axios.create({
    baseURL: kimbabaBackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  authKimbabaAxios.interceptors.request.use(
    config => {
      return authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(
        new coreErrors.requestError(error.code, error.config),
      );
    },
  );

  authKimbabaAxios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(
        new coreErrors.requestError(error.code, error.config, error.response),
        error.config,
      );
    },
  );

  const authRequestInterceptor = (config: AxiosRequestConfig) => {
    if (!config) {
      return Promise.reject('Missing configuration');
    } else if (!config.headers) {
      return Promise.reject('Missing headers');
    } else if (!authContext.authToken[cq9BackendURL]) {
      return Promise.reject('Missing auth-token');
    } else if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authContext.authToken[cq9BackendURL].accessToken}`;
    }

    return config;
  };

  let isCq9Refreshing = false;
  let cq9FailedQueue: any[] = [];
  const processCq9Queue = (error: any, token: {} | null = null) => {
    cq9FailedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    cq9FailedQueue = [];
  };

  const authErrorResponseInterceptor = async (
    error: coreErrors.requestError,
    originalRequest: any | AxiosRequestConfig,
  ) => {
    console.log(
      'Auth resp interceptors',
      error.name,
      error.message,
      error.apiCode,
    );
    if (error?.apiCode === 10401 && !originalRequest._retry) {
      if (isCq9Refreshing) {
        return new Promise<any>((resolve, reject) => {
          cq9FailedQueue.push({resolve, reject});
        })
          .then(tokenData => {
            originalRequest.headers.Authorization =
              'Bearer ' + tokenData.access_token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isCq9Refreshing = true;
      const refreshData = {
        refresh_token: authContext.authToken[cq9BackendURL].refreshToken,
      };
      return new Promise((resolve, reject) => {
        console.log('Do refresh');
        axios
          .post(
            `${cq9BackendURL}/api/v1/auth/token/refresh`,
            objToQueryString(refreshData),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json',
              },
            },
          )
          .then(tokenRefreshResponse => {
            const tokenData = tokenRefreshResponse.data;

            if (tokenData.access_token == null) {
              const err = new coreErrors.requestError(
                '599',
                originalRequest,
                undefined,
                'Refresh get access_token as null',
              );
              console.log(err.name, err.message);
              processCq9Queue(err, null);
              reject(err);
              Alert.alert('Token expired, logout!');
              authContext.logout();
            } else {
              authContext.storeAuthToken({
                [cq9BackendURL]: {
                  accessToken: tokenData.access_token,
                  refreshToken: tokenData.refresh_token,
                },
              });
              originalRequest.headers.Authorization =
                'Bearer ' + tokenData.access_token;

              processCq9Queue(null, tokenData);
              axios(originalRequest)
                .then(resp => {
                  resolve(resp);
                })
                .catch(err => {
                  reject(
                    new coreErrors.requestError(
                      err.code,
                      err.config,
                      err.response,
                    ),
                  );
                });
            }
          })
          .catch(err => {
            processCq9Queue(err, null);
            reject(err);
            Alert.alert('Token expired, logout!');
            authContext.logout();
          })
          .finally(() => {
            isCq9Refreshing = false;
          });
      });
    }
    return Promise.reject(error);
  };

  return (
    <Provider
      value={{
        authCq9Axios,
        authChamplandAxios,
        authKimbabaAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};
