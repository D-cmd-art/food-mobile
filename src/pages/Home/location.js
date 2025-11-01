// LocationBar.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import {useMapStore} from '../../utils/store/mapStore';
const LocationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data=useMapStore((state)=>state.location);
  console.log("location data from store:",data);
  const handlePress = () => {
    navigation.navigate("MapPicker");
  };

  const formatLocationText = () => {
    if (!data) return "📍 Tap to set your location >";
  };

  return (
    <View style={styles.container}>
      <Icon name="map-pin" size={20} color="#2f9e44" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.deliverTo}>DELIVER TO{data?.address}</Text>
        
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.currentLocation} numberOfLines={1}>
            {formatLocationText()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  deliverTo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    textTransform: "uppercase",
  },
  currentLocation: {
    fontSize: 14,
    color: "#2f9e44",
    marginTop: 2,
    fontWeight: "600",
  },
});

export default LocationBar;