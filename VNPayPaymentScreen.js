import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import VNPayService from '../services/VNPayService';

const VNPayPaymentScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('100000');
  const [orderInfo, setOrderInfo] = useState('Thanh toán đơn hàng');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Nhận dữ liệu từ route params nếu có
  const { orderData } = route?.params || {};

  useEffect(() => {
    // Khởi tạo VNPAY Service
    initializeVNPayService();
    
    // Load dữ liệu đơn hàng nếu có
    if (orderData) {
      setAmount(orderData.amount?.toString() || '100000');
      setOrderInfo(orderData.orderInfo || 'Thanh toán đơn hàng');
    }

    return () => {
      // Cleanup khi component unmount
      VNPayService.cleanup();
    };
  }, [orderData]);

  const initializeVNPayService = () => {
    VNPayService.initialize({
      scheme: 'vnpaymerchant', // Thay bằng scheme thực tế của app
      tmn_code: 'YOUR_TMN_CODE', // Thay bằng mã merchant thực tế
      isSandBox: true, // false cho production
      api_base_url: 'https://your-server.com/api', // URL server của bạn
    });
  };

  const handlePayment = async () => {
    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!orderInfo.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung thanh toán');
      return;
    }

    setIsLoading(true);

    const paymentData = {
      amount: parseFloat(amount),
      orderInfo: orderInfo.trim(),
      orderType: 'billpayment',
      title: 'Thanh toán VNPAY',
    };

    // Thực hiện thanh toán
    VNPayService.initiatePayment(paymentData, (result) => {
      setIsLoading(false);
      handlePaymentResult(result);
    });
  };

  const handlePaymentResult = (result) => {
    console.log('Payment Result:', result);

    // Thêm vào lịch sử thanh toán
    const newPayment = {
      id: Date.now(),
      amount: amount,
      orderInfo: orderInfo,
      timestamp: new Date().toLocaleString('vi-VN'),
      success: result.success,
      code: result.code,
      message: result.message,
    };

    setPaymentHistory(prev => [newPayment, ...prev]);

    // Hiển thị kết quả
    if (result.success) {
      Alert.alert(
        'Thanh toán thành công!',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate về màn hình trước hoặc home
              // navigation.goBack();
            }
          }
        ]
      );
    } else {
      Alert.alert('Thanh toán thất bại', result.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const PaymentMethodCard = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.methodCard} onPress={onPress}>
      <View style={styles.methodIcon}>
        <Text style={styles.methodIconText}>{icon}</Text>
      </View>
      <View style={styles.methodContent}>
        <Text style={styles.methodTitle}>{title}</Text>
        <Text style={styles.methodDescription}>{description}</Text>
      </View>
      <Text style={styles.methodArrow}>›</Text>
    </TouchableOpacity>
  );

  const PaymentHistoryItem = ({ item }) => (
    <View style={[styles.historyItem, { borderLeftColor: item.success ? '#4CAF50' : '#F44336' }]}>
      <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
      <Text style={styles.historyInfo}>{item.orderInfo}</Text>
      <Text style={styles.historyTime}>{item.timestamp}</Text>
      <Text style={[styles.historyStatus, { color: item.success ? '#4CAF50' : '#F44336' }]}>
        {item.success ? 'Thành công' : 'Thất bại'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thanh toán VNPAY</Text>
          <View style={styles.vnpayLogo}>
            <Text style={styles.vnpayLogoText}>VNPAY</Text>
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số tiền (VNĐ)</Text>
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Nhập số tiền"
              keyboardType="numeric"
              editable={!isLoading}
            />
            <Text style={styles.amountDisplay}>{formatCurrency(parseFloat(amount) || 0)}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nội dung thanh toán</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={orderInfo}
              onChangeText={setOrderInfo}
              placeholder="Nhập nội dung thanh toán"
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          
          <PaymentMethodCard
            icon="🏦"
            title="Ứng dụng ngân hàng"
            description="Thanh toán qua Mobile Banking"
            onPress={handlePayment}
          />
          
          <PaymentMethodCard
            icon="💳"
            title="Thẻ ATM/Credit Card"
            description="Thanh toán qua thẻ ngân hàng"
            onPress={handlePayment}
          />
          
          <PaymentMethodCard
            icon="📱"
            title="QR Code"
            description="Quét mã QR để thanh toán"
            onPress={handlePayment}
          />

          {/* Payment Button */}
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isLoading || VNPayService.isPaymentProcessing}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.payButtonText}>Thanh toán ngay</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Lịch sử thanh toán</Text>
            {paymentHistory.slice(0, 5).map((item) => (
              <PaymentHistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Thông tin</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>Giao dịch được bảo mật SSL 256-bit</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoText}>Xử lý thanh toán nhanh chóng</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏆</Text>
            <Text style={styles.infoText}>Hỗ trợ 24/7 từ VNPAY</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  vnpayLogo: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  vnpayLogoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  amountDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIconText: {
    fontSize: 20,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  methodArrow: {
    fontSize: 20,
    color: '#999',
  },
  payButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyItem: {
    padding: 12,
    borderLeftWidth: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyInfo: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    right: 12,
    top: 12,
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});

export default VNPayPaymentScreen;