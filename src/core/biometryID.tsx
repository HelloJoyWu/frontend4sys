import {Component} from 'react';
import {NativeModules, Platform} from 'react-native';
import * as coreErrors from './errors';
const NativeBiometryID = NativeModules.BiometryID;

/**
 * High-level docs for the TouchID iOS API can be written here.
 */

export default class BiometryID extends Component {
  static isSupported(config?: object | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        NativeBiometryID.isSupported(
          config ? config : {},
          (error: any, biometryType: string) => {
            console.log('NativeBiometryID isSupported', error, biometryType);
            if (error) {
              return reject(createError(error.message, config));
            }
            return resolve(biometryType);
          },
        );
      } else if (Platform.OS === 'android') {
        NativeBiometryID.isSupported(
          (error: string, code: string) => {
            const errorCode =
              // @ts-ignore
              coreErrors.biometryAndroidAPIError[code] ||
              // @ts-ignore
              coreErrors.biometryAndroidError[code];
            console.error(
              'NativeBiometryID isSupported',
              error,
              code,
              errorCode,
            );
            return reject(createError(errorCode, config));
          },
          (biometryType: string) => {
            return resolve(biometryType);
          },
        );
      } else {
        return reject('Platform not supportted');
      }
    });
  }

  static authenticate(
    reason: string,
    config?: object | undefined,
  ): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const DEFAULT_CONFIG = {
        fallbackLabel: null,
        unifiedErrors: false,
        passcodeFallback: false,
      };
      const authReason = reason ? reason : ' ';
      const authConfig = Object.assign({}, DEFAULT_CONFIG, config);

      return new Promise((resolve, reject) => {
        NativeBiometryID.authenticate(authReason, authConfig, (error: any) => {
          // Return error if rejected
          if (error) {
            return reject(createError(error.message, authConfig));
          }
          return resolve(true);
        });
      });
    } else if (Platform.OS === 'android') {
      var authReason = reason ? reason : ' ';

      return new Promise((resolve, reject) => {
        NativeBiometryID.authenticate(
          authReason,
          (error: string, code: string) => {
            const errorCode =
              // @ts-ignore
              coreErrors.biometryAndroidAPIError[code] ||
              // @ts-ignore
              coreErrors.biometryAndroidError[code];
            console.error('NativeBiometryID authenticate', code, error);
            return reject(createError(errorCode));
          },
          (success: any) => {
            return resolve(true);
          },
        );
      });
    } else {
      return new Promise((_, reject) => {
        reject('Platform not supportted');
      });
    }
  }
}

const createError = (error: string, config?: object) => {
  const details = {
    name: error,
    message: getError(error).message,
    config: config ? JSON.stringify(config) : 'Not set',
  };

  return new coreErrors.BiometryIDError(details, error);
};

const getError = (code: any) => {
  switch (code) {
    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorAuthenticationFailed:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_ERROR_NONE_ENROLLED:
      return coreErrors.biometryError.AUTHENTICATION_FAILED;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorUserCancel:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_USER_CANCELED:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_ERROR_HW_UNAVAILABLE:
      return coreErrors.biometryError.USER_CANCELED;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorSystemCancel:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_CANCELED:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_NEGATIVE_BUTTON:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_VENDOR:
      return coreErrors.biometryError.SYSTEM_CANCELED;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorBiometryIDNotAvailable: // does this mean hw not present rather than not available?
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_HW_UNAVAILABLE:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
    case coreErrors.biometryErrorCodes.androidApiCodes
      .ERROR_NO_DEVICE_CREDENTIAL:
    case coreErrors.biometryErrorCodes.androidApiCodes
      .ERROR_SECURITY_UPDATE_REQUIRED:
      return coreErrors.biometryError.NOT_AVAILABLE;

    case coreErrors.biometryErrorCodes.iOSCodes.RCTBiometryIDNotSupported:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_STATUS_UNKNOWN:
      return coreErrors.biometryError.NOT_SUPPORTED;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorBiometryIDNotEnrolled:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_NO_BIOMETRICS:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_ERROR_NO_HARDWARE:
      return coreErrors.biometryError.NOT_ENROLLED;

    // android only
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_TIMEOUT:
      return coreErrors.biometryError.TIMEOUT;

    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_UNABLE_TO_PROCESS:
    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_NO_SPACE:
      return coreErrors.biometryError.PROCESSING_ERROR;

    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_LOCKOUT:
      return coreErrors.biometryError.LOCKOUT;

    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_LOCKOUT_PERMANENT:
      return coreErrors.biometryError.LOCKOUT_PERMANENT;

    case coreErrors.biometryErrorCodes.androidApiCodes.ERROR_HW_NOT_PRESENT:
    case coreErrors.biometryErrorCodes.androidModuleCodes
      .BIOMETRIC_ERROR_UNSUPPORTED:
      return coreErrors.biometryError.NOT_PRESENT;

    // ios only
    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorPasscodeNotSet:
      return coreErrors.biometryError.FALLBACK_NOT_ENROLLED;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorUserFallback:
      return coreErrors.biometryError.USER_FALLBACK;

    case coreErrors.biometryErrorCodes.iOSCodes.LAErrorBiometryIDLockout:
      return coreErrors.biometryError.LOCKOUT;

    default:
      return coreErrors.biometryError.UNKNOWN_ERROR;
  }
};
