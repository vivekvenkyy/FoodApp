import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';

const PaymentScreen = ({ route, navigation }) => {
  const { total } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannerVisible(false);
    alert(`Payment QR code scanned! Data: ${data}`);
    // In a real app, you would process the payment using the QR data here
    navigation.navigate("Confirmation");
  };

  const handlePayment = () => {
    alert(`Payment of ₹${total} processed successfully!`);
    navigation.navigate("Confirmation");
  };

  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera. Please grant permission in your settings.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amount Payable: ₹{total}</Text>
      
      <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>

      <Modal
        visible={scannerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.scanner}
            />
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
            </View>
            <Button 
              title="Cancel" 
              onPress={() => setScannerVisible(false)} 
              color="#FF6347"
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 30 
  },
  payButton: { 
    backgroundColor: "#4CAF50", 
    padding: 15, 
    borderRadius: 8,
    width: 200,
    alignItems: "center"
  },
  scanButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: "center"
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  orText: {
    margin: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#666"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  scannerContainer: {
    height: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden"
  },
  scanner: {
    flex: 1
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#2196F3",
    backgroundColor: "transparent"
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    margin: 30
  }
});

export default PaymentScreen;