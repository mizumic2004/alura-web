import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  NativeEventEmitter,
  Linking,
  Platform
} from 'react-native';

// Import VNPAY SDK (sau khi đã copy folder vào project)
import VnpayMerchant, { VnpayMerchantModule } from './react-native-vnpay-merchant';

const VNPayIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cấu hình VNPAY
  const VNPAY_CONFIG = {
    scheme: "your_app_scheme", // Thay bằng scheme của app
    tmn_code: "YOUR_TMN_CODE", // Mã merchant từ VNPAY
    isSandBox: true, // true cho test, false cho production
  };

  useEffect(() => {
    setupVNPay();
    setupDeepLinkListener();
    
    return () => {
      cleanupListeners();
    };
  }, []);

  const setupVNPay = () => {
    const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);
    
    // Lắng nghe callback từ VNPAY SDK
    eventEmitter.addListener('PaymentBack', handlePaymentResult);
  };

  const setupDeepLinkListener = () => {
    // Xử lý deep link khi app được mở từ external app
    const handleDeepLink = (url) => {
      console.log('Deep link received:', url);
      // Xử lý URL return từ VNPAY
      if (url && url.includes('sdk.merchantbackapp')) {
        handleReturnFromVNPay(url);
      }
    };

    // Lắng nghe deep link
    Linking.addEventListener('url', handleDeepLink);
    
    // Kiểm tra nếu app được mở từ deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });
  };

  const handlePaymentResult = (result) => {
    console.log('Payment result:', result);
    setIsProcessing(false);
    
    if (result) {
      switch (result.resultCode) {
        case -1:
          Alert.alert('Thông báo', 'Người dùng đã hủy thanh toán');
          break;
        case 10:
          Alert.alert('Thông báo', 'Đang chuyển đến ứng dụng thanh toán...');
          break;
        case 97:
          Alert.alert('Thành công', 'Thanh toán thành công!');
          // Gọi API verify với server của bạn
          verifyPaymentWithServer(result);
          break;
        case 98:
          Alert.alert('Thất bại', 'Thanh toán không thành công');
          break;
        case 99:
          Alert.alert('Thông báo', 'Người dùng đã hủy thanh toán tại VNPAY');
          break;
        default:
          Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình thanh toán');
      }
    }
    
    // Cleanup listeners
    const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);
    eventEmitter.removeAllListeners('PaymentBack');
  };

  const handleReturnFromVNPay = (url) => {
    console.log('Return from VNPAY:', url);
    
    if (url.includes('success.sdk.merchantbackapp')) {
      // Thanh toán thành công
      Alert.alert('Thành công', 'Thanh toán đã được xử lý thành công!');
    } else if (url.includes('fail.sdk.merchantbackapp')) {
      // Thanh toán thất bại
      Alert.alert('Thất bại', 'Thanh toán không thành công');
    } else if (url.includes('cancel.sdk.merchantbackapp')) {
      // Người dùng hủy
      Alert.alert('Hủy', 'Người dùng đã hủy thanh toán');
    }
  };

  const verifyPaymentWithServer = async (paymentResult) => {
    try {
      // Gọi API server để verify kết quả thanh toán
      // Đây là bước quan trọng để đảm bảo tính chính xác của giao dịch
      const response = await fetch('YOUR_SERVER_VERIFY_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resultCode: paymentResult.resultCode,
          // Thêm các thông tin khác cần thiết
        }),
      });
      
      const data = await response.json();
      console.log('Server verification:', data);
      
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const generatePaymentUrl = async (amount, orderInfo) => {
    try {
      // Gọi API server để tạo payment URL
      const response = await fetch('YOUR_SERVER_CREATE_PAYMENT_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          orderInfo: orderInfo,
          returnUrl: 'http://success.sdk.merchantbackapp',
          // Các tham số khác theo yêu cầu của VNPAY
        }),
      });
      
      const data = await response.json();
      return data.paymentUrl;
      
    } catch (error) {
      console.error('Error creating payment URL:', error);
      Alert.alert('Lỗi', 'Không thể tạo URL thanh toán');
      return null;
    }
  };

  const initiatePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Tạo payment URL từ server
      const paymentUrl = await generatePaymentUrl(100000, 'Thanh toan don hang');
      
      if (!paymentUrl) {
        setIsProcessing(false);
        return;
      }

      // Mở VNPAY SDK
      VnpayMerchant.show({
        scheme: VNPAY_CONFIG.scheme,
        isSandBox: VNPAY_CONFIG.isSandBox,
        paymentUrl: paymentUrl,
        tmn_code: VNPAY_CONFIG.tmn_code,
        backAlert: "Bạn có muốn thoát thanh toán?",
        title: "Thanh toán VNPAY",
        titleColor: "#333333",
        beginColor: "#ffffff",
        endColor: "#ffffff",
        iconBackName: "icon_back" // Tên icon trong bundle
      });
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán');
      setIsProcessing(false);
    }
  };

  const cleanupListeners = () => {
    const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);
    eventEmitter.removeAllListeners('PaymentBack');
    Linking.removeAllListeners('url');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VNPAY Payment Integration</Text>
      
      <View style={styles.paymentInfo}>
        <Text style={styles.infoText}>Số tiền: 100,000 VNĐ</Text>
        <Text style={styles.infoText}>Nội dung: Thanh toán đơn hàng</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, isProcessing && styles.disabledButton]}
        onPress={initiatePayment}
        disabled={isProcessing}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Đang xử lý...' : 'Thanh toán với VNPAY'}
        </Text>
      </TouchableOpacity>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Lưu ý:</Text>
        <Text style={styles.noteText}>• Hỗ trợ thanh toán qua ứng dụng ngân hàng</Text>
        <Text style={styles.noteText}>• Thanh toán qua thẻ ATM/Credit Card</Text>
        <Text style={styles.noteText}>• Thanh toán qua QR Code</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  paymentInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noteText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default VNPayIntegration;