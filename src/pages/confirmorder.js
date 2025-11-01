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

const USER_DATA = {
  name: 'Jane Doe',
  address: '123 Delivery St, City, Country',
  email: 'jane.doe@example.com',
};

const CART_TOTAL = 1500;

const DELIVERY_SLOTS = [
  { label: 'Select Delivery Time', value: '' },
  { label: 'Within 45  Mins', value: '45 min' },
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

  const handleConfirmOrder = () => {
    if (!deliveryTime) {
      Alert.alert('Missing Info', 'Please select a delivery time slot.');
      return;
    }

    if (!phone) {
      Alert.alert('Missing Info', 'Please enter a delivery phone number.');
      return;
    }

    const orderData = {
      user: USER_DATA,
      phone,
      total: CART_TOTAL,
      paymentMethod,
      deliveryTime,
    };
    

    console.log('Order Confirmed:', orderData);
    Alert.alert(
      'Order Confirmed! 🎉',
      `Your order total is Rs. ${CART_TOTAL}. Payment: ${paymentMethod}. Delivery time: ${deliveryTime}. Delivery Phone: ${phone}`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Confirm Your Order</Text>

        {/* --- 1. User Details --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <DetailRow label="Name:" value={USER_DATA.name} />
          <DetailRow label="Email:" value={USER_DATA.email} />
        </View>

        {/* --- 2. Delivery Address --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>{USER_DATA.address}</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change Address</Text>
          </TouchableOpacity>
        </View>

        {/* --- 3. Delivery Phone Number --- */}
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

        {/* --- 4. Payment Method --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_OPTIONS.map(option => (
            <RadioOption
              key={option.key}
              label={option.label}
              isSelected={paymentMethod === option.key}
              onPress={() => setPaymentMethod(option.key)}
            />
          ))}
        </View>

        {/* --- 5. Delivery Time --- */}
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

        {/* --- 6. Total Amount --- */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Order Total:</Text>
          <Text style={styles.totalAmount}>Rs. {CART_TOTAL.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {/* --- CONFIRM BUTTON --- */}
      <TouchableOpacity style={styles.button} onPress={handleConfirmOrder}>
        <Text style={styles.buttonText}>CONFIRM ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  section: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#007AFF' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  addressText: { fontSize: 15, marginBottom: 10, color: '#333' },
  changeButton: { alignSelf: 'flex-start', marginTop: 5 },
  changeButtonText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  radio: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10, backgroundColor: '#fff' },
  radioSelected: { borderColor: '#007AFF', backgroundColor: '#2ab4ebff', borderWidth: 2 },
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
