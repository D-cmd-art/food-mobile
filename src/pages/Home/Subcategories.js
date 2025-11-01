import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useProductList } from "../../hooks/useProductList";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCartStore } from "../../utils/store/cartStore";

const { width } = Dimensions.get("window");

const SubcategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const selectedCategory = route.params?.category;
  const { addItem }=useCartStore();
  const { data: allProducts, isLoading, error } = useProductList();

  const filteredProducts =
    selectedCategory && selectedCategory !== "All"
      ? allProducts?.filter((p) => p.category === selectedCategory)
      : allProducts;

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#92400e" />
        <Text style={styles.loadingText}>Loading products.. .. .</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load products</Text>
      </View>
    );

  if (!filteredProducts || filteredProducts.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.noItemsText}>
          No items found in "{selectedCategory}"
        </Text>
      </View>
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to product detail later
      }}
    >
      <Image
        source={{
          uri:
            item.photos?.[0] ||
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        }}
        style={styles.image}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>Rs. {item.price}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={()=>handleCart(item)}>
        <Ionicons name="add" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  function handleCart(item){
    //add ui logic here
    addItem(item);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory}</Text>
        <View style={{ width: 24 }} /> {/* Spacer for balance */}
      </View>

      {/* 🔹 Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}
      />
    </SafeAreaView>
  );
};

export default SubcategoryScreen;

/* 🎨 Styles */
const CARD_WIDTH = (width - 48) / 2;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#92400e",
  },
  noItemsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },

  /* 🔹 Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#92400e",
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 4,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  /* 🔹 Grid Cards */
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
    width: CARD_WIDTH,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: CARD_WIDTH * 0.8,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardInfo: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: 13,
    color: "#92400e",
    fontWeight: "700",
    marginTop: 4,
  },

  addButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "#92400e",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
