import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed
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

        if (Math.abs(latDiff) < 0.0005 && Math.abs(lonDiff) < 0.0005) {
          clearInterval(interval);
          return prevLocation;
        }

        return {
          latitude: prevLocation.latitude + latDiff * 0.02,
          longitude: prevLocation.longitude + lonDiff * 0.02,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.success}>🎉 Order Placed Successfully! 🎉</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: (deliveryLocation.latitude + riderLocation.latitude) / 2, // Center between rider and delivery
            longitude: (deliveryLocation.longitude + riderLocation.longitude) / 2,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
        >
          <Marker
            coordinate={deliveryLocation}
            title="Delivery Location"
            description="Your Address"
            pinColor="green"
          />
          <Marker
            coordinate={riderLocation}
            title="Delivery Rider"
            description="Rider is on the way"
            pinColor="red"
          />
          <Polyline
            coordinates={[riderLocation, deliveryLocation]}
            strokeColor="#ff6600" // Changed to match theme
            strokeWidth={3}
          />
        </MapView>
      </View>

      {/* Status Info */}
      <Text style={styles.statusText}>
        Your rider is on the way! Track their progress above.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#ff6600", "#ff4500"]}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
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
    marginBottom: 25,
  },
  success: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ff6600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  mapContainer: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 102, 0, 0.2)",
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: 350,
  },
  statusText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    fontStyle: "italic",
  },
  button: {
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
    paddingHorizontal: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default ConfirmationScreen;