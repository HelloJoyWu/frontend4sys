//
//  BiometryID.h
//  frontend4sys
//
//  Created by peter on 2022/11/7.
//

#ifndef BiometryID_h
#define BiometryID_h

#import <React/RCTBridgeModule.h>
#import <LocalAuthentication/LocalAuthentication.h>

@interface BiometryID : NSObject <RCTBridgeModule>
    - (NSString *_Nonnull)getBiometryType:(LAContext *_Nonnull)context;
@end

#endif /* BiometryID_h */
