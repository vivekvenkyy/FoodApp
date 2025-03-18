import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Slider, Picker, CheckBox, FlatList } from "react-native";
import * as SQLite from 'expo-sqlite';

// Open or create the DB
const db = SQLite.openDatabase('feedback.db');

const RateExperienceScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recommend, setRecommend] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('Fast');
  const [savedFeedbacks, setSavedFeedbacks] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, rating INT, feedback TEXT, recommend INT, deliveryTime TEXT);"
      );
    });
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = () => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM feedback", [], (_, { rows }) => {
        setSavedFeedbacks(rows._array);
      });
    });
  };

  const saveFeedback = () => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO feedback (rating, feedback, recommend, deliveryTime) VALUES (?, ?, ?, ?)",
        [rating, feedback, recommend ? 1 : 0, deliveryTime],
        () => {
          fetchFeedbacks();
          setRating(0);
          setFeedback('');
          setRecommend(false);
          setDeliveryTime('Fast');
          alert("Thank you for your feedback!");
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>

      {/* Star Rating */}
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Text style={styles.star}>{num <= rating ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Text */}
      <TextInput
        placeholder="Leave a feedback..."
        value={feedback}
        onChangeText={setFeedback}
        style={styles.input}
      />

      {/* Recommend Checkbox */}
      <View style={styles.row}>
        <CheckBox value={recommend} onValueChange={setRecommend} />
        <Text>Would you recommend us?</Text>
      </View>

      {/* Dropdown for Delivery Time */}
      <Picker
        selectedValue={deliveryTime}
        onValueChange={(itemValue) => setDeliveryTime(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Fast" value="Fast" />
        <Picker.Item label="Average" value="Average" />
        <Picker.Item label="Slow" value="Slow" />
      </Picker>

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={saveFeedback}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>

      {/* Saved Feedbacks */}
      <FlatList
        data={savedFeedbacks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.savedItem}>
            <Text>⭐ {item.rating} - {item.feedback}</Text>
            <Text>Recommend: {item.recommend ? 'Yes' : 'No'}, Delivery: {item.deliveryTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  starContainer: { flexDirection: "row", marginBottom: 16 },
  star: { fontSize: 32, marginHorizontal: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 10 },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  savedItem: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 }
});

export default RateExperienceScreen;
