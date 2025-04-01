import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const CheckoutScreen = ({ route, navigation }) => {
  const { cart } = route.params;

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price} x {item.quantity}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ₹{getTotalPrice()}</Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          const total = getTotalPrice();
          console.log("Navigating to Payment screen with total:", total);
          navigation.navigate("Payment", { total, cart });
        }}
      >
        <Text style={styles.confirmText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6600",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default CheckoutScreen;