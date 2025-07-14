# Checklist tích hợp VNPAY React Native

## ✅ Chuẩn bị trước khi bắt đầu

- [ ] Đã có tài khoản VNPAY Merchant và nhận được TMN_CODE
- [ ] Đã có thông tin cấu hình từ VNPAY (sandbox/production URLs)
- [ ] Đã setup server backend để tạo payment URLs và verify payments
- [ ] Đã có React Native project đang hoạt động
- [ ] Đã backup project hiện tại

## ✅ Setup SDK

- [ ] Copy folder `react-native-vnpay-merchant` vào project
- [ ] Cập nhật `package.json` với dependency mới
- [ ] Chạy `npm install` hoặc `yarn install`
- [ ] Kiểm tra SDK đã được import đúng trong code

## ✅ Cấu hình Android

### Build Configuration
- [ ] Cập nhật `android/build.gradle` (project level) với VNPAY repository
- [ ] Cập nhật `android/app/build.gradle` với scheme configuration
- [ ] Thêm scheme vào `strings.xml`

### Manifest Configuration
- [ ] Thêm Internet permissions vào `AndroidManifest.xml`
- [ ] Thêm deep link intent filter với scheme của app
- [ ] Cấu hình activity với `singleTask` launch mode
- [ ] Thêm network security config (nếu cần)

### Code Changes
- [ ] Cập nhật `MainActivity.java` để handle deep links
- [ ] Cập nhật `MainApplication.java` (nếu cần manual linking)
- [ ] Thêm ProGuard rules (nếu sử dụng)

### Testing Android
- [ ] Build thành công: `npx react-native run-android`
- [ ] Test deep link: `adb shell am start -W -a android.intent.action.VIEW -d "your_scheme://test" com.yourapp.package`
- [ ] Kiểm tra logs trong Android Studio

## ✅ Cấu hình iOS

### Podfile & Dependencies
- [ ] Cập nhật `Podfile` với VNPAY pods (nếu cần)
- [ ] Chạy `cd ios && pod install`
- [ ] Kiểm tra iOS deployment target >= 11.0

### Info.plist Configuration
- [ ] Thêm URL Schemes cho deep linking
- [ ] Cấu hình App Transport Security cho VNPAY domains
- [ ] Thêm query schemes cho banking apps
- [ ] Thêm camera/photo permissions (cho QR scanning)

### Code Changes
- [ ] Cập nhật `AppDelegate.h` với imports cần thiết
- [ ] Cập nhật `AppDelegate.m` để handle deep links
- [ ] Implement `openURL` method cho deep link handling
- [ ] Implement `continueUserActivity` cho Universal Links (nếu cần)

### Xcode Configuration
- [ ] Cấu hình Bundle Identifier đúng
- [ ] Thêm URL Scheme trong Xcode project settings
- [ ] Kiểm tra signing & capabilities
- [ ] Set build settings phù hợp (Bitcode, etc.)

### Testing iOS
- [ ] Build thành công: `npx react-native run-ios`
- [ ] Test deep link trên simulator: `xcrun simctl openurl booted "your_scheme://test"`
- [ ] Test trên device thật
- [ ] Kiểm tra logs trong Xcode Console

## ✅ React Native Code Implementation

### Component Setup
- [ ] Import VNPAY SDK modules
- [ ] Setup NativeEventEmitter cho PaymentBack events
- [ ] Implement deep link listening với React Native Linking
- [ ] Handle app state changes và cleanup listeners

### Payment Flow
- [ ] Implement function tạo payment URL từ server
- [ ] Implement function mở VNPAY SDK với đúng parameters
- [ ] Handle payment results với switch case cho các result codes
- [ ] Implement verification với server backend

### Error Handling
- [ ] Handle network errors
- [ ] Handle SDK initialization errors
- [ ] Handle deep link parsing errors
- [ ] Show appropriate user messages

### UI/UX
- [ ] Implement loading states
- [ ] Disable payment button khi đang processing
- [ ] Show payment information clearly
- [ ] Handle back button appropriately

## ✅ Server Backend Integration

