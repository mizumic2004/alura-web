# Cấu hình Android cho VNPAY SDK

## 1. Cập nhật android/build.gradle (Project level)

```gradle
allprojects {
    repositories {
        google()
        jcenter()
        maven { url "https://www.jitpack.io" }
        // Thêm repository cho VNPAY SDK
        maven { url("path/to/react-native-vnpay-merchant/android/repo") }
        // Hoặc nếu sử dụng từ $rootDir
        maven { url "$rootDir/../node_modules/react-native-vnpay-merchant/android/repo" }
    }
}
```

## 2. Cập nhật android/app/build.gradle

```gradle
android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    
    defaultConfig {
        applicationId "com.yourapp.package"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        
        // Thêm resValue cho scheme
        resValue "string", "vnpay_scheme", "your_app_scheme"
    }
}

dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.facebook.react:react-native:+"
    
    // Các dependencies khác...
}
```

## 3. Cập nhật AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourapp.package">

    <!-- Internet permission cho thanh toán -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:screenOrientation="portrait"
            android:exported="true">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep link intent filter cho VNPAY -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="@string/vnpay_scheme" />
            </intent-filter>
            
        </activity>
        
        <!-- Activity để xử lý return từ browser -->
        <activity
            android:name="com.facebook.react.devsupport.DevSettingsActivity"
            android:exported="false" />
            
    </application>
</manifest>
```

## 4. Cập nhật MainApplication.java

```java
package com.yourapp.package;

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

// Import VNPAY package nếu cần
// import vn.vnpay.merchant.VnpayMerchantPackage;

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
          
          // Thêm VNPAY package nếu cần manual linking
          // packages.add(new VnpayMerchantPackage());
          
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
}
```

## 5. Cập nhật MainActivity.java

```java
package com.yourapp.package;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// Import cho deep link handling
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "YourAppName";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Xử lý intent từ deep link
    handleIntent(getIntent());
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    handleIntent(intent);
  }

  private void handleIntent(Intent intent) {
    if (intent != null && intent.getData() != null) {
      Uri uri = intent.getData();
      // Log để debug
      android.util.Log.d("VNPAY", "Received URI: " + uri.toString());
      
      // Xử lý deep link từ VNPAY
      if (uri.getScheme() != null && uri.getScheme().equals("your_app_scheme")) {
        // Handle VNPAY return
      }
    }
  }
}
```

## 6. Thêm ProGuard rules (nếu sử dụng)

Tạo file `android/app/proguard-rules.pro`:

```proguard
# VNPAY SDK ProGuard rules
-keep class vn.vnpay.** { *; }
-keep class com.vnpay.** { *; }
-dontwarn vn.vnpay.**
-dontwarn com.vnpay.**

# React Native rules
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Other rules...
```

## 7. Strings.xml

Tạo file `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Your App Name</string>
    <string name="vnpay_scheme">your_app_scheme</string>
</resources>
```

## 8. Network Security Config (Android 9+)

Tạo file `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">sandbox.vnpayment.vn</domain>
        <domain includeSubdomains="true">vnpayment.vn</domain>
    </domain-config>
</network-security-config>
```

Và thêm vào AndroidManifest.xml:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

## 9. Build và chạy

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Lưu ý quan trọng:

1. **Scheme phải unique**: Đảm bảo `your_app_scheme` là duy nhất
2. **Permissions**: Kiểm tra các permission cần thiết
3. **ProGuard**: Thêm rules để không obfuscate VNPAY SDK
4. **Network Security**: Cho phép HTTP traffic với VNPAY domains
5. **Testing**: Test trên device thật để đảm bảo deep link hoạt động