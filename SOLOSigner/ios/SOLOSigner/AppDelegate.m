/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SOLOSigner"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:0.00f green:0.43f blue:1.00f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  application.applicationIconBadgeNumber = 0;
  if( SYSTEM_VERSION_LESS_THAN( @"10.0" ) )
  {
    [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound |    UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    
  }
  else
  {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error)
     {
       if( !error )
       {
         [[UIApplication sharedApplication] registerForRemoteNotifications];  // required to get the app to do anything at all about push notifications
         NSLog( @"Push registration success." );
       }
       else
       {
         NSLog( @"Push registration FAILED" );
         NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
         NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
       }
     }];
  }
  
  return YES;
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  NSLog( @"deviceToken: %@", deviceToken );
}

-(void) application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void
                                                                                                                               (^)(UIBackgroundFetchResult))completionHandler
{
  // iOS 10 will handle notifications through other methods
  
  if( SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO( @"10.0" ) )
  {
    NSLog( @"iOS version >= 10. Let NotificationCenter handle this one." );
    // set a member variable to tell the new delegate that this is background
    return;
  }
  NSLog( @"HANDLE PUSH, didReceiveRemoteNotification: %@", userInfo );
  
  // custom code to handle notification content
  
  if( [UIApplication sharedApplication].applicationState == UIApplicationStateInactive )
  {
    NSLog( @"INACTIVE" );
    completionHandler( UIBackgroundFetchResultNewData );
  }
  else if( [UIApplication sharedApplication].applicationState == UIApplicationStateBackground )
  {
    NSLog( @"BACKGROUND" );
    completionHandler( UIBackgroundFetchResultNewData );
  }
  else
  {
    NSLog( @"FOREGROUND" );
    completionHandler( UIBackgroundFetchResultNewData );
  }
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [self application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:^(UIBackgroundFetchResult result) {
  }];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  NSLog( @"Handle push from foreground" );
  // custom code to handle push while app is in the foreground
  NSLog(@"%@", notification.request.content.userInfo);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)())completionHandler
{
  NSLog( @"Handle push from background or closed" );
  // if you set a member variable in didReceiveRemoteNotification, you  will know if this is from closed or background
  NSLog(@"%@", response.notification.request.content.userInfo);
}

@end
