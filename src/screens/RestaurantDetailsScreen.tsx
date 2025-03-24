// import React, { useState, useEffect } from "react";
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const RestaurantDetailsScreen = ({ route, navigation }) => {
//   const { item } = route.params || {};
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     // Calculate total price whenever cart items change
//     const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     setTotalPrice(newTotal);
//   }, [cartItems]);

//   if (!item) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: No restaurant details found.</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const addToCart = (menuItem) => {
//     setCartItems(prevItems => {
//       // Check if item already exists in cart
//       const existingItemIndex = prevItems.findIndex(
//         item => item.name === menuItem.name
//       );

//       if (existingItemIndex >= 0) {
//         // Item exists, increment quantity
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: updatedItems[existingItemIndex].quantity + 1
//         };
//         return updatedItems;
//       } else {
//         // Item doesn't exist, add new item with quantity 1
//         return [...prevItems, { ...menuItem, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (menuItem) => {
//     setCartItems(prevItems => {
//       const existingItemIndex = prevItems.findIndex(
//         item => item.name === menuItem.name
//       );

//       if (existingItemIndex >= 0) {
//         const updatedItems = [...prevItems];
//         if (updatedItems[existingItemIndex].quantity > 1) {
//           // Reduce quantity if more than 1
//           updatedItems[existingItemIndex] = {
//             ...updatedItems[existingItemIndex],
//             quantity: updatedItems[existingItemIndex].quantity - 1
//           };
//           return updatedItems;
//         } else {
//           // Remove item if quantity is 1
//           return prevItems.filter(item => item.name !== menuItem.name);
//         }
//       }
//       return prevItems;
//     });
//   };

//   const getItemQuantity = (menuItem) => {
//     const item = cartItems.find(item => item.name === menuItem.name);
//     return item ? item.quantity : 0;
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       Alert.alert("Empty Cart", "Please add items to your cart before checking out");
//       return;
//     }
    
//     // Navigate to cart screen with cart items and restaurant info
//     navigation.navigate("Cart", { 
//       cartItems, 
//       restaurantName: item.name,
//       totalPrice
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {/* Restaurant Image */}
//         <Image source={item.image} style={styles.image} />

//         {/* Back Button */}
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>

//         {/* Restaurant Info */}
//         <View style={styles.header}>
//           <Text style={styles.title}>{item.name}</Text>
//           <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
//         </View>

//         <Text style={styles.description}>{item.description || "No description available."}</Text>

//         {/* Menu Section */}
//         <Text style={styles.sectionTitle}>Menu</Text>
//         {item.menu && Array.isArray(item.menu) && item.menu.length > 0 ? (
//           item.menu.map((menuItem, index) => (
//             <View key={index} style={styles.menuItem}>
//               <Text style={styles.menuText}>{menuItem.name}</Text>
              
//               <View style={styles.menuActionContainer}>
//                 <Text style={styles.menuPrice}>₹{menuItem.price}</Text>
                
//                 <View style={styles.quantityControls}>
//                   <TouchableOpacity 
//                     style={styles.quantityButton} 
//                     onPress={() => removeFromCart(menuItem)}
//                     disabled={getItemQuantity(menuItem) === 0}
//                   >
//                     <Text style={[
//                       styles.quantityButtonText, 
//                       getItemQuantity(menuItem) === 0 ? styles.disabledButton : null
//                     ]}>-</Text>
//                   </TouchableOpacity>
                  
//                   <Text style={styles.quantityText}>{getItemQuantity(menuItem)}</Text>
                  
//                   <TouchableOpacity 
//                     style={styles.quantityButton} 
//                     onPress={() => addToCart(menuItem)}
//                   >
//                     <Text style={styles.quantityButtonText}>+</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noMenu}>No menu available.</Text>
//         )}
        
//         {/* Add some space at the bottom */}
//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Order Summary & Checkout Button */}
//       {cartItems.length > 0 && (
//         <View style={styles.orderSummary}>
//           <View style={styles.totalContainer}>
//             <Text style={styles.totalItems}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</Text>
//             <Text style={styles.totalPrice}>₹{totalPrice}</Text>
//           </View>
//           <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
//             <Text style={styles.checkoutButtonText}>Checkout</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Floating Cart Button - only show when cart is empty */}
//       {cartItems.length === 0 && (
//         <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
//           <Icon name="cart-outline" size={28} color="white" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f8f8",
//   },
//   image: {
//     width: "100%",
//     height: 200,
//   },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 16,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 20,
//     padding: 8,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   rating: {
//     fontSize: 16,
//     color: "#ff6600",
//   },
//   description: {
//     fontSize: 16,
//     color: "#555",
//     paddingHorizontal: 16,
//     marginVertical: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//     marginBottom: 5,
//     paddingHorizontal: 16,
//   },
//   menuItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 6,
//     marginHorizontal: 16,
//   },
//   menuText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   menuActionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   menuPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#ff6600",
//     marginRight: 10,
//   },
//   quantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//     borderRadius: 15,
//     paddingHorizontal: 5,
//   },
//   quantityButton: {
//     width: 30,
//     height: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   quantityButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ff6600",
//   },
//   disabledButton: {
//     color: "#ccc",
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginHorizontal: 5,
//     minWidth: 20,
//     textAlign: "center",
//   },
//   noMenu: {
//     fontSize: 16,
//     color: "#888",
//     paddingHorizontal: 16,
//     marginTop: 10,
//   },
//   cartButton: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "#ff6600",
//     borderRadius: 50,
//     padding: 15,
//     elevation: 5,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//   },
//   orderSummary: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     padding: 16,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   totalContainer: {
//     flex: 1,
//   },
//   totalItems: {
//     fontSize: 14,
//     color: "#888",
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   checkoutButton: {
//     backgroundColor: "#ff6600",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   checkoutButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default RestaurantDetailsScreen;


import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";

const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params || {};
  const { cart, addToCart, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No restaurant details found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getItemQuantity = (menuItem) => {
    const cartItem = cart.find(item => item.name === menuItem.name);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (menuItem) => {
    // Add restaurant information to the menu item
    const itemWithRestaurantInfo = {
      ...menuItem,
      restaurantName: item.name,
      restaurantId: item.id, // Assuming item has an id
      id: menuItem.id || `${item.id}-${menuItem.name}` // Create a unique id if not provided
    };
    
    addToCart(itemWithRestaurantInfo);
  };

  const handleRemoveFromCart = (menuItem) => {
    const cartItem = cart.find(item => item.name === menuItem.name);
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checking out");
      return;
    }
    
    // Navigate to cart screen (the context will provide the cart data)
    navigation.navigate("Cart");
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Restaurant Image */}
        <Image source={item.image} style={styles.image} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Restaurant Info */}
        <View style={styles.header}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
        </View>

        <Text style={styles.description}>{item.description || "No description available."}</Text>

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
                    style={styles.quantityButton} 
                    onPress={() => handleRemoveFromCart(menuItem)}
                    disabled={getItemQuantity(menuItem) === 0}
                  >
                    <Text style={[
                      styles.quantityButtonText, 
                      getItemQuantity(menuItem) === 0 ? styles.disabledButton : null
                    ]}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{getItemQuantity(menuItem)}</Text>
                  
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
        
        {/* Add some space at the bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Order Summary & Checkout Button */}
      {totalItems > 0 && (
        <View style={styles.orderSummary}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalItems}>{totalItems} items</Text>
            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Cart Button - only show when cart is empty */}
      {totalItems === 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <Icon name="cart-outline" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "100%",
    height: 200,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    color: "#ff6600",
  },
  description: {
    fontSize: 16,
    color: "#555",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    marginHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  menuActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6600",
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6600",
  },
  disabledButton: {
    color: "#ccc",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 5,
    minWidth: 20,
    textAlign: "center",
  },
  noMenu: {
    fontSize: 16,
    color: "#888",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff6600",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  orderSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  totalContainer: {
    flex: 1,
  },
  totalItems: {
    fontSize: 14,
    color: "#888",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  checkoutButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RestaurantDetailsScreen;