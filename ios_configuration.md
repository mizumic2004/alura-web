# Cấu hình iOS cho VNPAY SDK

## 1. Cập nhật Podfile

```ruby
# ios/Podfile
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '11.0'
install! 'cocoapods', :deterministic_uuids => false

target 'YourAppName' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    :flipper_configuration => FlipperConfiguration.enabled,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # VNPAY SDK pods (nếu cần)
  # pod 'VNPaySDK', :path => '../node_modules/react-native-vnpay-merchant/ios'

  target 'YourAppNameTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
    
    # Fix cho iOS deployment target
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '11.0'
      end
    end
  end
end
```

## 2. Cập nhật Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Các config khác... -->
    
    <!-- URL Schemes cho Deep Link -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>your.app.scheme</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>your_app_scheme</string>
            </array>
        </dict>
    </array>
    
    <!-- App Transport Security Settings -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
        <key>NSExceptionDomains</key>
        <dict>
            <key>sandbox.vnpayment.vn</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSExceptionMinimumTLSVersion</key>
                <string>TLSv1.0</string>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
            <key>vnpayment.vn</key>
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
    
    <!-- Query Schemes cho các app banking -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>vnpayapp</string>
        <string>vnpay</string>
        <string>smartpay</string>
        <string>vnpaypos</string>
        <string>mbmobile</string>
        <string>vcbmobile</string>
        <string>bidvsmartbanking</string>
        <string>techcombank</string>
        <string>tpbmobile</string>
        <string>vpbankonline</string>
        <string>acbapp</string>
        <string>shbmobile</string>
        <string>msb</string>
        <string>vibpay</string>
        <string>saigonbank</string>
        <string>eximbank</string>
        <string>namabank</string>
        <string>vietcapitalbank</string>
        <string>dongabank</string>
        <string>kienlongbank</string>
        <string>baoviethomebank</string>
        <string>gpbank</string>
        <string>hdbank</string>
        <string>oceanbank</string>
        <string>pvcombank</string>
        <string>seabank</string>
        <string>vietbank</string>
        <string>vietinbank</string>
        <string>agribank</string>
        <string>abbank</string>
        <string>baovietbank</string>
        <string>ncb</string>
        <string>payoo</string>
        <string>momo</string>
        <string>zalopay</string>
    </array>
    
    <!-- Permissions -->
    <key>NSCameraUsageDescription</key>
    <string>This app needs access to camera to scan QR codes for payment</string>
    
    <key>NSPhotoLibraryUsageDescription</key>
    <string>This app needs access to photo library to select QR code images</string>
    
</dict>
</plist>
```

## 3. Cập nhật AppDelegate.h

```objc
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// Import VNPAY headers nếu cần
// #import <CallAppSDK/CallAppInterface.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
```

## 4. Cập nhật AppDelegate.m

```objc
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

// Import VNPAY SDK nếu cần
// #import <CallAppSDK/CallAppInterface.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  [self initializeFlipper:application];
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"YourAppName"
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

// Xử lý Deep Link cho VNPAY
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  NSLog(@"Received URL: %@", url.absoluteString);
  
  // Xử lý URL từ VNPAY
  if ([url.scheme isEqualToString:@"your_app_scheme"]) {
    // Handle VNPAY deep link
    NSLog(@"VNPAY URL received: %@", url.absoluteString);
  }
  
  // Chuyển tiếp cho React Native Linking
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Xử lý Universal Link (nếu cần)
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#ifdef FB_SONARKIT_ENABLED
- (void) initializeFlipper:(UIApplication *)application {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@end
```

## 5. Build Settings trong Xcode

### 5.1 Deployment Target
- Mở project trong Xcode
- Chọn target của app
- Đặt **iOS Deployment Target** = 11.0 trở lên

### 5.2 Build Settings
```
- Enable Bitcode: NO (nếu VNPAY SDK không hỗ trợ)
- Allow Non-modular Includes In Framework Modules: YES
- Always Embed Swift Standard Libraries: YES (nếu có Swift code)
```

### 5.3 Signing & Capabilities
- Đảm bảo Bundle Identifier đúng
- Cấu hình App Groups (nếu cần)
- Thêm Associated Domains (nếu sử dụng Universal Links)

## 6. Xcode Project Configuration

### 6.1 Thêm URL Scheme trong Xcode
1. Mở project trong Xcode
2. Chọn target của app
3. Vào tab **Info**
4. Mở **URL Types**
5. Thêm URL Scheme: `your_app_scheme`

### 6.2 Linked Frameworks (nếu cần manual linking)
Thêm các frameworks sau vào **Linked Frameworks and Libraries**:
- CallAppSDK.framework (từ VNPAY SDK)
- CFNetwork.framework
- SystemConfiguration.framework
- Foundation.framework
- UIKit.framework
- Security.framework

## 7. Cấu hình Network cho iOS 14+

Thêm vào Info.plist cho iOS 14+:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This app uses tracking to provide better payment experience</string>

<key>SKAdNetworkItems</key>
<array>
    <!-- Thêm các SKAdNetwork IDs nếu cần -->
</array>
```

## 8. Build script (nếu cần)

Thêm vào Build Phases > New Run Script Phase:

```bash
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh

# Copy VNPAY resources nếu cần
cp -R "${SRCROOT}/../node_modules/react-native-vnpay-merchant/ios/VNPaySDK.bundle" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/"
```

## 9. Debugging Deep Links

### 9.1 Test trên Simulator
```bash
xcrun simctl openurl booted "your_app_scheme://payment?result=success"
```

### 9.2 Test trên Device
Sử dụng Safari để mở: `your_app_scheme://test`

### 9.3 Logs
Kiểm tra logs trong Xcode Console để debug:
```objc
NSLog(@"URL received: %@", url.absoluteString);
```

## 10. Build và chạy

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## Lưu ý quan trọng:

1. **Bundle Identifier**: Phải match với cấu hình trên VNPAY Portal
2. **URL Scheme**: Phải unique và không trung với app khác
3. **ATS Settings**: Cần allow VNPAY domains
4. **Query Schemes**: Thêm các banking apps để check availability
5. **Permissions**: Camera/Photo cho QR scanning
6. **Testing**: Test trên device thật để đảm bảo deep link hoạt động
7. **App Store**: Xóa NSAllowsArbitraryLoads khi release production

## Troubleshooting:

1. **Deep link không hoạt động**: Kiểm tra URL scheme config
2. **Build failed**: Kiểm tra pod install và dependencies
3. **SDK không load**: Kiểm tra framework linking
4. **Network error**: Kiểm tra ATS settings và firewall