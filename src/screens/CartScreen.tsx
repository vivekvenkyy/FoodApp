import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const cart = [
  { id: "101", name: "Margherita Pizza", price: 250, quantity: 1 },
  { id: "202", name: "BBQ Bacon Burger", price: 280, quantity: 2 },
];

const CartScreen = () => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.priceText}>₹{item.price * item.quantity}</Text>
          </View>
        )}
      />
      <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 } });

export default CartScreen;
