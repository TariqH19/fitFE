import React, { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { RAPID_API_KEY } from "@env";

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
            "X-RapidAPI-Key": `${RAPID_API_KEY}`,
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
        setError("");
      })
      .catch((error) => {
        // console.error(error);
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
      // console.error("Error saving to local storage:", error);
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
        // console.error("Error loading from local storage:", error);
      }
    };

    loadHistoryFromStorage();
  }, []);

  return (
    <>
      <ScrollView style={{ padding: 16 }}>
        <Text
          variant="displaySmall"
          style={{ color: "black", padding: 12, textAlign: "center" }}>
          Calculate your BMI
        </Text>
        <TextInput
          mode="outlined"
          textColor="black"
          placeholderTextColor="black"
          style={{
            backgroundColor: "#F1F7FF",
            margin: 12,
          }}
          placeholder="Height (cm)"
          value={height}
          onChangeText={(text) => setHeight(text)}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          textColor="black"
          placeholderTextColor="black"
          style={{
            backgroundColor: "#F1F7FF",
            margin: 12,
          }}
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
            <Text variant="displaySmall" style={{ color: "black" }}>
              Your BMI:
            </Text>
            <Text style={{ color: "black" }}>BMI: {bmiResult.bmi}</Text>
            <Text style={{ color: "black" }}>Status: {bmiResult.status}</Text>
          </>
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
  rText: {
    fontSize: 24,
    marginBottom: 8,
  },
  subheader: {
    marginBottom: 16,
    color: "#888",
    fontWeight: "400",
    fontSize: 36,
  },
});
