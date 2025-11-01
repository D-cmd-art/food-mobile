import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useProductList } from "../../hooks/useProductList.js";
import SkeletonLoader from "./Loader/SkeletonLoader.js";
import ProductCard from "../components/ProductCard.js";

const { width } = Dimensions.get("window");

const BestReviewedFood = () => {
  const navigation = useNavigation();
  const { data, isLoading, error } = useProductList();

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading food items.</Text>
      </View>
    );

  const products = data?.filter((item) => item.rating?.average > 4) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔹 Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Best Reviewed Food</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllFood")}
            style={styles.iconButton}
          >
            <Ionicons
              name="arrow-forward-circle-outline"
              size={width * 0.08}
              color="#92400e"
            />
          </TouchableOpacity>
        </View>

        {/* 🔹 Product Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {products.length > 0 ? (
            products.map((item) => (
              <View key={item._id} style={styles.cardWrapper}>
                <ProductCard item={item} />
              </View>
            ))
          ) : (
            <Text style={styles.noProducts}>No top-rated products found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BestReviewedFood;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#fff",
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.04,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: width * 0.03,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#92400e",
  },
  iconButton: {
    padding: 5,
  },

  scrollContainer: {
    paddingHorizontal: width * 0.02,
  },
  cardWrapper: {
    marginRight: width * 0.04,
    width: width * 0.45, // makes the ProductCard responsive
  },

  noProducts: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    paddingVertical: width * 0.1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: width * 0.04,
  },
});
