import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient"; // Assuming installed

// Custom Checkbox Component
const CheckBox = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View
        style={[
          styles.checkbox,
          value ? styles.checkboxSelected : styles.checkboxUnselected,
        ]}
      >
        {value && <Text style={styles.checkboxCheckmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dietPreferences, setDietPreferences] = useState([
    { label: "Vegetarian", checked: false },
    { label: "Vegan", checked: false },
    { label: "Gluten-Free", checked: false },
  ]);
  const [cuisineInterests, setCuisineInterests] = useState("");
  const [cookingSkillLevel, setCookingSkillLevel] = useState(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [allergyAlert, setAllergyAlert] = useState(false);

  const API_BASE_URL = "http://192.168.1.202:9080";
  const LOGIN_ENDPOINT = `${API_BASE_URL}/api/users/email`;
  const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users`;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password");
        return false;
      }
    } else {
      if (!email || !username || !password || !confirmPassword || !phoneNumber) {
        Alert.alert("Error", "Please fill all fields");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return false;
      }
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert("Error", "Please enter a valid 10-digit phone number");
        return false;
      }
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return false;
      }
      if (!selectedImage) {
        Alert.alert("Error", "Please select a profile picture");
        return false;
      }
      if (!cuisineInterests) {
        Alert.alert("Error", "Please select a cuisine preference");
        return false;
      }
    }
    return true;
  };

  const toggleDietPreference = (index) => {
    const updatedPreferences = [...dietPreferences];
    updatedPreferences[index].checked = !updatedPreferences[index].checked;
    setDietPreferences(updatedPreferences);
  };

  const handleAuth = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const loginUrl = `${LOGIN_ENDPOINT}?email=${encodeURIComponent(email)}`;
        const response = await fetch(loginUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const userData = await response.json();
        if (!response.ok) {
          throw new Error(userData.message || "User not found");
        }
        if (userData.password !== password) {
          throw new Error("Invalid password");
        }
        const dummyToken = `token_${Date.now()}`;
        await AsyncStorage.setItem("userToken", dummyToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Redirect based on email
        if (email.toLowerCase() === "admin@gmail.com") {
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminDashboard" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }
      } else {
        const selectedDietPreferences = dietPreferences
          .filter((pref) => pref.checked)
          .map((pref) => pref.label);
        const signupResponse = await fetch(SIGNUP_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: username,
            password,
            contact: phoneNumber,
            role: "user",
            image: selectedImage,
            dietPreferences: selectedDietPreferences,
            cuisineInterests,
            cookingSkillLevel,
            notificationsEnabled,
            allergyAlert,
          }),
        });
        const signupData = await signupResponse.json();
        if (!signupResponse.ok) {
          throw new Error(signupData.message || "Signup failed");
        }
        const dummyToken = `token_${Date.now()}`;
        await AsyncStorage.setItem("userToken", dummyToken);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(signupData.user || {
            email,
            name: username,
            contact: phoneNumber,
            image: selectedImage,
            dietPreferences: selectedDietPreferences,
            cuisineInterests,
            cookingSkillLevel,
            notificationsEnabled,
            allergyAlert,
          })
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (error) {
      Alert.alert(
        isLogin ? "Login Failed" : "Signup Failed",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setSelectedImage(null);
    setCuisineInterests("");
    setDietPreferences([
      { label: "Vegetarian", checked: false },
      { label: "Vegan", checked: false },
      { label: "Gluten-Free", checked: false },
    ]);
    setCookingSkillLevel(5);
    setNotificationsEnabled(false);
    setAllergyAlert(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffede6" />
      <LinearGradient colors={["#ffede6", "#f8f8f8"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!isLogin && (
            <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImagePlaceholderText}>Add Profile Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/starbucks.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Foodie</Text>
          </View>
          <Text style={styles.headerText}>{isLogin ? "Welcome Back!" : "Create Account"}</Text>
          <Text style={styles.subHeaderText}>
            {isLogin ? "Sign in to continue" : "Sign up to get started"}
          </Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                <Text style={styles.label}>Preferred Cuisine:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={cuisineInterests}
                    onValueChange={(itemValue) => setCuisineInterests(itemValue)}
                  >
                    <Picker.Item label="Select Cuisine" value="" />
                    <Picker.Item label="Italian" value="italian" />
                    <Picker.Item label="Chinese" value="chinese" />
                    <Picker.Item label="Mexican" value="mexican" />
                    <Picker.Item label="Indian" value="indian" />
                    <Picker.Item label="Mediterranean" value="mediterranean" />
                  </Picker>
                </View>
                <Text style={styles.label}>Diet Preferences:</Text>
                <View style={styles.checkboxRowContainer}>
                  {dietPreferences.map((pref, index) => (
                    <CheckBox
                      key={index}
                      value={pref.checked}
                      label={pref.label}
                      onValueChange={() => toggleDietPreference(index)}
                    />
                  ))}
                </View>
                <Text style={styles.label}>Cooking Skill Level: {cookingSkillLevel}</Text>
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={cookingSkillLevel}
                  onValueChange={setCookingSkillLevel}
                  minimumTrackTintColor="#ff6600"
                  maximumTrackTintColor="#ddd"
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Enable Notifications</Text>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#767577", true: "#ff6600" }}
                    thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
                  />
                </View>
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Allergy Alerts</Text>
                  <Switch
                    value={allergyAlert}
                    onValueChange={setAllergyAlert}
                    trackColor={{ false: "#767577", true: "#ff6600" }}
                    thumbColor={allergyAlert ? "#fff" : "#f4f3f4"}
                  />
                </View>
              </>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
            >
              <LinearGradient
                colors={["#ff6600", "#ff4500"]}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? "Sign In" : "Sign Up"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.toggleButton}>
                  {isLogin ? "Sign Up" : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ff6600",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ff6600",
    marginTop: 10,
    letterSpacing: 1,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  toggleText: {
    color: "#777",
    fontSize: 16,
  },
  toggleButton: {
    color: "#ff6600",
    fontWeight: "700",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#ff6600",
    borderColor: "#ff6600",
  },
  checkboxUnselected: {
    borderColor: "#888",
  },
  checkboxCheckmark: {
    color: "white",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  checkboxRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImageContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#ff6600",
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff6600",
    borderStyle: "dashed",
  },
  profileImagePlaceholderText: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AuthScreen;