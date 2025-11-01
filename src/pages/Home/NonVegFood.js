import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../CartContext";
import { useNavigation } from "@react-navigation/native";
import { useProductList } from "../../hooks/useProductList.js";
import SkeletonLoader from "./Loader/SkeletonLoader";
import ProductCard from "../components/ProductCard";

const { width: deviceWidth } = Dimensions.get("window");

const VegFood = () => {
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const { data, isLoading, error } = useProductList();

  if (isLoading) return <SkeletonLoader />;
  if (error) return <Text>Error occurred while loading food items.</Text>;

  const vegItems = data?.filter((item) => item.subCategory === "meat");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Non-Veg Food</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllFood")}>
          <Ionicons
            name="arrow-forward-circle"
            size={deviceWidth * 0.1}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {vegItems?.map((item, index) => (
          <View key={item.id?.toString() || `food-${index}`} style={styles.cardWrapper}>
            <ProductCard item={item}/>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VegFood;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: deviceWidth * 0.045,
    fontWeight: "bold",
    color: "#92400e",
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  cardWrapper: {
    width: deviceWidth * 0.45,
    marginRight: 15,
  },
});