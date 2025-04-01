import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Linking } from "react-native";
import QRCodeStyled from 'react-native-qrcode-styled';

const PaymentCompletionScreen = ({ route, navigation }) => {
  // Get total from PaymentScreen and cart from CheckoutScreen via route params
  const { totalAmount, cart } = route.params || { totalAmount: 0, cart: [] };
  
  // Get current date and time for receipt
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
  // Generate a random order ID
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Create detailed receipt string for QR code
  const itemsList = cart.map(item => `${item.name}: ₹${item.price} x ${item.quantity}`).join('\n');
  const receiptQRValue = `Order Receipt
Order ID: ${orderId}
Date: ${formattedDate}
Items:
${itemsList}
Total: ₹${totalAmount}
Status: Paid
Thank you for your order!`;

  const openQRLink = () => {
    // This will open the receipt data as plain text
    Linking.openURL(`data:text/plain,${encodeURIComponent(receiptQRValue)}`).catch((err) => 
      console.error('An error occurred', err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          
          <Text style={styles.header}>Payment Successful!</Text>
          <Text style={styles.subheader}>Thank you for your order</Text>
          
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

          {/* QR Code Display */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>Scan to view receipt</Text>
            <QRCodeStyled
              data={receiptQRValue}
              style={{backgroundColor: 'white'}}
              padding={15}
              pieceSize={6}
              pieceScale={0.8}
              pieceBorderRadius={2}
              color="#000000"
            />
            <TouchableOpacity onPress={openQRLink} style={styles.linkButton}>
              <Text style={styles.linkText}>View receipt online</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.deliveryInfo}>
            Your order has been placed. The restaurant will begin preparing your food shortly.
          </Text>
          
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => navigation.navigate("Confirmation")}
          >
            <Text style={styles.trackButtonText}>Track Your Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 16,
    color: "#777",
    marginBottom: 25,
  },
  receiptContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  receiptLabel: {
    fontSize: 15,
    color: "#777",
  },
  receiptValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  statusText: {
    color: "#28a745",
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    width: "100%",
  },
  qrText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
    color: "#555"
  },
  linkButton: {
    marginTop: 12,
    padding: 6,
  },
  linkText: {
    color: "#2196F3",
    textDecorationLine: "underline",
    fontSize: 14
  },
  deliveryInfo: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  trackButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  homeButton: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  homeButtonText: {
    fontSize: 16,
    color: "#555",
  },
});

export default PaymentCompletionScreen;