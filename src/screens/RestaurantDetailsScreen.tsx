import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed
import Icon from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params || {};
  const { cart, addToCart, removeFromCart, getTotalPrice, getTotalItems } =
    useContext(CartContext);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No restaurant details found.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonError}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getItemQuantity = (menuItem) =>
    cart.find((cartItem) => cartItem.name === menuItem.name)?.quantity || 0;

  const handleAddToCart = (menuItem) => {
    const itemWithRestaurantInfo = {
      ...menuItem,
      restaurantName: item.name,
      restaurantId: item.id,
      id: menuItem.id || `${item.id}-${menuItem.name}`,
    };
    addToCart(itemWithRestaurantInfo);
  };

  const handleRemoveFromCart = (menuItem) => {
    const cartItem = cart.find((item) => item.name === menuItem.name);
    if (cartItem) removeFromCart(cartItem.id);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checking out");
      return;
    }
    navigation.navigate("Cart");
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={styles.imageOverlay}
          >
            <Text style={styles.imageTitle}>{item.name}</Text>
          </LinearGradient>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoCard}>
          <View style={styles.header}>
            <Text style={styles.rating}>
              <Icon name="star" size={18} color="#FFD700" /> {item.rating} / 5
            </Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* Menu Section */}
        <Text style={styles.sectionTitle}>Menu</Text>
        {item.menu && Array.isArray(item.menu) && item.menu.length > 0 ? (
          item.menu.map((menuItem, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuText}>{menuItem.name}</Text>
              <View style={styles.menuActionContainer}>
                <Text style={styles.menuPrice}>₹{menuItem.price}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      getItemQuantity(menuItem) === 0 && styles.disabledButton,
                    ]}
                    onPress={() => handleRemoveFromCart(menuItem)}
                    disabled={getItemQuantity(menuItem) === 0}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {getItemQuantity(menuItem)}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleAddToCart(menuItem)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noMenu}>No menu available.</Text>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Order Summary & Checkout Button */}
      {totalItems > 0 && (
        <LinearGradient
          colors={["#ff6600", "#ff4500"]}
          style={styles.orderSummary}
        >
          <View style={styles.totalContainer}>
            <Text style={styles.totalItems}>{totalItems} items</Text>
            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Floating Cart Button */}
      {totalItems === 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="cart-outline" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: "flex-end",
    padding: 20,
  },
  imageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  rating: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    fontStyle: "italic", // Adds a subtle flair
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  menuActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff6600",
    marginRight: 15,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#ff6600",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 10,
    minWidth: 25,
    textAlign: "center",
  },
  noMenu: {
    fontSize: 16,
    color: "#888",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  cartButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#ff6600",
    borderRadius: 30,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  orderSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalContainer: {
    flex: 1,
  },
  totalItems: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  checkoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: "#ff6600",
    fontSize: 18,
    fontWeight: "700",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    fontSize: 18,
    color: "#ff4444",
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: "#ff6600",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RestaurantDetailsScreen;