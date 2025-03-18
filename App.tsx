import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import RestaurantDetailsScreen from "./src/screens/RestaurantDetailsScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import { CartProvider } from "./src/context/CartContext";
import PaymentCompletionScreen from "./src/screens/PaymentCompletionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
            <Stack.Screen name="PaymentsComp" component={PaymentCompletionScreen} />
          </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
