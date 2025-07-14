# Cấu hình iOS cho VNPAY SDK

## 1. Cấu hình Info.plist

**File: `ios/YourApp/Info.plist`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Existing configuration... -->
    
    <!-- URL Schemes cho VNPAY -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>vnpay.payment.scheme</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>vnpaymerchant</string>
            </array>
        </dict>
    </array>
    
    <!-- App Transport Security -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSExceptionDomains</key>
        <dict>
            <key>vnpay.vn</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSExceptionMinimumTLSVersion</key>
                <string>TLSv1.0</string>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
            <key>sandbox.vnpayment.vn</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSExceptionMinimumTLSVersion</key>
                <string>TLSv1.0</string>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
        </dict>
    </dict>
    
    <!-- Permissions -->
    <key>NSCameraUsageDescription</key>
    <string>Ứng dụng cần quyền truy cập camera để quét mã QR thanh toán</string>
    
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Ứng dụng cần quyền truy cập thư viện ảnh để lưu mã QR thanh toán</string>
    
    <!-- Other configurations -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>vnpay</string>
        <string>vnpayfast</string>
        <string>vietcombank</string>
        <string>techcombank</string>
        <string>mbbank</string>
        <string>acb</string>
        <string>bidv</string>
        <string>vietinbank</string>
        <string>sacombank</string>
        <string>momo</string>
        <string>zalopay</string>
    </array>
</dict>
</plist>
```

## 2. Cấu hình AppDelegate.m

**File: `ios/YourApp/AppDelegate.m`**

```objc
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

// Import VNPAY SDK
#import <CallAppSDK/CallAppInterface.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"VNPayMobileApp"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Handle Deep Links for VNPAY
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // Handle VNPAY deep link
  if ([url.scheme isEqualToString:@"vnpaymerchant"]) {
    // Process VNPAY callback
    return YES;
  }
  
  // Handle other deep links (React Navigation, etc.)
  return [RCTLinkingManager application:application openURL:url options:options];
}

// iOS 9+ support
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
  // Handle VNPAY deep link for iOS 9+
  if ([url.scheme isEqualToString:@"vnpaymerchant"]) {
    return YES;
  }
  
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

// Universal Links support
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

@end
```

## 3. Cấu hình Podfile

**File: `ios/Podfile`**

```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '11.0'
install! 'cocoapods', :deterministic_uuids => false

target 'VNPayMobileApp' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    # Enables Flipper.
    #
    # Note that if you have use_frameworks! enabled, Flipper will not work and
    # you should disable the next line.
    :flipper_configuration => FlipperConfiguration.enabled,
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # VNPAY SDK
  pod 'react-native-vnpay-merchant', :path => '../react-native-vnpay-merchant'
  
  target 'VNPayMobileAppTests' do
    inherit! :complete
    # Pods for testing
  end

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
    
    # VNPAY SDK specific configuration
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '11.0'
        config.build_settings['ENABLE_BITCODE'] = 'NO'
        
        # Fix for Xcode 14+
        if config.build_settings['WRAPPER_EXTENSION'] == 'bundle'
          config.build_settings['DEVELOPMENT_TEAM'] = 'YOUR_TEAM_ID'
        end
      end
    end
  end
end
```

## 4. Cấu hình Build Settings

### Project Build Settings:

1. **Deployment Target**: iOS 11.0 hoặc cao hơn
2. **Bitcode**: Disabled (NO)
3. **Enable Modules**: YES
4. **Always Embed Swift Standard Libraries**: YES (nếu sử dụng Swift)

### Target Build Settings:

```
IPHONEOS_DEPLOYMENT_TARGET = 11.0
ENABLE_BITCODE = NO
SWIFT_VERSION = 5.0
DEVELOPMENT_TEAM = YOUR_TEAM_ID
CODE_SIGN_IDENTITY = "iPhone Developer"
```

## 5. Cấu hình Deep Link cho iOS

### Tạo file URL Scheme Test:

**File: `ios/URLSchemeTest.swift`** (Optional, cho testing)

```swift
import UIKit

class URLSchemeTest: NSObject {
    
