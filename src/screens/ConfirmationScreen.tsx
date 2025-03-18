import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.success}>🎉 Your Order has been Placed Successfully! 🎉</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  success: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ConfirmationScreen;
