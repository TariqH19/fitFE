import React, { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { View } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const HealthPage = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBMIResult] = useState(null);
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
      })
      .catch((error) => {
        console.error(error);
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
      <ScrollView>
        <Text>Health Page</Text>
        <TextInput
          placeholder="Height (cm)"
          value={height}
          onChangeText={(text) => setHeight(text)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={(text) => setWeight(text)}
          keyboardType="numeric"
        />
        <Button title="Calculate BMI" onPress={calculateBMI}>
          Calculate BMI
        </Button>
        {bmiResult && (
          <>
            <Text>BMI: {bmiResult.bmi}</Text>
            <Text>Status: {bmiResult.status}</Text>
          </>
        )}

        <Text>History:</Text>
        {history.map((item, index) => (
          <View key={index}>
            <Text>Date: {item.date}</Text>
            <Text>Height: {item.height} cm</Text>
            <Text>Weight: {item.weight} kg</Text>
            <Text>BMI: {item.bmi}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default HealthPage;
