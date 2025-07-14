# Hướng dẫn tích hợp VNPAY Mobile SDK cho React Native

## 1. Tổng quan

VNPAY Mobile SDK cho phép tích hợp cổng thanh toán VNPAY vào ứng dụng React Native, hỗ trợ thanh toán qua:
- Deep-link apps (VNPAY, Banking apps)
- ATM/Thẻ quốc tế
- QR Code

## 2. Yêu cầu hệ thống

- React Native >= 0.60.0
- iOS 9.0+
- Android API Level 16+

## 3. Cài đặt và cấu hình

### Bước 1: Copy thư mục SDK
```bash
# Copy folder react-native-vnpay-merchant vào project của bạn
```

### Bước 2: Cập nhật package.json
```json
{
  "dependencies": {
    "react-native-vnpay-merchant": "file:./react-native-vnpay-merchant"
  }
}
```

### Bước 3: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install

# Cho iOS
cd ios && pod install
```

## 4. Cấu hình Android

### Cập nhật android/build.gradle
```gradle
allprojects {
    repositories {
        maven { url("<path to react-native-vnpay-merchant/android/repo>") }
        // ... other repositories
    }
}
```

### Cập nhật AndroidManifest.xml
```xml
<activity
    android:name="your.activity"
    android:screenOrientation="portrait">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.BROWSABLE" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:scheme="your_scheme" />
    </intent-filter>
</activity>
```

## 5. Cấu hình iOS

### Cập nhật AppDelegate.m
```objc
#import <CallAppSDK/CallAppInterface.h>

@implementation AppDelegate

// ... existing code ...

@end
```

### Cập nhật Info.plist
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>your.app.scheme</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>your_scheme</string>
        </array>
    </dict>
</array>
```

## 6. Sử dụng trong React Native

### Import module
```javascript
import VnpayMerchant, { VnpayMerchantModule } from './react-native-vnpay-merchant';
```

### Khởi tạo SDK
```javascript
const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

// Lắng nghe kết quả thanh toán
eventEmitter.addListener('PaymentBack', (e) => {
    console.log('SDK back!');
    if (e) {
        console.log("e.resultCode = " + e.resultCode);
        switch (e.resultCode) {
            case -1:
                // Người dùng nhấn back từ SDK để quay lại
                break;
            case 10:
                // Người dùng nhấn chọn mở thanh toán qua app thành toán (Mobile Banking, Vi...)
                break;
            case 99:
                // User hủy thanh toán tại Cổng VNPAY-QR
                // Có action này trả về từ sdk, từ đâu return url cần redirect về URL:
                // http://cancel.sdk.merchantbackapp
                break;
            case 98:
                // Kết quả thanh toán không thành công từ phương thức ATM, Tài khoản, thẻ quốc tế.
                // Có action này trả về từ sdk, từ đâu return url cần redirect về URL:
                // http://fail.sdk.merchantbackapp
                break;
            case 97:
                // Kết quả thanh toán thành công từ phương thức ATM,Tài khoản, thẻ quốc tế hoặc scanQR.
                // Có action này trả về từ sdk, từ đâu return url cần redirect về URL:
                // http://success.sdk.merchantbackapp
                break;
        }
    }
    
    // Khởi tạo lại SDK
    eventEmitter.removeAllListeners('PaymentBack');
});
```

### Mở SDK thanh toán
```javascript
const openSDK = () => {
    const scheme = "your_scheme"; // Scheme cho deeplink
    const isSandBox = true; // true cho môi trường test, false cho production
    
    VnpayMerchant.show({
        scheme: scheme,
        isSandBox: isSandBox,
        paymentUrl: "your_payment_url", // URL thanh toán từ server
        tmn_code: "your_tmn_code", // Mã merchant
        backAlert: "Bạn có muốn thoát thanh toán?",
        title: "Thanh toán",
        titleColor: "#333333",
        beginColor: "#ffffff",
        endColor: "#ffffff",
        iconBackName: "icon_back"
    });
};
```

## 7. Xử lý Deep Link

### Cấu hình scheme trong package.json
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest --ci --coverage --watchAll=false"
  }
}
```

### Xử lý deep link trong App.js
```javascript
import { Linking } from 'react-native';

useEffect(() => {
    const handleDeepLink = (url) => {
        // Xử lý URL trả về từ VNPAY
        console.log('Deep link URL:', url);
    };
    
    Linking.addEventListener('url', handleDeepLink);
    
    return () => {
        Linking.removeEventListener('url', handleDeepLink);
    };
}, []);
```

## 8. Các tham số SDK

| Tham số | Mô tả |
|---------|-------|
| url | URL thanh toán được tạo theo đặc tả kết nối Cổng thanh toán (mục 2.5.3.1 trong file VNPAY Payment Gateway_Techspec 2.0.1-VN) |
| scheme | Schemes của APP TMĐT: Khi thanh toán thành công ứng dụng Mobile Banking/Ví điện tử sẽ gọi mở lại Scheme ứng dụng của bạn |
| tmn_code | vnp_TmnCode được VNPAY cung cấp khi thực hiện kết nối với hệ thống của VNPAY |
| isSandBox | Cấu hình True or False để chuyển hướng môi trường Sandbox hoặc Production của VNPAY |

## 9. Lưu ý quan trọng

1. **Môi trường Test vs Production:**
   - Test: `isSandBox = true`
   - Production: `isSandBox = false`

2. **URL Return:**
   - Success: `http://success.sdk.merchantbackapp`
   - Fail: `http://fail.sdk.merchantbackapp`
   - Cancel: `http://cancel.sdk.merchantbackapp`

3. **Xử lý kết quả:**
   - Luôn kiểm tra kết quả từ server để đảm bảo tính chính xác
   - Không dựa hoàn toàn vào kết quả từ SDK

## 10. Troubleshooting

### Lỗi thường gặp:
1. **Deep link không hoạt động:** Kiểm tra cấu hình scheme
2. **SDK không mở:** Kiểm tra URL thanh toán và tham số
3. **Crash trên iOS:** Kiểm tra cấu hình Info.plist

### Debug:
```javascript
// Bật log để debug
console.log('Payment URL:', paymentUrl);
console.log('Scheme:', scheme);
console.log('TMN Code:', tmn_code);
```

## 11. Contact

Để được hỗ trợ, vui lòng liên hệ:
- VNPAY Technical Support
- Tài liệu API: [VNPAY Documentation]