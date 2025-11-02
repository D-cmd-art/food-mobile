import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { api } from '../utils/api';

import { useUserStore } from '../utils/store/userStore';
import { useCartStore } from '../utils/store/cartStore';
import { useMapStore } from '../utils/store/mapStore';
import { useOrder } from '../hooks/useOrder';

const DELIVERY_SLOTS = [
  { label: 'Select Delivery Time', value: '' },
  { label: 'Within 45 Mins', value: '45 min' },
  { label: '1 Hour Slot', value: '1_HOUR' },
  { label: '2 Hour Slot', value: '2_HOUR' },
];

const PAYMENT_OPTIONS = [
  { key: 'cashondelivery', label: '💵 Cash on Delivery (COD)' },
  { key: 'khalti', label: '📱 Khalti (Digital Payment)' },
];

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const RadioOption = ({ isSelected, label, onPress }) => (
  <TouchableOpacity
    style={[styles.radio, isSelected && styles.radioSelected]}
    onPress={onPress}
  >
    <Text style={styles.radioText}>{label}</Text>
  </TouchableOpacity>
);

export default function ConfirmOrder() {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0].key);
  const [deliveryTime, setDeliveryTime] = useState(DELIVERY_SLOTS[0].value);
  const [phone, setPhone] = useState('');

  const { mutate } = useOrder();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const location = useMapStore((state) => state.location);

  const CART_TOTAL = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createOrderPayload = () => {
    if (!deliveryTime) {
      Alert.alert('Missing Info', 'Please select a delivery time slot.');
      return null;
    }

    if (!phone) {
      Alert.alert('Missing Info', 'Please enter a delivery phone number.');
      return null;
    }

    const products = items.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    return {
      user: {
        name: user.name,
        id: user.id,
        phone,
        email: user.email,
      },
      location: {
        name: location.address,
        lat: location.latitude,
        lng: location.longitude,
      },
      totalPayment: parseFloat(CART_TOTAL),
      products,
      status: paymentMethod === 'cashondelivery' ? 'unpaid' : 'pending',
      deliveryNumber: phone,
      payment_method: paymentMethod,
    };
  };

  const handleConfirmOrder = async () => {
    const payload = createOrderPayload();
    if (!payload) return;

    // 🪙 Step 1: Always create the order first
    mutate(payload, {
      onSuccess: async (orderResponse) => {
        const orderId = orderResponse?.data?._id || 'order-' + Date.now();

        // ✅ CASE 1: Cash on Delivery
        if (paymentMethod === 'cashondelivery') {
          Alert.alert('Order Placed', 'Your order has been placed successfully!');
          clearCart();
          navigation.navigate('Tabs');
          return;
        }

        // ✅ CASE 2: Khalti Payment
        try {
          const khaltiPayload = {
            return_url: 'myapp://payment-success', // Replace with your deep link
            website_url: 'https://example.com', // Your website or Firebase Dynamic Link
            amount: Math.round(CART_TOTAL * 100), // convert to paisa
            purchase_order_id: orderId,
            purchase_order_name: 'Food Order',
          };

          const response = await api.post('/api/khalti/initiate', khaltiPayload);
          const { payment_url, pidx } = response.data.data;

          navigation.navigate('PaymentWebView', {
            paymentUrl: payment_url,
            onSuccess: async () => {
              try {
                // Verify payment after success
                await api.post('/api/khalti/verify', { pidx });
                Alert.alert('Success', 'Payment verified and order confirmed!');
                clearCart();
                navigation.replace('PaymentSuccess');
              } catch (verifyErr) {
                Alert.alert('Payment Verification Failed', 'Please contact support.');
              }
            },
          });
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to initiate Khalti payment.');
        }
      },
      onError: () => {
        Alert.alert('Order Failed', 'There was an issue placing your order.');
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Confirm Your Order</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <DetailRow label="Name:" value={user.name} />
          <DetailRow label="Email:" value={user.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>{location.address}</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Phone Number</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_OPTIONS.map((option) => (
            <RadioOption
              key={option.key}
              label={option.label}
              isSelected={paymentMethod === option.key}
              onPress={() => setPaymentMethod(option.key)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Delivery Time</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={deliveryTime}
              onValueChange={setDeliveryTime}
              style={styles.picker}
              mode="dropdown"
            >
              {DELIVERY_SLOTS.map((slot) => (
                <Picker.Item key={slot.value} label={slot.label} value={slot.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Order Total:</Text>
          <Text style={styles.totalAmount}>Rs. {CART_TOTAL.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleConfirmOrder}>
        <Text style={styles.buttonText}>
          {paymentMethod === 'cashondelivery' ? 'CONFIRM ORDER' : 'PAY WITH KHALTI'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  section: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#007AFF' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  addressText: { fontSize: 15, marginBottom: 10, color: '#333' },
  changeButton: { alignSelf: 'flex-start', marginTop: 5 },
  changeButtonText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  radio: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10, backgroundColor: '#fff' },
  radioSelected: { borderColor: '#007AFF', backgroundColor: '#cceeff', borderWidth: 2 },
  radioText: { fontSize: 16, fontWeight: '500' },
  pickerContainer: { borderWidth: 1, borderColor: '#f89393ff', borderRadius: 6, overflow: 'hidden' },
  picker: { height: 50, color: '#060708ff', fontWeight: '500', width: '100%' },
  notesInput: { borderWidth: 1, borderColor: '#f39090ff', borderRadius: 6, padding: 10, fontSize: 15 },
  totalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 10 },
  totalText: { fontSize: 20, fontWeight: '500', color: '#333' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  button: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FF5733', paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
