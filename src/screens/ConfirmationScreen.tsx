import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const ConfirmationScreen = ({ navigation }) => {
  const deliveryLocation = {
    latitude: 19.0622, // Chembur Delivery Location
    longitude: 72.9000,
  };

  const [riderLocation, setRiderLocation] = useState({
    latitude: 19.0510, // Starting location (near Chembur)
    longitude: 72.8930,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderLocation((prevLocation) => {
        const latDiff = deliveryLocation.latitude - prevLocation.latitude;
        const lonDiff = deliveryLocation.longitude - prevLocation.longitude;

        // Stop moving when rider reaches near delivery location
        if (Math.abs(latDiff) < 0.0005 && Math.abs(lonDiff) < 0.0005) {
          clearInterval(interval);
          return prevLocation;
        }

        return {
          latitude: prevLocation.latitude + latDiff * 0.02, // Move 2% closer each time
          longitude: prevLocation.longitude + lonDiff * 0.02,
        };
      });
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.success}>🎉 Your Order has been Placed Successfully! 🎉</Text>

      <MapView
        style={styles.map}
        region={{
          latitude: deliveryLocation.latitude,
          longitude: deliveryLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={deliveryLocation}
          title="Delivery Location"
          description="Customer"
          pinColor="green"
        />
        <Marker
          coordinate={riderLocation}
          title="Delivery Rider"
          description="Rider is on the way"
          pinColor="red"
        />
        {/* Optional polyline to show route */}
        <Polyline
          coordinates={[riderLocation, deliveryLocation]}
          strokeColor="blue"
          strokeWidth={2}
        />
      </MapView>

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
  container: { flex: 1, padding: 16 },
  success: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ConfirmationScreen;
