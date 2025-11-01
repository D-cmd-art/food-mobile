import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpAndSupport = () => {
  const navigation = useNavigation();

  const handleCall = () => {
    Linking.openURL('tel:9811077752');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:appgmail@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{width: 24}} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Need Help?</Text>
        <Text style={styles.subtitle}>Reach us through any method below</Text>

        {/* Address */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={styles.emoji}>📍</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Our Address</Text>
            <Text style={styles.cardText}>Damak 57217, Nepal</Text>
          </View>
        </View>

        {/* Call */}
        <TouchableOpacity style={styles.card} onPress={handleCall}>
          <View style={styles.cardIcon}>
            <Text style={styles.emoji}>📞</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardText}>9811077752</Text>
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity style={styles.card} onPress={handleEmail}>
          <View style={styles.cardIcon}>
            <Text style={styles.emoji}>📧</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardText}>appgmail@gmail.com</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1754fcff', // Use this directly in container
  },
  header: {
    backgroundColor: '#FF6B00',
    paddingTop: 15,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE8D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
});
