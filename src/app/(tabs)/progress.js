import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Button } from "react-native-paper";
const WeightTracker = () => {
  const weights = useRef([]);
  const weightChartRef = useRef(null);
  const weightInputRef = useRef(null);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");
  const [currentWeight, setCurrentWeight] = useState({ weight: 0 });

  useEffect(() => {
    loadWeightsFromLocalStorage(); // Fetch weights from local storage on mount
  }, []);

  useEffect(() => {
    const sortedWeights = [...weights.current].sort((a, b) => b.date - a.date);

    if (weightChartRef.current) {
      const labels = sortedWeights
        .map((w) => new Date(w.date).toLocaleDateString())
        .slice(-7);
      const data = sortedWeights.map((w) => w.weight).slice(-7);

      weightChartRef.current.setLabels(labels);
      weightChartRef.current.setData([
        { data, color: () => "rgba(255,105,180,0.2)" },
      ]);
      weightChartRef.current.updateChart();

      saveWeightsToLocalStorage();
      return;
    }

    setTimeout(() => {
      const labels = sortedWeights.map((w) =>
        new Date(w.date).toLocaleDateString()
      );
      const data = sortedWeights.map((w) => w.weight).slice(-7);

      weightChartRef.current = {
        setLabels: () => {},
        setData: () => {},
        updateChart: () => {},
      };

      saveWeightsToLocalStorage();
    }, 0);
  }, [weights]);

  const addWeight = () => {
    if (!inputText || isNaN(parseFloat(inputText))) {
      setError("Please enter a valid weight.");
      return;
    }

    setError(""); // Clear the error if input is valid

    const newWeight = {
      weight: parseFloat(inputText),
      date: new Date().getTime(),
    };
    setInputText("");

    weights.current.push(newWeight);
    setCurrentWeight({ weight: newWeight.weight });
    saveWeightsToLocalStorage();
  };

  const saveWeightsToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem("weights", JSON.stringify(weights.current));
    } catch (error) {
      console.error("Error saving weights to local storage:", error);
    }
  };

  const loadWeightsFromLocalStorage = async () => {
    try {
      const savedWeights = await AsyncStorage.getItem("weights");
      if (savedWeights) {
        weights.current = JSON.parse(savedWeights);
        setCurrentWeight({ weight: weights.current[0]?.weight || 0 });
      }
    } catch (error) {
      console.error("Error loading weights from local storage:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Weight Tracker</Text>
        <View style={styles.current}>
          <Text style={styles.currentWeight}>{currentWeight.weight}</Text>
          <Text style={styles.currentWeightLabel}>Current Weight (kg)</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={`Current Weight ${currentWeight.weight}`}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />

          <Button onPress={addWeight} style={styles.button}>
            Add Weight
          </Button>
        </View>
        {error && (
          <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
        )}

        {weights.current.length > 0 && (
          <View>
            <Text style={styles.subheader}>Last 3 days</Text>
            <View style={styles.canvasBox}>
              <LineChart
                data={{
                  labels: weights.current
                    .slice(-3)
                    .map((w) => new Date(w.date).toLocaleDateString()),
                  datasets: [
                    {
                      data: weights.current.slice(-3).map((w) => w.weight),
                      color: (opacity = 1) => `rgba(255,105,180,0.2)`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 64}
                height={220}
                yAxisLabel=""
                yAxisSuffix="kg"
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>

            <View style={styles.weightHistory}>
              <Text style={styles.subheader}>Weight History</Text>
              <ScrollView>
                {weights.current
                  .slice(-7)
                  .reverse()
                  .map((weight) => (
                    <View key={weight.date} style={styles.weightItem}>
                      <Text style={styles.weightText}>{weight.weight} kg</Text>
                      <Text style={styles.dateText}>
                        {new Date(weight.date).toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  current: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    textAlign: "center",
    borderRadius: 999,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    border: 5,
    borderColor: "hwb(330 41% 0%)",
    margin: "auto",
    marginBottom: 16,
    backgroundColor: "#6952A9",
    alignSelf: "center",
  },
  currentWeight: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  currentWeightLabel: {
    color: "#fff",
    fontStyle: "italic",
  },
  form: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  subheader: {
    marginBottom: 16,
    color: "#888",
    fontWeight: "400",
  },
  canvasBox: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    marginBottom: 16,
  },
  weightHistory: {},
  weightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    cursor: "pointer",
  },
  weightText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  dateText: {
    color: "#888",
    fontStyle: "italic",
  },
  button: {
    padding: 8,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WeightTracker;
