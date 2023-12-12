import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Button, Text, TextInput } from "react-native-paper";
import axios from "axios";
import { useSession } from "../../../contexts/AuthContext";
import UserInfo from "../../../services/User";
import DeleteBtn from "../../../components/DeleteBtn";

const WeightTracker = () => {
  const [weights, setWeights] = useState([]);
  const weightChartRef = useRef(null);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");
  const { session } = useSession();
  const [currentWeight, setCurrentWeight] = useState({ weight: 0 });
  const user = UserInfo();
  const userId = user._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://gym-api-omega.vercel.app/api/weights",
          {
            headers: {
              Authorization: `Bearer ${session}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );

        const savedWeights = response.data;

        if (Array.isArray(savedWeights) && savedWeights.length > 0) {
          setWeights(savedWeights);
          setCurrentWeight({ weight: savedWeights[0].weight || 0 });
        }
      } catch (error) {
        console.error("Error fetching weights:", error);
        setError("Error fetching weights. Please try again.");
      }
    };

    fetchData();

    const sortedWeights = [...weights].sort((a, b) => b.date - a.date);

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

      setError("");

      return;
    }
  }, [session]);

  const addWeight = async () => {
    if (!inputText || isNaN(parseFloat(inputText))) {
      setError("Please enter a valid weight.");
      return;
    }

    setError("");

    const newWeight = {
      weight: parseFloat(inputText),
      date: new Date().toISOString(),
      user: userId,
    };
    setInputText("");

    try {
      const response = await axios.post(
        "https://gym-api-omega.vercel.app/api/weights/",
        newWeight,
        {
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state with the new weight
      setWeights((prevWeights) => [...prevWeights, response.data]);
      setCurrentWeight({ weight: response.data.weight });
    } catch (error) {
      console.error("Error adding weight:", error);
      setError("Error adding weight. Please try again.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          variant="displaySmall"
          style={{ textAlign: "center", padding: 12, color: "black" }}>
          Weight Tracker
        </Text>
        <View style={styles.current}>
          <Text style={styles.currentWeight}>
            {weights.length > 0 ? currentWeight.weight : "0"}
          </Text>
          <Text style={styles.currentWeightLabel}>Current Weight (kg)</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            mode="outlined"
            textColor="black"
            placeholderTextColor="black"
            style={{
              backgroundColor: "#F1F7FF",
            }}
            keyboardType="numeric"
            placeholder={`Current Weight ${
              weights.length > 0 ? currentWeight.weight : "0"
            }`}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <Button textColor="black" onPress={addWeight} style={styles.button}>
            Add Weight
          </Button>
        </View>

        <Text>
          {error && (
            <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
          )}
        </Text>

        {weights.length > 0 && (
          <View>
            <Text style={styles.subheader}>Recent Weight Logs</Text>
            <View style={styles.canvasBox}>
              <LineChart
                data={{
                  labels: weights
                    .slice(-4)
                    .map((w) => new Date(w.date).toLocaleDateString()),
                  datasets: [
                    {
                      data: weights.slice(-4).map((w) => w.weight),
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
                {weights
                  .slice(-7)
                  .reverse()
                  .map((weight) => (
                    <View key={weight.date} style={styles.weightItem}>
                      <Text style={{ color: "black" }}>{weight.weight} kg</Text>
                      <Text style={{ color: "black" }}>
                        {new Date(weight.date).toLocaleDateString()}
                      </Text>
                      <DeleteBtn
                        resource="weights"
                        _id={weight._id}
                        deleteCallback={(id) =>
                          setWeights((prevWeights) =>
                            prevWeights.filter((e) => e._id !== id)
                          )
                        }
                      />
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
    borderWidth: 5,
    borderColor: "#888",
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
    color: "#888",
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
