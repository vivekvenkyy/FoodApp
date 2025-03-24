import React, { useState } from 'react';
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
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dummy profile images (replace this logic with any local images you'd like to use)
const dummyImages = [
  require('../assets/avatar1.jpg'),
  require('../assets/avatar2.jpg'),
  require('../assets/avatar3.jpg'),
];

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Added state for profile photo

  const API_BASE_URL = 'http://192.168.131.57:9080';
  const LOGIN_ENDPOINT = `${API_BASE_URL}/api/users/email`;
  const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users`;

  const validateForm = () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return false;
      }
    } else {
      if (!email || !username || !password || !confirmPassword || !phoneNumber) {
        Alert.alert('Error', 'Please fill all fields');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return false;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }

      if (!selectedImage) {
        Alert.alert('Error', 'Please select a profile picture');
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // For login, fetch the user data by email first
        const loginUrl = `${LOGIN_ENDPOINT}?email=${encodeURIComponent(email)}`;
        
        const response = await fetch(loginUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const userData = await response.json();

        if (!response.ok) {
          throw new Error(userData.message || 'User not found');
        }

        // Compare the password from form with the password from API response
        if (userData.password !== password) {
          throw new Error('Invalid password');
        }

        // If password matches, store user data
        if (userData) {
          // Create a token (in a real app, the backend would provide this)
          const dummyToken = `token_${Date.now()}`;
          await AsyncStorage.setItem('userToken', dummyToken);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } else {
        // For signup, use the original signup endpoint
        const signupResponse = await fetch(SIGNUP_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name: username,
            password,
            contact: phoneNumber,
            role: "user",
            image: selectedImage,
          }),
        });

        const signupData = await signupResponse.json();

        if (!signupResponse.ok) {
          throw new Error(signupData.message || 'Signup failed');
        }

        // If signup successful, store user data
        if (signupData) {
          // Create a token (in a real app, the backend would provide this)
          const dummyToken = `token_${Date.now()}`;
          await AsyncStorage.setItem('userToken', dummyToken);
          
          if (signupData.user) {
            await AsyncStorage.setItem('userData', JSON.stringify(signupData.user));
          } else {
            await AsyncStorage.setItem('userData', JSON.stringify({
              email,
              name: username,
              contact: phoneNumber,
              image: selectedImage
            }));
          }
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      }
    } catch (error) {
      Alert.alert(
        isLogin ? 'Login Failed' : 'Signup Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/starbucks.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Foodie</Text>
        </View>

        <Text style={styles.headerText}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>
        <Text style={styles.subHeaderText}>
          {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
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

              {/* Avatar Selector */}
              <Text style={styles.label}>Select Profile Picture:</Text>
              <View style={styles.avatarContainer}>
                {dummyImages.map((img, index) => (
                  <TouchableOpacity key={index} onPress={() => setSelectedImage(`avatar${index + 1}.png`)}>
                    <Image
                      source={img}
                      style={[
                        styles.avatar,
                        selectedImage === `avatar${index + 1}.png` && styles.avatarSelected,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
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
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleButton}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#ff6600', marginTop: 10 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  subHeaderText: { fontSize: 16, color: '#666', marginBottom: 30 },
  formContainer: { width: '100%' },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  authButton: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  authButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  toggleText: { color: '#666', fontSize: 14 },
  toggleButton: { color: '#ff6600', fontWeight: 'bold', fontSize: 14 },
  avatarContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#ddd' },
  avatarSelected: { borderColor: '#ff6600', borderWidth: 3 },
  label: { marginBottom: 8, color: '#333', fontWeight: 'bold' },
});

export default AuthScreen;