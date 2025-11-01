import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useSearch } from "../../hooks/useSearch"; // Custom hook for fetching data
import ProductCard from "./ProductCard";         // Replace with your actual component
import RestaurantCard from "./RestaurantCard";   // Replace with your actual component

export default function SearchResult({ query, type }) {
  const { data, isLoading, isError } = useSearch(query, type);
  console.log("searchresult is hereeeee",data);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [query, type]);

  if (!query) return null;

  const renderItem = ({ item }) => {
    return type === "products" ? (
      <TouchableOpacity onPress={() => setSelected(item)}>
        <ProductCard item={item} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => setSelected(item)}>
        <RestaurantCard restaurant={item} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Selected Item Details */}
      {selected && (
        <View style={styles.selectedSection}>
          <View style={styles.selectedHeader}>
            <Text style={styles.selectedTitle}>
              Selected {type === "products" ? "Product" : "Restaurant"}
            </Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.clearButton}>Clear Selection</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardWrapper}>
            {type === "products" ? (
              <ProductCard product={selected} />
            ) : (
              <RestaurantCard restaurant={selected} />
            )}
          </View>
        </View>
      )}

      {/* Show all items below if nothing is selected */}
      {!selected && data?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            {type === "products" ? "Products" : "Restaurants"} matching "{query}"
          </Text>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id || item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  selectedSection: {
    marginBottom: 20,
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#b45309", // amber-700
  },
  clearButton: {
    fontSize: 14,
    color: "#ef4444", // red-500
  },
  cardWrapper: {
    marginBottom: 10,
  },
  listSection: {
    marginTop: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#b45309",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
});