import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed
import QRCodeStyled from "react-native-qrcode-styled";

const PaymentCompletionScreen = ({ route, navigation }) => {
  const { totalAmount = 0, cart = [] } = route.params || {};

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  console.log("PaymentCompletionScreen - totalAmount:", totalAmount, "cart:", cart);

  const itemsList = cart.map((item) => `${item.name}: ₹${item.price} x ${item.quantity}`).join("\n");
  const receiptQRValue = `Order Receipt
Order ID: ${orderId}
Date: ${formattedDate}
Items:
${itemsList}
Total: ₹${totalAmount}
Status: Paid
Thank you for your order!`;

  const openQRLink = () => {
    Alert.alert(
      "Order Receipt",
      receiptQRValue,
      [{ text: "OK", onPress: () => console.log("Receipt viewed") }],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffede6" />
      <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {/* Success Indicator */}
            <LinearGradient
              colors={["#ff6600", "#ff4500"]}
              style={styles.successIconContainer}
            >
              <Text style={styles.successIcon}>✓</Text>
            </LinearGradient>
            <Text style={styles.header}>Payment Successful!</Text>
            <Text style={styles.subheader}>Thank you for your order</Text>

            {/* Receipt Section */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order ID:</Text>
                <Text style={styles.receiptValue}>{orderId}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date:</Text>
                <Text style={styles.receiptValue}>{formattedDate}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Amount:</Text>
                <Text style={styles.receiptValue}>₹{totalAmount}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Status:</Text>
                <Text style={[styles.receiptValue, styles.statusText]}>Paid</Text>
              </View>
            </View>

            {/* QR Code Section */}
            <View style={styles.qrContainer}>
              <Text style={styles.qrText}>Scan to View Receipt</Text>
              <QRCodeStyled
                data={receiptQRValue}
                style={{ backgroundColor: "white" }}
                padding={15}
                pieceSize={6}
                pieceScale={0.9}
                pieceBorderRadius={3}
                color="#ff6600"
              />
              <TouchableOpacity onPress={openQRLink} style={styles.linkButton}>
                <Text style={styles.linkText}>View receipt online</Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Info */}
            <Text style={styles.deliveryInfo}>
              Your order has been placed. The restaurant will begin preparing your food shortly.
            </Text>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate("Confirmation")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#ff6600", "#ff4500"]}
                style={styles.gradientButton}
              >
                <Text style={styles.trackButtonText}>Track Your Order</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20, // Add padding to top and bottom for better spacing
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  successIcon: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ff6600",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subheader: {
    fontSize: 18,
    color: "#777",
    marginBottom: 30,
  },
  receiptContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 102, 0, 0.2)",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  receiptLabel: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
  receiptValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusText: {
    color: "#ff6600",
    fontWeight: "700",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 102, 0, 0.2)",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: "#ff6600",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "600",
  },
  deliveryInfo: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    fontStyle: "italic",
  },
  trackButton: {
    borderRadius: 25,
    overflow: "hidden",
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  trackButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  homeButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff6600",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    fontSize: 18,
    color: "#ff6600",
    fontWeight: "600",
  },
});

export default PaymentCompletionScreen;