### Payment URL Creation
- [ ] Implement API endpoint tạo VNPAY payment URL
- [ ] Validate request parameters
- [ ] Generate secure payment URL với đúng format
- [ ] Set appropriate return URLs

### Payment Verification
- [ ] Implement IPN (Instant Payment Notification) endpoint
- [ ] Verify payment signature từ VNPAY
- [ ] Update order status trong database
- [ ] Return appropriate response to VNPAY

### Security
- [ ] Validate all incoming requests
- [ ] Use secure hash algorithms
- [ ] Implement rate limiting
- [ ] Log all payment transactions

## ✅ Testing

### Unit Testing
- [ ] Test payment URL generation
- [ ] Test deep link parsing
- [ ] Test event handling
- [ ] Test error scenarios

### Integration Testing
- [ ] Test full payment flow trong sandbox
- [ ] Test với different payment methods
- [ ] Test app switching to banking apps
- [ ] Test return từ banking apps

### Device Testing
- [ ] Test trên Android devices khác nhau
- [ ] Test trên iOS devices khác nhau
- [ ] Test với different OS versions
- [ ] Test network conditions (3G, 4G, WiFi)

### Banking Apps Testing
- [ ] Test với VNPAY app
- [ ] Test với major banking apps (MB, VCB, Techcombank, etc.)
- [ ] Test khi banking app không được cài đặt
- [ ] Test browser fallback

## ✅ Production Deployment

### Configuration
- [ ] Switch từ sandbox sang production URLs
- [ ] Update TMN_CODE cho production
- [ ] Remove debug logs
- [ ] Update network security configs

### App Store Submission
- [ ] Remove NSAllowsArbitraryLoads từ iOS Info.plist
- [ ] Ensure all permissions có proper descriptions
- [ ] Test trên production environment
- [ ] Submit for review

### Monitoring
- [ ] Setup payment monitoring
- [ ] Setup error tracking
- [ ] Monitor deep link performance
- [ ] Setup alerting cho failed payments

## ✅ Documentation & Maintenance

- [ ] Document cấu hình cho team
- [ ] Document troubleshooting steps
- [ ] Setup CI/CD cho testing
- [ ] Plan for SDK updates
- [ ] Document rollback procedures

## 🚨 Common Issues Checklist

### Deep Link Issues
- [ ] Scheme được cấu hình đúng và unique
- [ ] Intent filters đúng format
- [ ] App không bị killed bởi system
- [ ] URL được handle đúng cách

### Payment Issues
- [ ] Payment URL đúng format
- [ ] Server signatures đúng
- [ ] Network connectivity tốt
- [ ] Banking app compatibility

### Build Issues
- [ ] Dependencies được install đúng
- [ ] Native modules được link
- [ ] Build configurations đúng
- [ ] No conflicting libraries

## 📱 Device Testing Matrix

### Android Testing
- [ ] Android 7.0+ (API 24+)
- [ ] Different screen sizes
- [ ] Different manufacturers (Samsung, Huawei, Xiaomi)
- [ ] With/without banking apps installed

### iOS Testing
- [ ] iOS 11.0+
- [ ] iPhone và iPad
- [ ] Different iOS versions
- [ ] With/without banking apps installed

## 🔧 Performance Checklist

- [ ] App launch time acceptable
- [ ] Payment flow smooth
- [ ] Memory usage reasonable
- [ ] Battery usage optimized
- [ ] Network requests optimized

## 🛡️ Security Checklist

- [ ] No sensitive data in logs
- [ ] Secure key storage
- [ ] Network traffic encrypted
- [ ] Input validation implemented
- [ ] Error messages don't expose internals

---

## ✅ Final Verification

- [ ] All checklist items completed
- [ ] Full payment flow tested end-to-end
- [ ] Error scenarios handled gracefully
- [ ] Performance meets requirements
- [ ] Security requirements satisfied
- [ ] Ready for production deployment

**Ghi chú:** Đây là checklist tổng quan. Tùy vào project cụ thể, bạn có thể cần thêm hoặc bỏ một số items.