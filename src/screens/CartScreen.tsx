import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed
import Icon from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
            disabled={item.quantity === 1}
          >
            <Icon
              name="remove-circle-outline"
              size={26}
              color={item.quantity === 1 ? "#ccc" : "#ff6600"}
            />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Icon name="add-circle-outline" size={26} color="#ff6600" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Icon name="trash-outline" size={26} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Icon name="cart-outline" size={60} color="#888" />
          <Text style={styles.emptyCart}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
          />

          {/* Proceed to Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout", { cart })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#ff6600", "#ff4500"]}
              style={styles.gradientButton}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingTop: 40, // Extra padding for status bar
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6600",
    letterSpacing: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCart: {
    fontSize: 20,
    fontWeight: "600",
    color: "#888",
    marginTop: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6600",
    marginRight: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 5,
    marginRight: 15,
  },
  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 10,
    minWidth: 25,
    textAlign: "center",
  },
  removeButton: {
    padding: 5,
  },
  checkoutButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
});

export default CartScreen;