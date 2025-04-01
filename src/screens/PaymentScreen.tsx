import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed
import { CartContext } from "../context/CartContext";

const PaymentScreen = ({ route, navigation }) => {
  const { total = 0, cart = [] } = route.params || {};
  const { getTotalPrice } = useContext(CartContext);

  const totalAmount = total;

  console.log("PaymentScreen - total from Checkout:", total, "cart:", cart);

  const handlePayment = () => {
    alert(`Payment of ₹${totalAmount} processed successfully!`);
    navigation.navigate("PaymentsComp", { totalAmount, cart });
  };

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Amount Payable: ₹{totalAmount}</Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrContainer}>
        <Text style={styles.qrText}>Scan to Pay</Text>
        <Image
          source={require("../../qr-payment.jpg")}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.qrCaption}>
          Scan this QR code with your payment app
        </Text>
      </View>

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#ff6600", "#ff4500"]}
          style={styles.gradientButton}
        >
          <Text style={styles.payText}>Confirm Payment</Text>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6600",
    letterSpacing: 1,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 102, 0, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  qrText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginVertical: 10,
  },
  qrCaption: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6600",
  },
  payButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});

export default PaymentScreen;