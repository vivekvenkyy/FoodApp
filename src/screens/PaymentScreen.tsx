import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { CartContext } from "../context/CartContext";

const PaymentScreen = ({ route, navigation }) => {
  // Get total and cart from route params, with fallback
  const { total = 0, cart = [] } = route.params || {};
  const { getTotalPrice } = useContext(CartContext);

  // Use total from route.params instead of CartContext to ensure consistency
  const totalAmount = total;

  console.log("PaymentScreen - total from Checkout:", total, "cart:", cart);

  const handlePayment = () => {
    alert(`Payment of ₹${totalAmount} processed successfully!`);
    navigation.navigate("PaymentsComp", { totalAmount, cart });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amount Payable: ₹{totalAmount}</Text>
      
      <View style={styles.qrContainer}>
        <Text style={styles.qrText}>Scan to pay</Text>
        <Image 
          source={require('../../qr-payment.jpg')} 
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.qrCaption}>
          Scan this QR code with your payment app
        </Text>
      </View>
      
      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  qrText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#555"
  },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  qrCaption: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  orText: {
    margin: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#666"
  },
  payButton: { 
    backgroundColor: "#4CAF50", 
    padding: 15, 
    paddingHorizontal: 40,
    borderRadius: 8 
  },
  payText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 18 
  },
});

export default PaymentScreen;