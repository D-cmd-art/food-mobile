// RegistrationScreen.jsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRegister } from "../hooks/useRegister";
import { useUserStore } from "../utils/store/userStore";
import {jwtDecode} from "jwt-decode";
import { saveTokens } from "../utils/tokenStorage";

// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const { width } = Dimensions.get("window");

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setUser } = useUserStore();
  const { mutate, isLoading } = useRegister();

  const initialValues = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

  const handleRegister = (values, { resetForm }) => {
    const { name, email, phone, password } = values;

    mutate(
      { name, email, phone, password },
      {
        onSuccess: async(resData) => {
          // Decode JWT token and set user in Zustand 
           
          const accessToken = resData.accessToken;
          const refreshToken=resData.refreshToken;
          await saveTokens(accessToken,refreshToken);
          const user = jwtDecode(accessToken);
          setUser(user);
          // Reset form fields
          resetForm();
          // Alert.alert("Success", "Registration successful!");
          navigation.navigate("Home");

          Alert.alert("Success", `Welcome ${user.name}!`);
          navigation.navigate("Home");
        },
        onError: (error) => {
          const msg = error.response?.data?.error || error.message || "Registration failed";
          Alert.alert("Error", msg);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
          <Image
            source={require("../assets/applogo.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="App Logo"
          />

          <Text style={styles.header}>Create Your Account</Text>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                {[
                  { field: "name", placeholder: "Full Name" },
                  { field: "email", placeholder: "Email Address" },
                  { field: "phone", placeholder: "Phone Number", keyboardType: "phone-pad" },
                  { field: "password", placeholder: "Password", secure: true },
                  { field: "confirmPassword", placeholder: "Confirm Password", secure: true },
                ].map(({ field, placeholder, secure, keyboardType = "default" }) => (
                  <View key={field} style={styles.fieldContainer}>
                    <TextInput
                      placeholder={placeholder}
                      placeholderTextColor="#666"
                      onChangeText={handleChange(field)}
                      onBlur={handleBlur(field)}
                      value={values[field]}
                      secureTextEntry={secure}
                      keyboardType={keyboardType}
                      style={styles.input}
                      autoCapitalize="none"
                    />
                    {errors[field] && touched[field] && (
                      <Text style={styles.error}>{errors[field]}</Text>
                    )}
                  </View>
                ))}

                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? "Registering..." : "Register Now"}
                  </Text>
                </Pressable>
              </View>
            )}
          </Formik>

          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) => [styles.loginContainer, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.loginText}>
              Already registered? <Text style={styles.loginLink}>Login now</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flexGrow: 1, justifyContent: "center" },
  container: { paddingHorizontal: 24, backgroundColor: "#fff" },
  logo: { width: "60%", height: 100, alignSelf: "center", marginBottom: 20 },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 24, textAlign: "center", color: "#333" },
  form: { width: "100%" },
  fieldContainer: { marginBottom: 16 },
  input: {
    backgroundColor: "#f0f2f5",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: width < 360 ? 14 : 16,
    width: "100%",
    color: "#000",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  error: { color: "#d9534f", marginTop: 4, fontSize: 12 },
  button: { backgroundColor: "#007bff", paddingVertical: 16, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loginContainer: { marginTop: 20 },
  loginText: { textAlign: "center", color: "#6c757d", fontSize: 14 },
  loginLink: { color: "#007bff", fontWeight: "500" },
});
