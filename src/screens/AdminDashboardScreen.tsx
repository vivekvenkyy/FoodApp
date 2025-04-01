import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

const AdminDashboardScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://192.168.1.202:9080";
  const USERS_ENDPOINT = `${API_BASE_URL}/api/users`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(USERS_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  const handleDeleteUser = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the user with ID: ${id}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const deleteUrl = `${API_BASE_URL}/api/users/${encodeURIComponent(id)}`;
              const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.message || "Failed to delete user");
              }
              setUsers(users.filter((user) => user.id !== id));
              Alert.alert("Success", "User deleted successfully");
            } catch (error) {
              Alert.alert("Error", error.message || "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.userImage} />
        ) : (
          <View style={styles.userImagePlaceholder}>
            <Text style={styles.userImagePlaceholderText}>
              {item.name?.charAt(0) || "U"}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.name || "Unnamed User"}</Text>
        <Text style={styles.userInfo}>ID: {item.id}</Text> {/* Display ID */}
        <Text style={styles.userInfo}>Email: {item.email}</Text>
        <Text style={styles.userInfo}>Phone: {item.contact || "N/A"}</Text>
        <Text style={styles.userInfo}>
          Diet: {item.dietPreferences?.join(", ") || "None"}
        </Text>
        <Text style={styles.userInfo}>Cuisine: {item.cuisineInterests || "N/A"}</Text>
        <Text style={styles.userInfo}>Skill Level: {item.cookingSkillLevel || "N/A"}</Text>
        <Text style={styles.userInfo}>
          Notifications: {item.notificationsEnabled ? "Yes" : "No"}
        </Text>
        <Text style={styles.userInfo}>Allergy Alert: {item.allergyAlert ? "Yes" : "No"}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.id)}
        activeOpacity={0.7}
      >
        <Icon name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6600" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id?.toString() || item.email}
          renderItem={renderUser}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 28,
    fontWeight: "800",
    color: "#ff6600",
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  userImageContainer: {
    marginRight: 15,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ff6600",
  },
  userImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff6600",
  },
  userImagePlaceholderText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff6600",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: "#777",
    marginBottom: 3,
  },
  deleteButton: {
    backgroundColor: "#ff4500",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AdminDashboardScreen;