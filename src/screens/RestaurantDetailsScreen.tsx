import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For icons

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params || {}; // ✅ Ensure item exists

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No restaurant details found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text> 
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Restaurant Image */}
        <Image source={item.image} style={styles.image} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Restaurant Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
        </View>

        <Text style={styles.description}>{item.description || "No description available."}</Text>

        {/* ✅ Fix: Check if item.menu exists before mapping */}
        <Text style={styles.sectionTitle}>Menu</Text>
        {item.menu && Array.isArray(item.menu) && item.menu.length > 0 ? (
          item.menu.map((menuItem, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuText}>{menuItem.name}</Text>
              <Text style={styles.menuPrice}>₹{menuItem.price}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noMenu}>No menu available.</Text>
        )}
      </ScrollView>

      {/* Floating Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
        <Icon name="cart-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "100%",
    height: 200,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    color: "#ff6600",
  },
  description: {
    fontSize: 16,
    color: "#555",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    marginHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6600",
  },
  noMenu: {
    fontSize: 16,
    color: "#888",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff6600",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default RestaurantDetailsScreen;
