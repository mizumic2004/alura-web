# Cấu hình Android cho VNPAY SDK

## 1. Cấu hình build.gradle (Project level)

**File: `android/build.gradle`**

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url "https://www.jitpack.io" }
        // Thêm repository cho VNPAY SDK
        maven { 
            url("./node_modules/react-native-vnpay-merchant/android/repo") 
        }
    }
}
```

## 2. Cấu hình build.gradle (App level)

**File: `android/app/build.gradle`**

```gradle
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    
    defaultConfig {
        applicationId "com.yourapp.vnpay"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        
        // Thêm cấu hình cho VNPAY
        manifestPlaceholders = [
            appAuthRedirectScheme: 'vnpaymerchant'
        ]
    }
    
    buildTypes {
        debug {
            debuggable true
        }
        release {
            // Cấu hình cho production
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation "com.facebook.react:react-native:+"
    
    // VNPAY SDK dependencies
    implementation 'androidx.appcompat:appcompat:1.4.2'
    implementation 'com.google.android.material:material:1.6.1'
    
    // Nếu có conflict với dependencies khác
    implementation 'androidx.core:core:1.8.0'
    implementation 'androidx.fragment:fragment:1.5.1'
}
```

## 3. Cấu hình AndroidManifest.xml

**File: `android/app/src/main/AndroidManifest.xml`**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourapp.vnpay">

    <!-- Permissions required -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <!-- Main Activity -->
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true"
            android:screenOrientation="portrait">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep Link cho VNPAY -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="vnpaymerchant" />
            </intent-filter>
            
            <!-- Deep Link cho return URL -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="http" 
                      android:host="success.sdk.merchantbackapp" />
            </intent-filter>
            
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="http" 
                      android:host="fail.sdk.merchantbackapp" />
            </intent-filter>
            
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="http" 
                      android:host="cancel.sdk.merchantbackapp" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 4. Cấu hình MainApplication.java

**File: `android/app/src/main/java/com/yourapp/vnpay/MainApplication.java`**

```java
package com.yourapp.vnpay;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

// Import VNPAY package
import vn.vnpay.merchant.VnpayMerchantPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          
          // Thêm VNPAY package
          packages.add(new VnpayMerchantPackage());
          
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.yourapp.vnpay.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
```

## 5. Cấu hình MainActivity.java

**File: `android/app/src/main/java/com/yourapp/vnpay/MainActivity.java`**

```java
package com.yourapp.vnpay;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.content.Intent;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "VNPayMobileApp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
```

## 6. Cấu hình ProGuard (cho Release build)

**File: `android/app/proguard-rules.pro`**

```pro
# Add project specific ProGuard rules here.

# VNPAY SDK ProGuard rules
-keep class vn.vnpay.** { *; }
-keep class com.vnpay.** { *; }
-dontwarn vn.vnpay.**
-dontwarn com.vnpay.**

# Keep React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# General Android rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Gson rules (if using)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
```

## 7. Cấu hình strings.xml

**File: `android/app/src/main/res/values/strings.xml`**

```xml
<resources>
    <string name="app_name">VNPay Mobile App</string>
    
    <!-- VNPAY related strings -->
    <string name="vnpay_scheme">vnpaymerchant</string>
    <string name="payment_processing">Đang xử lý thanh toán...</string>
    <string name="payment_cancelled">Thanh toán đã bị hủy</string>
</resources>
```

## 8. Testing Deep Links

### Test bằng ADB Commands:

```bash
# Test success deep link
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "vnpaymerchant://payment-return?result=success" \
  com.yourapp.vnpay

# Test fail deep link  
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "vnpaymerchant://payment-return?result=fail" \
  com.yourapp.vnpay

# Test cancel deep link
adb shell am start \
  -W -a android.intent.action.VIEW \
  -d "vnpaymerchant://payment-return?result=cancel" \
  com.yourapp.vnpay
```

## 9. Troubleshooting

### Common Issues:

1. **Deep link không hoạt động:**
   - Kiểm tra scheme trong AndroidManifest.xml
   - Verify intent-filter configuration
   - Test với adb command

2. **SDK crash:**
   - Kiểm tra ProGuard rules
   - Verify dependencies trong build.gradle
   - Check log với `adb logcat`

3. **Build error:**
   - Clean và rebuild project
   - Check repository URL trong build.gradle
   - Verify SDK files đã copy đúng vị trí

### Debug Commands:

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android

# Check logs
adb logcat | grep -i vnpay

# Check installed packages
adb shell pm list packages | grep vnpay
```