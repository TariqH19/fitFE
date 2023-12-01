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
import { addWorkout, editWorkout } from "../../services/ApiCalls";
import UserInfo from "../../services/User";
import DeleteBtn from "../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../contexts/AuthContext";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([] as any);
  const [exercises, setExercises] = useState([] as any);
  const [selectedWorkout, setSelectedWorkout] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

      setIsModalVisible(false);
      setWorkouts((prevWorkouts: any) =>
        prevWorkouts.map((workout: any) =>
          workout._id === selectedWorkout._id ? editedWorkout : workout
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      console.log("Workout edited:", editedWorkout);
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error editing workout:", error);
    }
  };

  const handleAddWorkout = async () => {
    try {
      // Include the user property in the form with the user id
      const addedWorkout = await addWorkout({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setWorkouts([...workouts, addedWorkout] as any);
      console.log("Workout added:", addedWorkout);

      // Reset the form or perform any other actions after successful submission
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error adding workout:", error);
    }
  };

  useEffect(() => {
    axios
      .get("https://gym-api-omega.vercel.app/api/userData/", {
        headers: {
          Authorization: `Bearer ${session}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        const { workout, exercise } = response.data;
        setWorkouts(workout);
        setExercises(exercise);
      });
    if (selectedWorkout) {
      // If a workout is selected for editing, set its values in the form
      setForm({
        name: selectedWorkout.name || "",
        exercises: selectedWorkout.exercises || [],
        notes: selectedWorkout.notes || "",
        user: userId,
      });
    } else {
      // If no workout is selected, reset the form
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
      <View style={{ flex: 1, gap: 10 }}>
        <Button mode="contained" onPress={() => toggleModal(null)}>
          Add Workout
        </Button>

        {workouts.map((workout: any) => (
          <Card key={workout._id}>
            <Card.Content>
              <Text>{workout.name}</Text>
              <Text>{workout.notes}</Text>

              {/* Map through exercises associated with the current workout */}
              <Text>
                {exercises
                  .filter((exercise: any) =>
                    workout.exercises.includes(exercise._id)
                  )
                  .map((exercise: any) => (
                    <Text key={exercise._id}>{`${exercise.name} `}</Text>
                  ))}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                icon={() => (
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color="black"
                  />
                )}
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
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}>
            <Card>
              <Card.Title
                title={selectedWorkout ? "Edit Workout" : "Add Workout"}
              />

              <View>
                <TextInput
                  placeholder="Workout Name"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                />
                <MultiSelect
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
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                />
                <TextInput
                  placeholder="Notes"
                  value={form.notes}
                  onChangeText={(text) => setForm({ ...form, notes: text })}
                />
              </View>

              <Button onPress={selectedWorkout ? handleEdit : handleAddWorkout}>
                {selectedWorkout ? "Save" : "Add"}
              </Button>
            </Card>
          </Modal>
        </Portal>
      </View>
    </>
  );
}
