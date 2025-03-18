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

const AuthScreen = ({ navigation }) => {
  // State variables
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // API endpoints
  const API_BASE_URL = 'http://192.168.251.57:9080'; // Use 10.0.2.2 for Android emulator, localhost for iOS
  const LOGIN_ENDPOINT = `${API_BASE_URL}/api/users`;
  const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/users`;
  
  const validateForm = () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return false;
      }
    } else {
      if (!email || !username || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill all fields');
        return false;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }
      
      // Password validation
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
      
      // Confirm password validation
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    
    return true;
  };
  
  const handleAuth = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const endpoint = isLogin ? LOGIN_ENDPOINT : SIGNUP_ENDPOINT;
      const body = isLogin 
        ? JSON.stringify({ email, password }) 
        : JSON.stringify({ email, username, password });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Store auth token in AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        
        // Store user info if available
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }
      }
      
      // Navigate to Home screen after successful auth
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      
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
    // Clear fields when switching modes
    setPassword('');
    setConfirmPassword('');
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
            source={require('../assets/starbucks.jpg')} // Replace with your logo path
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
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
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
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6600',
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
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
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
  },
  toggleButton: {
    color: '#ff6600',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AuthScreen;