//
//  BiometryID.m
//  frontend4sys
//
//  Created by peter on 2022/11/7.
//

#import "BiometryID.h"
#import <React/RCTUtils.h>
#import "React/RCTConvert.h"

@implementation BiometryID

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isSupported: (NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
    LAContext *context = [[LAContext alloc] init];
    NSError *error;
    
    // Check to see if we have a passcode fallback
    NSNumber *passcodeFallback = [NSNumber numberWithBool:true];
    if (RCTNilIfNull([options objectForKey:@"passcodeFallback"]) != nil) {
        passcodeFallback = [RCTConvert NSNumber:options[@"passcodeFallback"]];
    }
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        
        // No error found, proceed
        callback(@[[NSNull null], [self getBiometryType:context]]);
    } else if ([passcodeFallback boolValue] && [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error]) {
        
        // No error
        callback(@[[NSNull null], [self getBiometryType:context]]);
    }
    // Device does not support FaceID / TouchID / Pin OR there was an error!
    else {
        if (error) {
            NSString *errorReason = [self getErrorReason:error];
            NSLog(@"Authentication failed: %@", errorReason);
            
            callback(@[RCTMakeError(errorReason, nil, nil), [self getBiometryType:context]]);
            return;
        }
        
        callback(@[RCTMakeError(@"Biometry is not supported", nil, nil)]);
        return;
    }
}

RCT_EXPORT_METHOD(authenticate: (NSString *)reason
                  options:(NSDictionary *)options
                  callback: (RCTResponseSenderBlock)callback)
{
    NSNumber *passcodeFallback = [NSNumber numberWithBool:false];
    LAContext *context = [[LAContext alloc] init];
    NSError *error;

    if (RCTNilIfNull([options objectForKey:@"fallbackLabel"]) != nil) {
        NSString *fallbackLabel = [RCTConvert NSString:options[@"fallbackLabel"]];
        context.localizedFallbackTitle = fallbackLabel;
    }

    if (RCTNilIfNull([options objectForKey:@"passcodeFallback"]) != nil) {
        passcodeFallback = [RCTConvert NSNumber:options[@"passcodeFallback"]];
    }

    // Device has BiometryID
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        // Attempt Authentification
        [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                localizedReason:reason
                          reply:^(BOOL success, NSError *error)
         {
             [self handleAttemptToUseDeviceIDWithSuccess:success error:error callback:callback];
         }];

        // Device does not support BiometryID but user wishes to use passcode fallback
    } else if ([passcodeFallback boolValue] && [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:&error]) {
        // Attempt Authentification
        [context evaluatePolicy:LAPolicyDeviceOwnerAuthentication
                localizedReason:reason
                          reply:^(BOOL success, NSError *error)
         {
             [self handleAttemptToUseDeviceIDWithSuccess:success error:error callback:callback];
         }];
    }
    else {
        if (error) {
            NSString *errorReason = [self getErrorReason:error];
            NSLog(@"Authentication failed: %@", errorReason);
            
            callback(@[RCTMakeError(errorReason, nil, nil), [self getBiometryType:context]]);
            return;
        }
        
        callback(@[RCTMakeError(@"RCTBiometryIDNotSupported", nil, nil)]);
        return;
    }
}

- (void)handleAttemptToUseDeviceIDWithSuccess:(BOOL)success error:(NSError *)error callback:(RCTResponseSenderBlock)callback {
    if (success) { // Authentication Successful
        callback(@[[NSNull null], @"Authenticated with Biometry ID."]);
    } else if (error) { // Authentication Error
        NSString *errorReason = [self getErrorReason:error];
        NSLog(@"Authentication failed: %@", errorReason);
        callback(@[RCTMakeError(errorReason, nil, nil)]);
    } else { // Authentication Failure
        callback(@[RCTMakeError(@"RCTBiometryIDNotSupported", nil, nil)]);
    }
}

- (NSString *)getErrorReason:(NSError *)error
{
    NSString *errorReason;
    
    switch (error.code) {
        case LAErrorAuthenticationFailed:
            errorReason = @"LAErrorAuthenticationFailed";
            break;
            
        case LAErrorUserCancel:
            errorReason = @"LAErrorUserCancel";
            break;
            
        case LAErrorUserFallback:
            errorReason = @"LAErrorUserFallback";
            break;
            
        case LAErrorSystemCancel:
            errorReason = @"LAErrorSystemCancel";
            break;
            
        case LAErrorPasscodeNotSet:
            errorReason = @"LAErrorPasscodeNotSet";
            break;
            
        case LAErrorBiometryNotAvailable:
            errorReason = @"LAErrorBiometryNotAvailable";
            break;
            
        case LAErrorBiometryNotEnrolled:
            errorReason = @"LAErrorBiometryNotEnrolled";
            break;

        case LAErrorBiometryLockout:
            errorReason = @"LAErrorBiometryLockout";
            break;
            
        default:
            errorReason = @"RCTBiometryIDUnknownError";
            break;
    }
    
    return errorReason;
}

- (NSString *)getBiometryType:(LAContext *)context
{
    if (@available(iOS 11, *)) {
        if (context.biometryType == LABiometryTypeFaceID) {
            return @"FaceID";
        }
        else if (context.biometryType == LABiometryTypeTouchID) {
            return @"TouchID";
        }
        else if (context.biometryType == LABiometryNone) {
            return @"None";
        }
    }

    return @"TouchID";
}

@end

