import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location"; // Import expo-location

const ConfirmationScreen = ({ navigation }) => {
  const deliveryLocation = {
    latitude: 19.0622, // Chembur Delivery Location
    longitude: 72.9000,
  };

  const [riderLocation, setRiderLocation] = useState(null); // Start with null until GPS data is available
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    let subscription;

    const setupLocationTracking = async () => {
      // Request foreground location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied. Cannot track rider.");
        Alert.alert("Permission Denied", "Please enable location services to track the rider.");
        return;
      }

      // Start watching the rider's location
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // High accuracy for GPS
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 1, // Update every 1 meter moved
        },
        (location) => {
          setRiderLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setLocationError(null); // Clear any previous error
        }
      );
    };

    setupLocationTracking();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Show loading or error state if rider location isn't available yet
  if (locationError) {
    return (
      <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.success}>🎉 Order Placed Successfully! 🎉</Text>
        </View>
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <LinearGradient colors={["#ff6600", "#ff4500"]} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!riderLocation) {
    return (
      <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.success}>🎉 Order Placed Successfully! 🎉</Text>
        </View>
        <Text style={styles.statusText}>Fetching rider location...</Text>
      </LinearGradient>
    );
  }

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
            latitude: (deliveryLocation.latitude + riderLocation.latitude) / 2,
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
            strokeColor="#ff6600"
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
  errorText: {
    fontSize: 16,
    color: "#ff4500",
    textAlign: "center",
    marginVertical: 20,
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