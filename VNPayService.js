import {
  NativeEventEmitter,
  Linking,
  Alert,
  Platform
} from 'react-native';
import VnpayMerchant, { VnpayMerchantModule } from '../react-native-vnpay-merchant';
import AsyncStorage from '@react-native-async-storage/async-storage';

class VNPayService {
  constructor() {
    this.eventEmitter = new NativeEventEmitter(VnpayMerchantModule);
    this.paymentCallback = null;
    this.isProcessing = false;
    
    // Cấu hình mặc định
    this.config = {
      scheme: 'vnpaymerchant', // Thay bằng scheme của bạn
      tmn_code: 'YOUR_TMN_CODE', // Thay bằng mã merchant thực tế
      isSandBox: true, // false cho production
      api_base_url: 'https://your-server.com/api', // URL server của bạn
    };
  }

  // Khởi tạo VNPAY service
  initialize(config = {}) {
    this.config = { ...this.config, ...config };
    this.setupEventListeners();
    this.setupDeepLinkHandler();
  }

  // Setup event listeners
  setupEventListeners() {
    // Lắng nghe callback từ VNPAY SDK
    this.eventEmitter.addListener('PaymentBack', this.handlePaymentResult.bind(this));
    
    // Lắng nghe deep link
    Linking.addEventListener('url', this.handleDeepLink.bind(this));
    
    // Kiểm tra deep link khi app khởi động
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink(url);
      }
    });
  }

  // Setup deep link handler
  setupDeepLinkHandler() {
    console.log('Deep link handler setup completed');
  }

  // Xử lý kết quả thanh toán từ SDK
  handlePaymentResult(result) {
    console.log('VNPAY Payment Result:', result);
    this.isProcessing = false;
    
    if (!result) {
      this.invokeCallback({
        success: false,
        code: 'UNKNOWN_ERROR',
        message: 'Không nhận được kết quả từ VNPAY'
      });
      return;
    }

    switch (result.resultCode) {
      case -1:
        this.invokeCallback({
          success: false,
          code: 'USER_CANCELLED',
          message: 'Người dùng đã hủy thanh toán'
        });
        break;
        
      case 10:
        this.invokeCallback({
          success: false,
          code: 'APP_REDIRECT',
          message: 'Đang chuyển đến ứng dụng thanh toán...'
        });
        break;
        
      case 97:
        // Thanh toán thành công - cần verify với server
        this.verifyPaymentWithServer(result);
        break;
        
      case 98:
        this.invokeCallback({
          success: false,
          code: 'PAYMENT_FAILED',
          message: 'Thanh toán không thành công'
        });
        break;
        
      case 99:
        this.invokeCallback({
          success: false,
          code: 'USER_CANCELLED_AT_VNPAY',
          message: 'Người dùng đã hủy thanh toán tại VNPAY'
        });
        break;
        
      default:
        this.invokeCallback({
          success: false,
          code: 'UNKNOWN_ERROR',
          message: 'Có lỗi xảy ra trong quá trình thanh toán'
        });
    }
    
    // Cleanup listener
    this.eventEmitter.removeAllListeners('PaymentBack');
  }

  // Xử lý deep link
  handleDeepLink(url) {
    console.log('Deep link received:', url);
    
    if (!url || !url.includes('sdk.merchantbackapp')) {
      return;
    }

    if (url.includes('success.sdk.merchantbackapp')) {
      // Có thể lưu trữ thông tin để xử lý sau
      this.storePaymentResult('success');
    } else if (url.includes('fail.sdk.merchantbackapp')) {
      this.storePaymentResult('failed');
    } else if (url.includes('cancel.sdk.merchantbackapp')) {
      this.storePaymentResult('cancelled');
    }
  }

  // Lưu kết quả thanh toán
  async storePaymentResult(status) {
    try {
      await AsyncStorage.setItem('vnpay_payment_status', status);
    } catch (error) {
      console.error('Error storing payment result:', error);
    }
  }

  // Verify kết quả thanh toán với server
  async verifyPaymentWithServer(paymentResult) {
    try {
      const response = await fetch(`${this.config.api_base_url}/vnpay/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultCode: paymentResult.resultCode,
          transactionId: paymentResult.transactionId || '',
          // Thêm các thông tin khác cần thiết
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.invokeCallback({
          success: true,
          code: 'PAYMENT_SUCCESS',
          message: 'Thanh toán thành công!',
          data: data
        });
      } else {
        this.invokeCallback({
          success: false,
          code: 'VERIFICATION_FAILED',
          message: 'Xác thực thanh toán thất bại'
        });
      }
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      this.invokeCallback({
        success: false,
        code: 'VERIFICATION_ERROR',
        message: 'Lỗi kết nối khi xác thực thanh toán'
      });
    }
  }

  // Tạo URL thanh toán
  async createPaymentUrl(paymentData) {
    try {
      const response = await fetch(`${this.config.api_base_url}/vnpay/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          orderInfo: paymentData.orderInfo,
          orderType: paymentData.orderType || 'billpayment',
          returnUrl: `${this.config.scheme}://payment-return`,
          ipAddr: '127.0.0.1', // IP của thiết bị
          locale: 'vn',
          ...paymentData
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        return data.paymentUrl;
      } else {
        throw new Error(data.message || 'Không thể tạo URL thanh toán');
      }
      
    } catch (error) {
      console.error('Error creating payment URL:', error);
      throw error;
    }
  }

  // Khởi tạo thanh toán
  async initiatePayment(paymentData, callback) {
    if (this.isProcessing) {
      Alert.alert('Thông báo', 'Một giao dịch khác đang được xử lý');
      return;
    }

    this.isProcessing = true;
    this.paymentCallback = callback;

    try {
      // Tạo payment URL từ server
      const paymentUrl = await this.createPaymentUrl(paymentData);
      
      // Mở VNPAY SDK
      VnpayMerchant.show({
        scheme: this.config.scheme,
        isSandBox: this.config.isSandBox,
        paymentUrl: paymentUrl,
        tmn_code: this.config.tmn_code,
        backAlert: "Bạn có muốn thoát thanh toán?",
        title: paymentData.title || "Thanh toán VNPAY",
        titleColor: "#333333",
        beginColor: "#ffffff",
        endColor: "#ffffff",
        iconBackName: "icon_back"
      });
      
    } catch (error) {
      this.isProcessing = false;
      this.invokeCallback({
        success: false,
        code: 'INIT_ERROR',
        message: error.message || 'Không thể khởi tạo thanh toán'
      });
    }
  }

  // Gọi callback
  invokeCallback(result) {
    if (this.paymentCallback && typeof this.paymentCallback === 'function') {
      this.paymentCallback(result);
      this.paymentCallback = null;
    }
  }

  // Cleanup
  cleanup() {
    this.eventEmitter.removeAllListeners('PaymentBack');
    Linking.removeAllListeners('url');
    this.paymentCallback = null;
    this.isProcessing = false;
  }

  // Getter cho trạng thái
  get isPaymentProcessing() {
    return this.isProcessing;
  }
}

// Export singleton instance
export default new VNPayService();