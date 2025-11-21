// MapPicker.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useMapStore } from '../../utils/store/mapStore';
import { SafeAreaView } from 'react-native-safe-area-context';

// CORRECT GEOLOCATION IMPORT
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('window');
const defaultLocation = { latitude: 26.664578, longitude: 87.693876 }; // Damak

const MapPicker = () => {
  const navigation = useNavigation();
  const webRef = useRef(null);
  const { setLocation } = useMapStore();

  const [webReady, setWebReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [currentAddress, setCurrentAddress] = useState('Select a location on the map');
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Send location to WebView
  const sendLocationToWebView = useCallback((lat, lng) => {
    if (webRef.current && webReady) {
      setTimeout(() => {
        try {
          const message = JSON.stringify({ 
            type: 'setCurrentLocation', 
            lat, 
            lng 
          });
          webRef.current.postMessage(message);
          console.log('Location sent to WebView:', lat, lng);
        } catch (e) {
          console.log('WebView error:', e);
        }
      }, 500);
    }
  }, [webReady]);

  // Get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    setIsGettingAddress(true);
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.locality || data.city || data.principalSubdivision || 'Unknown location';
        setCurrentAddress(address);
      } else {
        setCurrentAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      // Fallback to OpenStreetMap
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentAddress(data.display_name || `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } else {
          setCurrentAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } catch {
        setCurrentAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } finally {
      setIsGettingAddress(false);
    }
  };

  // Request Android permission
  const requestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show your current position.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  // Get current location - FIXED VERSION
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setCurrentAddress('Finding your location...');

    try {
      console.log('Starting location fetch...');
      
      // For Android, request permission first
      if (Platform.OS === 'android') {
        console.log('Requesting Android location permission...');
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Required',
            'Location permission is required to get your current location.'
          );
          setLocationLoading(false);
          setCurrentAddress('Permission denied - select location manually');
          return;
        }
        console.log('Android location permission granted');
      }

      // Use Geolocation directly - IT'S NOW PROPERLY IMPORTED
      console.log('Calling Geolocation.getCurrentPosition...');
      
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Location success:', position);
          const { latitude, longitude } = position.coords;
          console.log('Got coordinates:', latitude, longitude);
          
          setSelectedLocation({ latitude, longitude });
          sendLocationToWebView(latitude, longitude);
          getAddressFromCoords(latitude, longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          handleLocationError(error);
          setLocationLoading(false);
        },
        {
         enableHighAccuracy: false, // Changed to false for faster response
            timeout: 30000, // 30 seconds max
            maximumAge: 300000, 
          distanceFilter: 10
        }
      );

    } catch (error) {
      console.log('Location service error:', error);
      Alert.alert(
        'Location Service Unavailable',
        'Please select your location manually on the map.'
      );
      setCurrentAddress('Select location on map');
      setLocationLoading(false);
    }
  };

  const handleLocationError = (error) => {
    let errorMessage = 'Unable to get your current location. ';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += 'Location permission was denied.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage += 'Location request timed out.';
        break;
      default:
        errorMessage += 'Please try again or select manually.';
    }
    
    Alert.alert('Location Error', errorMessage);
    setCurrentAddress('Please select location on map');
  };

  // Handle WebView messages
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
      
      if (data.type === 'locationSelected') {
        const newLoc = { latitude: data.latitude, longitude: data.longitude };
        setSelectedLocation(newLoc);
        getAddressFromCoords(data.latitude, data.longitude);
      }

      if (data.type === 'mapReady') {
        setWebReady(true);
        console.log('Map is ready');
      }
    } catch (e) {
      console.log('WebView message error:', e);
    }
  };

  // Save location
  const handleSetLocation = () => {
    if (!selectedLocation) {
      Alert.alert('Please select a location first');
      return;
    }
    
    setLocation({
      ...selectedLocation,
      address: currentAddress,
      timestamp: new Date().toISOString(),
    });
    
    Alert.alert('Success', 'Location saved successfully!');
    navigation.goBack();
  };

  const leafletHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body, #map { 
        height: 100%; 
        width: 100%; 
      }
      .location-marker { 
        background: #2f9e44; 
        border-radius: 50%; 
        width: 20px; 
        height: 20px; 
        border: 3px solid white; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      let map, marker;
      let isMapReady = false;

      function initMap() {
        try {
          console.log('Initializing map...');
          
          map = L.map('map').setView([${defaultLocation.latitude}, ${defaultLocation.longitude}], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19
          }).addTo(map);
          
          marker = L.marker([${defaultLocation.latitude}, ${defaultLocation.longitude}], { 
            draggable: true,
            icon: L.divIcon({ 
              className: 'location-marker',
              iconSize: [26, 26]
            }) 
          }).addTo(map);
          
          marker.on('dragend', function() {
            const pos = marker.getLatLng();
            sendToReactNative({
              type: 'locationSelected',
              latitude: pos.lat,
              longitude: pos.lng
            });
          });

          map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            sendToReactNative({
              type: 'locationSelected',
              latitude: e.latlng.lat,
              longitude: e.latlng.lng
            });
          });

          isMapReady = true;
          sendToReactNative({ type: 'mapReady' });
          console.log('Map initialized successfully');
          
        } catch (error) {
          console.error('Map error:', error);
        }
      }

      function setCurrentLocation(lat, lng) {
        if (!isMapReady) {
          console.log('Map not ready yet');
          return;
        }
        
        try {
          console.log('Setting location in map:', lat, lng);
          marker.setLatLng([lat, lng]);
          map.setView([lat, lng], 15);
        } catch (error) {
          console.error('Error setting location:', error);
        }
      }

      function sendToReactNative(message) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        } else {
          console.log('ReactNativeWebView not available');
        }
      }

      // Handle messages from React Native
      document.addEventListener('message', function(e) {
        try {
          const message = JSON.parse(e.data);
          console.log('Received message from RN:', message);
          
          if (message.type === 'setCurrentLocation') {
            setCurrentLocation(message.lat, message.lng);
          }
        } catch (error) {
          console.error('Message error:', error);
        }
      });

      window.addEventListener('message', function(e) {
        try {
          const message = JSON.parse(e.data);
          console.log('Received window message:', message);
          
          if (message.type === 'setCurrentLocation') {
            setCurrentLocation(message.lat, message.lng);
          }
        } catch (error) {
          console.error('Window message error:', error);
        }
      });

      // Initialize map
      initMap();
    </script>
  </body>
  </html>`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Location</Text>
        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSetLocation}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addressBar}>
        <Icon name="map-pin" size={16} color="#2f9e44" />
        <Text style={styles.addressText} numberOfLines={2}>
          {currentAddress}
        </Text>
        {isGettingAddress && (
          <ActivityIndicator size="small" color="#2f9e44" style={styles.loadingIndicator} />
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.locationButton,
          locationLoading && styles.locationButtonDisabled
        ]}
        onPress={getCurrentLocation}
        disabled={locationLoading}
      >
        <Icon name="crosshair" size={18} color="#fff" />
        <Text style={styles.locationButtonText}>
          {locationLoading ? 'Finding Location...' : 'Click here to fetch the current Location'}
        </Text>
        {locationLoading && (
          <ActivityIndicator size="small" color="#fff" style={styles.buttonLoading} />
        )}
      </TouchableOpacity>

      <WebView
        ref={webRef}
        source={{ html: leafletHTML }}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => {
          console.log('WebView loaded completely');
          setWebReady(true);
        }}
        onError={(error) => console.log('WebView error:', error)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2f9e44" />
            <Text style={styles.loadingText}>Loading Map...</Text>
          </View>
        )}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#f0f0f0', 
    borderBottomWidth: 1 
  },
  backButton: {
    padding: 4,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  saveBtn: { 
    backgroundColor: '#2f9e44', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 6 
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
  addressBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#e9ecef',
    borderBottomWidth: 1
  },
  addressText: { 
    flex: 1, 
    marginLeft: 8, 
    color: '#495057', 
    fontWeight: '500',
    fontSize: 14
  },
  loadingIndicator: {
    marginLeft: 8
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1971c2',
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationButtonDisabled: {
    backgroundColor: '#868e96',
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonLoading: {
    marginLeft: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  webview: { 
    flex: 1, 
    width 
  },
});

export default MapPicker;
