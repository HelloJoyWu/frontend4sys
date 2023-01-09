import {AxiosResponse, AxiosRequestConfig} from 'axios';
import {
  cq9BackendURL,
  champlandBackendURL,
  kimbabaBackendURL,
} from '../context/axiosContext';

/**
 * Request Error with the error code, API code, request, and response.
 * @property [apiCode] The API error-response code; 10501 if not given.
 * @param {string} [code] The error code (for example, 'ECONNABORTED', 4XX, 5XX).
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @param {string} [message] The error message; if given, the error eill not read from response.
 * @returns {Error} The error.
 */
export class requestError extends Error {
  code: string | number;
  apiCode: number;
  message: string;
  env: string;
  request: AxiosRequestConfig;
  response: AxiosResponse | undefined;
  traceId: string;
  processTime: string | undefined;
  detail: string;
  constructor(
    code: string,
    request: AxiosRequestConfig,
    response?: AxiosResponse,
    message?: string,
  ) {
    super();
    this.code = response?.status || code;
    this.name = response
      ? `ResponseError(${this.code})`
      : `RequestError(${this.code})`;
    this.apiCode = response?.data?.code || 10599;
    var initMsg = message || response?.data?.message || 'Request error!';
    this.request = request;
    this.response = response;
    switch (request?.baseURL) {
      case cq9BackendURL:
        this.env = 'CQ9';
        break;
      case champlandBackendURL:
        this.env = 'CHAMP';
        break;
      case kimbabaBackendURL:
        this.env = 'VENUS';
        break;
      default:
        this.env = request?.baseURL || 'ANY';
    }
    this.traceId = response?.headers['x-request-id'] || 'TraceId';
    if (this.code.toString() === '504') {
      if (this.apiCode === 10504) {
        this.message = `[${this.apiCode}] 伺服器錯誤`;
      } else {
        this.message = `[${this.code}] iOS/Android連線逾時`;
      }
    } else {
      this.message = `<${this.traceId}>${this.env}[${this.apiCode}] ${initMsg}`;
    }
    this.processTime = response?.headers['x-process-time'] || 'ProcessTime';
    this.detail =
      this.name + this.message + `(process ${this.processTime} secs.)`;
  }
}

export class BiometryIDError extends Error {
  details: {[message: string]: string};
  code: string;
  constructor(details: {[message: string]: string}, code: string) {
    super();
    this.code = code;
    this.name = `BiometryIDError(${code})`;
    this.message = details.message || 'Biometry ID Error';
    this.details = details || {};
  }
}

export const biometryErrorCodes = {
  iOSCodes: {
    LAErrorAuthenticationFailed: 'LAErrorAuthenticationFailed',
    LAErrorUserCancel: 'LAErrorUserCancel',
    LAErrorUserFallback: 'LAErrorUserFallback',
    LAErrorSystemCancel: 'LAErrorSystemCancel',
    LAErrorPasscodeNotSet: 'LAErrorPasscodeNotSet',
    LAErrorBiometryIDNotAvailable: 'LAErrorBiometryIDNotAvailable',
    LAErrorBiometryIDNotEnrolled: 'LAErrorBiometryIDNotEnrolled',
    LAErrorBiometryIDLockout: 'LAErrorBiometryIDLockout',
    RCTBiometryIDNotSupported: 'RCTBiometryIDNotSupported',
  },
  androidApiCodes: {
    ERROR_HW_UNAVAILABLE: 'ERROR_HW_UNAVAILABLE',
    ERROR_UNABLE_TO_PROCESS: 'ERROR_UNABLE_TO_PROCESS',
    ERROR_TIMEOUT: 'ERROR_TIMEOUT',
    ERROR_NO_SPACE: 'ERROR_NO_SPACE',
    ERROR_CANCELED: 'ERROR_CANCELED',
    ERROR_LOCKOUT: 'ERROR_LOCKOUT',
    ERROR_SECURITY_UPDATE_REQUIRED: 'ERROR_SECURITY_UPDATE_REQUIRED',
    ERROR_LOCKOUT_PERMANENT: 'ERROR_LOCKOUT_PERMANENT',
    ERROR_USER_CANCELED: 'ERROR_USER_CANCELED',
    ERROR_NO_BIOMETRICS: 'ERROR_NO_BIOMETRICS',
    ERROR_HW_NOT_PRESENT: 'ERROR_HW_NOT_PRESENT',
    ERROR_NEGATIVE_BUTTON: 'ERROR_NEGATIVE_BUTTON',
    ERROR_NO_DEVICE_CREDENTIAL: 'ERROR_NO_DEVICE_CREDENTIAL',
    ERROR_VENDOR: 'ERROR_VENDOR',
  },
  androidModuleCodes: {
    BIOMETRIC_STATUS_UNKNOWN: 'BIOMETRIC_STATUS_UNKNOWN',
    BIOMETRIC_ERROR_UNSUPPORTED: 'BIOMETRIC_ERROR_UNSUPPORTED',
    BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
      'BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED',
    BIOMETRIC_ERROR_NO_HARDWARE: 'BIOMETRIC_ERROR_NO_HARDWARE',
    BIOMETRIC_ERROR_NONE_ENROLLED: 'BIOMETRIC_ERROR_NONE_ENROLLED',
    BIOMETRIC_ERROR_HW_UNAVAILABLE: 'BIOMETRIC_ERROR_HW_UNAVAILABLE',
  },
};

