import React, { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

export default function HealthPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBMIResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const calculateBMI = () => {
    axios
      .get(
        `https://simple-bmi-calculator1.p.rapidapi.com/calculate/metric/${height}/${weight}`,
        {
          headers: {
            "X-RapidAPI-Key":
              "64c994b82amshb95f1bf42b1a9adp1d2357jsneb75b8047114",
            "X-RapidAPI-Host": "simple-bmi-calculator1.p.rapidapi.com",
          },
        }
      )
      .then((response) => {
        const newBMIResult = response.data;
        setBMIResult(newBMIResult);
        // Save to local storage
        saveToHistory(newBMIResult);
        setHeight("");
        setWeight("");
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong! Please try again.");
      });
  };

  const saveToHistory = async (newBMIResult) => {
    try {
      const historyItem = {
        date: new Date().toLocaleDateString(),
        height,
        weight,
        bmi: newBMIResult.bmi,
        status: newBMIResult.status,
      };

      const existingHistory = await AsyncStorage.getItem("bmiHistory");
      const parsedHistory = existingHistory ? JSON.parse(existingHistory) : [];
      const updatedHistory = [...parsedHistory, historyItem];

      await AsyncStorage.setItem("bmiHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  useEffect(() => {
    const loadHistoryFromStorage = async () => {
      try {
        const existingHistory = await AsyncStorage.getItem("bmiHistory");
        const parsedHistory = existingHistory
          ? JSON.parse(existingHistory)
          : [];
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Error loading from local storage:", error);
      }
    };

    loadHistoryFromStorage();
  }, []);

  return (
    <>
      <ScrollView style={{ padding: 16 }}>
        <Text style={styles.header}>Calculate your BMI</Text>
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          value={height}
          onChangeText={(text) => setHeight(text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={(text) => setWeight(text)}
          keyboardType="numeric"
        />
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        <Button
          style={{ marginBottom: 16 }}
          mode="contained"
          title="Calculate BMI"
          onPress={calculateBMI}>
          Calculate BMI
        </Button>
        {bmiResult && (
          <>
            <Text>BMI: {bmiResult.bmi}</Text>
            <Text>Status: {bmiResult.status}</Text>
          </>
        )}

        <Text style={styles.subheader}>Your Past BMI:</Text>
        {history.length > 0 && (
          <View>
            <Text style={styles.weightText}>
              Date: {history[history.length - 1].date}
            </Text>
            <Text style={styles.weightText}>
              Height: {history[history.length - 1].height} cm
            </Text>
            <Text style={styles.weightText}>
              Weight: {history[history.length - 1].weight} kg
            </Text>
            <Text style={styles.weightText}>
              BMI: {history[history.length - 1].bmi}
            </Text>
            <Text style={styles.weightText}>
              Status: {history[history.length - 1].status}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  weightText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheader: {
    marginBottom: 16,
    color: "#888",
    fontWeight: "400",
    fontSize: 24,
  },
});
