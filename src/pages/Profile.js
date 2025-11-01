import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../utils/store/userStore";
import { useLogout } from "../hooks/useLogin";
const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();
  const { user,clear,setUser } = useUserStore();
  const { mutate: logout, isLoading } = useLogout({
    onSuccess: () => {
      setUser(null);
      clear();
      navigation.navigate("Login");
    },
    onError: (err) => {
      console.log("Logout error:", err);
      Alert.alert("Error", "Failed to logout. Please try again.");
    },
  });
  const handleLogout =  () => {
     logout();
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="user" size={40} color="#2338f5ff" />
        </View>
        <Text style={styles.name}>{user?.name || "Guest"}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="General">
          <MenuItem icon="user" label="Profile" onPress={() => navigation.navigate("ProfileDetails")} />
          <MenuItem icon="map-marker-alt" label="My Address" onPress={() => navigation.navigate("MapTilerPicker")} />
           <MenuItem icon="first-order" label="Order History" onPress={() => navigation.navigate("Order")} />
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name="moon" size={18} color="#555" />
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />

          </View>
        </Section>

        <Section title="Promotional Activity">
         
          <MenuItem
            icon="coins"
            label="Cashback"
            right={<Text style={styles.badgeRed}>0 points</Text>}
            onPress={() => navigation.navigate("Cashback")}
          />
          <MenuItem
            icon="wallet"
            label="My Wallet"
            right={<Text style={styles.badgeGray}>Re. 0</Text>}
            onPress={() => navigation.navigate("Wallets")}
          />
        </Section>

        <Section title="Earnings">
          <MenuItem icon="share-alt" label="Refer & Earn" onPress={() => navigation.navigate("ReferandEarn")} />
        </Section>

        <Section title="Help & Support">
          <MenuItem icon="question-circle" label="Help & Support" onPress={() => navigation.navigate("HelpAndSupport")} />
          <MenuItem icon="info-circle" label="About Us" onPress={() => navigation.navigate("Aboutus")} />
          <MenuItem icon="file-contract" label="Terms & Conditions" onPress={() => navigation.navigate("TermsAndConditions")} />
          <MenuItem icon="lock" label="Privacy Policy" onPress={() => navigation.navigate("PrivacyPolicy")} />
        </Section>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="sign-out-alt" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const MenuItem = ({ icon, label, right, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon name={icon} size={18} color="#555" />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    {right && <View>{right}</View>}
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7ff",
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  header: {
    backgroundColor: "#1754fcff",
    paddingVertical: 30,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#FF6B00",
    fontWeight: "600",
    marginBottom: 10,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    marginLeft: 10,
  },
  badgeRed: {
    backgroundColor: "#FF4D4D",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeGray: {
    backgroundColor: "#EEE",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#FF4D4D",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Profile;