export const biometryIOSErrors = {
  [biometryErrorCodes.iOSCodes.LAErrorAuthenticationFailed]: {
    message:
      'Authentication was not successful because the user failed to provide valid credentials.',
  },
  [biometryErrorCodes.iOSCodes.LAErrorUserCancel]: {
    message:
      'Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.',
  },
  [biometryErrorCodes.iOSCodes.LAErrorUserFallback]: {
    message:
      'Authentication was canceled because the user tapped the fallback button (Enter Password).',
  },
  [biometryErrorCodes.iOSCodes.LAErrorSystemCancel]: {
    message:
      'Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.',
  },
  [biometryErrorCodes.iOSCodes.LAErrorPasscodeNotSet]: {
    message:
      'Authentication could not start because the passcode is not set on the device.',
  },
  [biometryErrorCodes.iOSCodes.LAErrorBiometryIDNotAvailable]: {
    message:
      'Authentication could not start because Biometry ID is not available on the device',
  },
  [biometryErrorCodes.iOSCodes.LAErrorBiometryIDNotEnrolled]: {
    message:
      'Authentication could not start because Biometry ID has no enrolled fingers.',
  },
  [biometryErrorCodes.iOSCodes.LAErrorBiometryIDLockout]: {
    message: 'Authentication failed because of too many failed attempts.',
  },
  [biometryErrorCodes.iOSCodes.RCTBiometryIDNotSupported]: {
    message: 'Device does not support Biometry ID.',
  },
};

export const biometryAndroidAPIError = {
  '1': biometryErrorCodes.androidApiCodes.ERROR_HW_UNAVAILABLE,
  '2': biometryErrorCodes.androidApiCodes.ERROR_UNABLE_TO_PROCESS,
  '3': biometryErrorCodes.androidApiCodes.ERROR_TIMEOUT,
  '4': biometryErrorCodes.androidApiCodes.ERROR_NO_SPACE,
  '5': biometryErrorCodes.androidApiCodes.ERROR_CANCELED,
  '7': biometryErrorCodes.androidApiCodes.ERROR_LOCKOUT,
  '8': biometryErrorCodes.androidApiCodes.ERROR_VENDOR,
  '9': biometryErrorCodes.androidApiCodes.ERROR_LOCKOUT_PERMANENT,
  '10': biometryErrorCodes.androidApiCodes.ERROR_USER_CANCELED,
  '11': biometryErrorCodes.androidApiCodes.ERROR_NO_BIOMETRICS,
  '12': biometryErrorCodes.androidApiCodes.ERROR_HW_NOT_PRESENT,
  '13': biometryErrorCodes.androidApiCodes.ERROR_NEGATIVE_BUTTON,
  '14': biometryErrorCodes.androidApiCodes.ERROR_NO_DEVICE_CREDENTIAL,
  '15': biometryErrorCodes.androidApiCodes.ERROR_SECURITY_UPDATE_REQUIRED,
};

export const biometryAndroidError = {
  '-1': biometryErrorCodes.androidModuleCodes.BIOMETRIC_STATUS_UNKNOWN,
  '-2': biometryErrorCodes.androidModuleCodes.BIOMETRIC_ERROR_UNSUPPORTED,
  '1': biometryErrorCodes.androidModuleCodes.BIOMETRIC_ERROR_HW_UNAVAILABLE,
  '11': biometryErrorCodes.androidModuleCodes.BIOMETRIC_ERROR_NONE_ENROLLED,
  '12': biometryErrorCodes.androidModuleCodes.BIOMETRIC_ERROR_NO_HARDWARE,
  '15': biometryErrorCodes.androidModuleCodes
    .BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED,
};

export const biometryError = {
  AUTHENTICATION_FAILED: {
    message: 'Authentication failed',
    code: 'AUTHENTICATION_FAILED',
  },
  USER_CANCELED: {
    message: 'User canceled authentication',
    code: 'USER_CANCELED',
  },
  SYSTEM_CANCELED: {
    message: 'System canceled authentication',
    code: 'SYSTEM_CANCELED',
  },
  NOT_PRESENT: {
    message: 'Biometry hardware not present',
    code: 'NOT_PRESENT',
  },
  NOT_SUPPORTED: {
    message: 'Biometry is not supported',
    code: 'NOT_SUPPORTED',
  },
  NOT_AVAILABLE: {
    message: 'Biometry is not currently available',
    code: 'NOT_AVAILABLE',
  },
  NOT_ENROLLED: {
    message: 'Biometry is not enrolled',
    code: 'NOT_ENROLLED',
  },
  TIMEOUT: {
    message: 'Biometry timeout',
    code: 'TIMEOUT',
  },
  LOCKOUT: {
    message: 'Biometry lockout',
    code: 'LOCKOUT',
  },
  LOCKOUT_PERMANENT: {
    message: 'Biometry permanent lockout',
    code: 'LOCKOUT_PERMANENT',
  },
  PROCESSING_ERROR: {
    message: 'Biometry processing error',
    code: 'PROCESSING_ERROR',
  },
  USER_FALLBACK: {
    message: 'User selected fallback',
    code: 'USER_FALLBACK',
  },
  FALLBACK_NOT_ENROLLED: {
    message: 'User selected fallback not enrolled',
    code: 'FALLBACK_NOT_ENROLLED',
  },
  UNKNOWN_ERROR: {
    message: 'Unknown error',
    code: 'UNKNOWN_ERROR',
  },
};
