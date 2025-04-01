import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";

const CheckoutScreen = ({ route, navigation }) => {
  const { cart } = route.params || {};

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemQuantity}>x {item.quantity}</Text>
        <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );

  const handleProceedToPayment = async () => {
    // Debug navigation prop and current route
    console.log("Navigation object:", navigation);
    console.log("Current route:", navigation.getState()?.routes);

    try {
      if (!navigation || !navigation.navigate) {
        Alert.alert("Navigation Error", "Navigation prop is missing or invalid.");
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Error", "Biometric authentication not available.");
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert("Error", "No biometric data enrolled.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to proceed with payment",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const total = getTotalPrice();
        console.log("Biometric authentication successful. Navigating to Payment screen with total:", total);
        console.log("Attempting navigation to 'Payment' with params:", { total, cart });
        navigation.navigate("Payment", { total, cart });
        console.log("Navigation to Payment executed");
      } else {
        Alert.alert("Authentication Failed", "Biometric scan failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Authentication error: " + error.message);
      console.error("Authentication error:", error);
    }
  };

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Checkout</Text>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.total}>₹{getTotalPrice()}</Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleProceedToPayment}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#ff6600", "#ff4500"]} style={styles.gradientButton}>
          <Text style={styles.confirmText}>Proceed to Payment</Text>
        </LinearGradient>
      </TouchableOpacity>
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
    paddingTop: 40,
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
  itemQuantity: {
    fontSize: 16,
    color: "#777",
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6600",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  total: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff6600",
  },
  confirmButton: {
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
  confirmText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
});

export default CheckoutScreen;