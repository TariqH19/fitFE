import React, { useState, useEffect } from "react";
import { View } from "react-native";
import MultiSelect from "react-native-multiple-select";
import { Stack } from "expo-router";
import {
  Card,
  Text,
  Button,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addWorkout, editWorkout } from "../../../services/ApiCalls";
import UserInfo from "../../../services/User";
import DeleteBtn from "../../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../../contexts/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([] as any);
  const [exercises, setExercises] = useState([] as any);
  const [selectedWorkout, setSelectedWorkout] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    exercises: [] as any,
    notes: "",
    user: "",
  });
  const { session }: any = useSession();
  const user = UserInfo();
  const userId = user._id;

  const toggleModal = (workout: any) => {
    setSelectedWorkout(workout);
    setIsModalVisible(!isModalVisible);
  };

  const handleEdit = async () => {
    try {
      // Call the editWorkout function to update the selected workout
      const editedWorkout = await editWorkout(
        selectedWorkout._id, // Pass the ID of the selected workout
        form,
        session
      );

      setWorkouts((prevWorkouts: any) =>
        prevWorkouts.map((workout: any) =>
          workout._id === selectedWorkout._id ? editedWorkout : workout
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      // console.log("Workout edited:", editedWorkout);
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error editing workout:", error);
    }
  };

  const handleAddWorkout = async () => {
    try {
      // Include the user property in the form with the user id
      const addedWorkout = await addWorkout({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setWorkouts([...workouts, addedWorkout] as any);
      // console.log("Workout added:", addedWorkout);

      // Reset the form or perform any other actions after successful submission
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error adding workout:", error);
    }
  };

  useEffect(() => {
    setLoading(true);

    axios
      .get("https://gym-api-omega.vercel.app/api/userData/", {
        headers: {
          Authorization: `Bearer ${session}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data);
        const { workout, exercise } = response.data;
        setWorkouts(workout);
        setExercises(exercise);
        setLoading(false);
      });
    if (selectedWorkout) {
      // If a workout is selected for editing, set its values in the form
      setError("");
      setForm({
        name: selectedWorkout.name || "",
        exercises: selectedWorkout.exercises || [],
        notes: selectedWorkout.notes || "",
        user: userId,
      });
    } else {
      // If no workout is selected, reset the form
      setError("");
      setForm({
        name: "",
        exercises: [],
        notes: "",
        user: userId,
      });
    }
  }, [session, isModalVisible]);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Workouts` }} />
      <ScrollView>
        <View style={{ flex: 1, gap: 10, padding: 16 }}>
          <Button mode="contained" onPress={() => toggleModal(null)}>
            Add Workout
          </Button>

          {!workouts.length && !loading && (
            <Text style={{ textAlign: "center", color: "black" }}>
              You have no workouts yet. Add one above.
            </Text>
          )}

          {loading && <ActivityIndicator />}

          {workouts.map((workout: any) => (
            <Card style={{ backgroundColor: "#F1F7FF" }} key={workout._id}>
              <Card.Content>
                <Text style={{ color: "black" }}>{workout.name}</Text>
                <Text style={{ color: "black" }}>{workout.notes}</Text>

                {/* Map through exercises associated with the current workout */}
                <Text style={{ color: "black" }}>
                  {exercises
                    .filter((exercise: any) =>
                      workout.exercises.includes(exercise._id)
                    )
                    .map((exercise: any) => (
                      <Text
                        style={{ color: "black" }}
                        key={exercise._id}>{`${exercise.name} `}</Text>
                    ))}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  textColor="black"
                  style={{ margin: 12 }}
                  onPress={() => toggleModal(workout)}>
                  Edit
                </Button>
                <DeleteBtn
                  resource="workouts"
                  _id={workout._id}
                  deleteCallback={(id) =>
                    setWorkouts(
                      workouts.filter((e: { _id: string }) => e._id !== id)
                    )
                  }
                />
              </Card.Actions>
            </Card>
          ))}

          <Portal>
            <Modal
              style={{ padding: 16, marginTop: -100 }}
              visible={isModalVisible}
              onDismiss={() => setIsModalVisible(false)}>
              <Card style={{ backgroundColor: "#CDD3DB" }}>
                <Card.Title
                  titleStyle={{ color: "black" }}
                  title={selectedWorkout ? "Edit Workout" : "Add Workout"}
                />

                <View>
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#fff",
                    }}
                    placeholder="Workout Name"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />
                  <MultiSelect
                    textColor="black"
                    items={exercises.map((exercise: any) => ({
                      id: exercise._id,
                      name: exercise.name,
                    }))}
                    uniqueKey="id"
                    selectedItems={form.exercises}
                    onSelectedItemsChange={(items) =>
                      setForm({ ...form, exercises: items })
                    }
                    selectText="Select Exercises"
                    searchInputPlaceholderText="Search Exercises..."
                    tagRemoveIconColor="#black"
                    tagBorderColor="#black"
                    tagTextColor="#black"
                    selectedItemTextColor="#black"
                    selectedItemIconColor="#black"
                    itemTextColor="#black"
                    displayKey="name"
                    styleMainWrapper={{
                      borderWidth: 1,
                      borderColor: "#CCC",
                      borderRadius: 8,
                      padding: 20,
                    }}
                    styleInputGroup={{ marginBottom: 10, padding: 10 }}
                  />

                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#fff",
                    }}
                    placeholder="Notes"
                    value={form.notes}
                    onChangeText={(text) => setForm({ ...form, notes: text })}
                  />
                </View>
                <Text>
                  {error && <Text style={{ color: "red" }}>{error}</Text>}
                </Text>
                <Button
                  textColor="black"
                  onPress={selectedWorkout ? handleEdit : handleAddWorkout}>
                  {selectedWorkout ? "Save" : "Add"}
                </Button>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </>
  );
}
