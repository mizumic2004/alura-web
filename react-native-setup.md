# Hướng dẫn Setup React Native Project với VNPAY

## 1. Tạo React Native Project

```bash
# Tạo project mới
npx react-native@latest init VNPayMobileApp
cd VNPayMobileApp

# Hoặc nếu sử dụng Expo
npx create-expo-app VNPayMobileApp --template
cd VNPayMobileApp
```

## 2. Cấu trúc thư mục cho VNPAY Integration

```
VNPayMobileApp/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   └── VNPayPayment.js
│   ├── services/
│   │   └── VNPayService.js
│   └── utils/
│       └── constants.js
├── react-native-vnpay-merchant/ (copy từ SDK)
└── package.json
```

## 3. Dependencies cần thiết

```json
{
  "dependencies": {
    "react-native-vnpay-merchant": "file:./react-native-vnpay-merchant",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "react-native-device-info": "^10.11.0"
  }
}
```

## 4. Commands cài đặt

```bash
# Cài đặt dependencies
npm install

# iOS
cd ios && pod install && cd ..

# Android
npx react-native run-android

# iOS
npx react-native run-ios
```