    static func testVNPayScheme() {
        let testURL = URL(string: "vnpaymerchant://payment-return?result=success")!
        
        if UIApplication.shared.canOpenURL(testURL) {
            print("✅ VNPAY URL Scheme configured correctly")
        } else {
            print("❌ VNPAY URL Scheme not working")
        }
    }
    
    static func openVNPayApp() {
        let vnpayURL = URL(string: "vnpay://")!
        
        if UIApplication.shared.canOpenURL(vnpayURL) {
            UIApplication.shared.open(vnpayURL, options: [:], completionHandler: nil)
        } else {
            print("VNPAY app not installed")
        }
    }
}
```

## 6. Testing Deep Links trên iOS

### Test với iOS Simulator:

```bash
# Test success URL
xcrun simctl openurl booted "vnpaymerchant://payment-return?result=success"

# Test fail URL
xcrun simctl openurl booted "vnpaymerchant://payment-return?result=fail"

# Test cancel URL
xcrun simctl openurl booted "vnpaymerchant://payment-return?result=cancel"
```

### Test với Physical Device:

```bash
# Sử dụng Safari trên device
# Nhập URL: vnpaymerchant://payment-return?result=success

# Hoặc sử dụng ideviceinstaller
ideviceinstaller -u [DEVICE_UDID] -l
```

## 7. Troubleshooting iOS

### Common Issues:

1. **Deep link không hoạt động:**
   ```
   - Kiểm tra CFBundleURLSchemes trong Info.plist
   - Verify LSApplicationQueriesSchemes
   - Test với xcrun simctl openurl
   ```

2. **Build errors:**
   ```bash
   # Clean build folder
   cd ios
   rm -rf build/
   rm -rf Pods/
   rm Podfile.lock
   pod install
   cd ..
   npx react-native run-ios
   ```

3. **Linker errors:**
   ```
   - Check Framework Search Paths
   - Verify Library Search Paths
   - Enable "Allow Non-modular Includes"
   ```

4. **Permissions issues:**
   ```
   - Add NSCameraUsageDescription
   - Add NSPhotoLibraryUsageDescription
   - Configure ATS properly
   ```

### Debug Commands:

```bash
# Check iOS logs
tail -f ~/Library/Logs/iOS\ Simulator/*/system.log | grep VNPay

# Check connected devices
xcrun xctrace list devices

# Check app installation
xcrun simctl list apps booted | grep vnpay

# Clean everything
npx react-native clean
cd ios && rm -rf build && cd ..
```

## 8. Production Configuration

### For App Store Release:

1. **Update Info.plist:**
   ```xml
   <!-- Remove or modify ATS exceptions for production -->
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <false/>
   </dict>
   ```

2. **Build Configuration:**
   ```
   - Set ENABLE_BITCODE = NO for VNPAY SDK compatibility
   - Configure proper Code Signing
   - Set deployment target to iOS 11.0+
   ```

3. **Test thoroughly:**
   ```bash
   # Build for release
   npx react-native run-ios --configuration Release
   
   # Archive for App Store
   # Use Xcode Archive function
   ```

## 9. Advanced Configuration

### Custom URL Scheme Handler:

```objc
// In AppDelegate.m
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  NSString *scheme = url.scheme;
  NSString *host = url.host;
  NSString *query = url.query;
  
  if ([scheme isEqualToString:@"vnpaymerchant"]) {
    // Parse query parameters
    NSURLComponents *components = [NSURLComponents componentsWithURL:url resolvingAgainstBaseURL:NO];
    NSArray *queryItems = components.queryItems;
    
    NSMutableDictionary *params = [NSMutableDictionary dictionary];
    for (NSURLQueryItem *item in queryItems) {
      [params setObject:item.value forKey:item.name];
    }
    
    // Send to React Native
    [[NSNotificationCenter defaultCenter] postNotificationName:@"VNPayDeepLink"
                                                        object:nil
                                                      userInfo:params];
    return YES;
  }
  
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

### React Native Listener:

```javascript
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.EventEmitter);

eventEmitter.addListener('VNPayDeepLink', (params) => {
  console.log('VNPay Deep Link:', params);
  // Handle deep link parameters
});
```