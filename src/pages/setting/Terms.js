// screens/TermsAndConditions.js

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsAndConditions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Terms and Conditions – App Name</Text>

          {/* Section: Introduction */}
          <Text style={styles.sectionHeading}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to App Name. By using our services, you agree to follow the terms and conditions outlined below. Please read them carefully.
          </Text>

          {/* Section: Eligibility */}
          <Text style={styles.sectionHeading}>2. Eligibility</Text>
          <Text style={styles.text}>
            You must be at least 18 years old or use the app under parental or guardian supervision. By using the app, you confirm that you meet this requirement and are legally capable of entering into binding agreements under Nepalese law.
          </Text>

          {/* Section: Account Registration */}
          <Text style={styles.sectionHeading}>3. Account Registration</Text>
          <Text style={styles.text}>
            To access certain features, you must create an account. You agree to:
            {'\n'}• Provide accurate and updated information.
            {'\n'}• Keep your login credentials confidential.
            {'\n'}• Be responsible for all activities under your account.
          </Text>

          {/* Section: Service Scope */}
          <Text style={styles.sectionHeading}>4. Service Scope</Text>
          <Text style={styles.text}>
            App Name connects users with restaurants and food vendors across Nepal. We facilitate food ordering and delivery but are not responsible for food preparation or quality. All food-related liabilities rest with the respective vendors.
          </Text>

          {/* Section: Orders and Payments */}
          <Text style={styles.sectionHeading}>5. Orders and Payments</Text>
          <Text style={styles.text}>
            • Orders are subject to acceptance by the vendor.
            {'\n'}• Prices may vary and are subject to change.
            {'\n'}• Payments must be made through approved methods in the app.
            {'\n'}• Refunds and cancellations follow our Refund Policy, which complies with Nepalese consumer protection laws.
          </Text>

          {/* Section: Delivery Terms */}
          <Text style={styles.sectionHeading}>6. Delivery Terms</Text>
          <Text style={styles.text}>
            • Delivery times are estimates and may vary due to traffic, weather, or other factors.
            {'\n'}• Users must be available at the delivery location.
            {'\n'}• We are not liable for delays beyond our control.
          </Text>

          {/* Section: User Conduct */}
          <Text style={styles.sectionHeading}>7. User Conduct</Text>
          <Text style={styles.text}>
            You agree not to:
            {'\n'}• Use the app for illegal activities.
            {'\n'}• Post offensive or misleading content.
            {'\n'}• Interfere with the app’s functionality or security.
          </Text>

          {/* Section: Intellectual Property */}
          <Text style={styles.sectionHeading}>8. Intellectual Property</Text>
          <Text style={styles.text}>
            All content, trademarks, and technology used in the app are owned by App Name or its partners. Unauthorized use is prohibited.
          </Text>

          {/* Section: Privacy Policy */}
          <Text style={styles.sectionHeading}>9. Privacy Policy</Text>
          <Text style={styles.text}>
            Your personal data is handled according to our Privacy Policy, which complies with Nepal’s privacy regulations. By using the app, you consent to data collection and usage.
          </Text>

          {/* Section: Modifications */}
          <Text style={styles.sectionHeading}>10. Modifications</Text>
          <Text style={styles.text}>
            We may update these Terms without prior notice. Continued use of the app implies acceptance of the updated Terms.
          </Text>

          {/* Section: Governing Law */}
          <Text style={styles.sectionHeading}>11. Governing Law and Dispute Resolution</Text>
          <Text style={styles.text}>
            These Terms are governed by the laws of Nepal. Any disputes shall be resolved in the courts of Kathmandu, Nepal.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1b1a1aff',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#222',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 8,
  },
});