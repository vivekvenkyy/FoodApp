import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Use Expo's LinearGradient
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = [
  { id: "1", name: "All", icon: "grid-outline" },
  { id: "2", name: "Fast Food", icon: "fast-food-outline" },
  { id: "3", name: "Pizza", icon: "pizza-outline" },
  { id: "4", name: "Desserts", icon: "ice-cream-outline" },
  { id: "5", name: "Drinks", icon: "cafe-outline" },
];

const restaurantData = [
  {
    id: "1",
    name: "Burger King",
    image: require("../assets/burger-king.jpg"),
    category: "Fast Food",
    rating: 4.5,
    description: "Savor flame-grilled burgers and crispy fries at this fast food favorite.",
    menu: [
      { name: "Whopper", price: 199 },
      { name: "Cheese Burger", price: 149 },
      { name: "Crispy Chicken Burger", price: 179 },
      { name: "French Fries", price: 99 },
    ],
  },
  {
    id: "2",
    name: "Sweet Tooth Desserts",
    image: require("../assets/desserts.jpg"),
    category: "Desserts",
    rating: 4.7,
    description: "Indulge in heavenly sweets crafted with love and a touch of magic.",
    menu: [
      { name: "Chocolate Lava Cake", price: 249 },
      { name: "Blueberry Cheesecake", price: 299 },
      { name: "Tiramisu", price: 350 },
      { name: "Macarons (6 pcs)", price: 200 },
    ],
  },
  {
    id: "3",
    name: "Starbucks",
    image: require("../assets/starbucks.jpg"),
    category: "Drinks",
    rating: 4.6,
    description: "Your go-to spot for rich coffee blends and refreshing beverages.",
    menu: [
      { name: "Cappuccino", price: 199 },
      { name: "Caramel Macchiato", price: 249 },
      { name: "Iced Latte", price: 179 },
      { name: "Mocha Frappe", price: 229 },
    ],
  },
  {
    id: "4",
    name: "Pizza Hut",
    image: require("../assets/pizza-hut.jpg"),
    category: "Pizza",
    rating: 4.8,
    description: "Enjoy hand-tossed pizzas loaded with your favorite toppings.",
    menu: [
      { name: "Margherita Pizza", price: 299 },
      { name: "Pepperoni Pizza", price: 349 },
      { name: "BBQ Chicken Pizza", price: 399 },
      { name: "Veggie Supreme", price: 329 },
    ],
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRestaurants = restaurantData.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      // Reset navigation to AuthScreen
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Delivery</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#ff6600", "#ff4500"]}
            style={styles.logoutGradient}
          >
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={26} color="#ff6600" />
        <TextInput
          placeholder="Search restaurants..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Explore Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.name)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryIconContainer}>
              <Icon name={category.icon} size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Restaurant List */}
      <Text style={styles.sectionTitle}>Top Restaurants</Text>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("RestaurantDetails", { item })}
            activeOpacity={0.85}
          >
            <Image source={item.image} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
              style={styles.imageOverlay}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.categoryTag}>{item.category}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={18} color="#FFD700" />
                <Text style={styles.rating}> {item.rating} / 5</Text>
              </View>
              <TouchableOpacity style={styles.viewMenuButton}>
                <Text style={styles.viewMenuText}>Explore Menu</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    paddingTop: 40, // Extra padding for status bar
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6600",
    letterSpacing: 1,
  },
  logoutButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 102, 0, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginVertical: 15,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 15,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#ff4500",
    backgroundColor: "#ff6600",
    borderRadius: 50,
    shadowColor: "#ff4500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryIconContainer: {
    backgroundColor: "#ff6600",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  info: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 16,
    color: "#777",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  viewMenuButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  viewMenuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  flatListContent: {
    paddingBottom: 30,
  },
});

export default HomeScreen;