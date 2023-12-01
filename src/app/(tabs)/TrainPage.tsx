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
import { addSession, editSession } from "../../services/ApiCalls";
import UserInfo from "../../services/User";
import DeleteBtn from "../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../contexts/AuthContext";

export default function TrainPage() {
  const [train, setTrain] = useState([] as any);
  const [exercises, setExercises] = useState([] as any);
  const [workouts, setWorkouts] = useState([] as any);
  const [selectedTrain, setSelectedTrain] = useState(null as any);
  const [selectedWorkout, setSelectedWorkout] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    workout: "",
    notes: "",
    user: "",
  });

  const { session }: any = useSession();
  const user = UserInfo();
  const userId = user._id;

  const toggleModal = (train: any) => {
    setSelectedTrain(train);
    setIsModalVisible(!isModalVisible);
  };

  const handleEdit = async () => {
    try {
      // Call the editTrain function to update the selected train
      const editedTrain = await editSession(
        selectedTrain._id, // Pass the ID of the selected train
        form,
        session
      );

      setIsModalVisible(false);
      setTrain((prevTrains: any) =>
        prevTrains.map((train: any) =>
          train._id === selectedTrain._id ? editedTrain : train
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      console.log("Train edited:", editedTrain);
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error editing train:", error);
    }
  };

  const handleAddTrain = async () => {
    try {
      // Include the user property in the form with the user id
      const addedTrain = await addSession({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setTrain([...train, addedTrain] as any);
      console.log("Train added:", addedTrain);

      // Reset the form or perform any other actions after successful submission
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error adding train:", error);
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
        const { workoutexercise, workout } = response.data;
        setTrain(workoutexercise);
        setWorkouts(workout);
      });
    if (selectedTrain) {
      // If a train is selected for editing, set its values in the form
      setForm({
        name: selectedTrain.name || "",
        notes: selectedTrain.notes || "",
        workout: selectedTrain.workout || [],
        user: userId,
      });
    } else {
      // If no train is selected, reset the form
      setForm({
        name: "",
        notes: "",
        workout: "",
        user: userId,
      });
    }
  }, [session, isModalVisible]);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Session` }} />
      <View style={{ flex: 1, gap: 10 }}>
        <Button mode="contained" onPress={() => toggleModal(null)}>
          Add Session
        </Button>

        {train.map((s: any) => (
          <Card key={s._id}>
            <Card.Content>
              <Text>{s.name}</Text>
              <Text>{s.notes}</Text>
              <Text>{s.workout}</Text>
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
                onPress={() => toggleModal(s)}>
                Edit
              </Button>
              <DeleteBtn
                resource="workoutsexercises"
                _id={s._id}
                deleteCallback={(id) =>
                  setTrain(train.filter((e: { _id: string }) => e._id !== id))
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
              <Card.Title title={selectedTrain ? "Edit Train" : "Add Train"} />

              <View>
                <TextInput
                  placeholder="Train Name"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                />

                <MultiSelect
                  items={workouts.map((workout: any) => ({
                    id: workout._id,
                    name: workout.name,
                  }))}
                  uniqueKey="id"
                  selectedItems={form.workout ? [form.workout] : []} // Ensure selectedItems is an array
                  onSelectedItemsChange={(items) =>
                    setForm({ ...form, workout: items[0] })
                  }
                  selectText="Select Workouts"
                  searchInputPlaceholderText="Search Workouts..."
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

              <Button onPress={selectedTrain ? handleEdit : handleAddTrain}>
                {selectedTrain ? "Save" : "Add"}
              </Button>
            </Card>
          </Modal>
        </Portal>
      </View>
    </>
  );
}
