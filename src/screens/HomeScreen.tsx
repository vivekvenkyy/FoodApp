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
import Icon from "react-native-vector-icons/Ionicons";

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
      image: require("../assets/pizza-hut.jpg"), // ✅ Added pizza restaurant
      category: "Pizza",
      rating: 4.8,
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

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={22} color="#555" />
        <TextInput
          placeholder="Search restaurants..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* 🏷️ Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Icon name={category.icon} size={18} color={"#fff"} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🍽️ Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("RestaurantDetails", { item })}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileImageContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ff6600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 70, // Adjusted to make space for profile image
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6600",
    padding: 10,
    marginRight: 8,
    borderRadius: 6,
  },
  selectedCategory: {
    backgroundColor: "#FF4500",
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "#FF6600",
  },
});

export default HomeScreen;
