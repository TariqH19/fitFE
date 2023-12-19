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
import { addSession, editSession } from "../../../services/ApiCalls";
import UserInfo from "../../../services/User";
import DeleteBtn from "../../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../../contexts/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

export default function TrainPage() {
  const [train, setTrain] = useState([] as any);
  const [workouts, setWorkouts] = useState([] as any);
  const [selectedTrain, setSelectedTrain] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

      setTrain((prevTrains: any) =>
        prevTrains.map((train: any) =>
          train._id === selectedTrain._id ? editedTrain : train
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      // console.log("Train edited:", editedTrain);
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error editing train:", error);
    }
  };

  const handleAddTrain = async () => {
    try {
      // Include the user property in the form with the user id
      const addedTrain = await addSession({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setTrain([...train, addedTrain] as any);
      // console.log("Train added:", addedTrain);

      // Reset the form or perform any other actions after successful submission
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error adding train:", error);
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
        const { workoutexercise, workout } = response.data;
        setTrain(workoutexercise);
        setWorkouts(workout);
        setLoading(false);
      });
    if (selectedTrain) {
      // If a train is selected for editing, set its values in the form
      setError("");
      setForm({
        name: selectedTrain.name || "",
        notes: selectedTrain.notes || "",
        workout: selectedTrain.workout || [],
        user: userId,
      });
    } else {
      // If no train is selected, reset the form
      setError("");
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
      <ScrollView>
        <View style={{ flex: 1, gap: 10, padding: 16 }}>
          <Button mode="contained" onPress={() => toggleModal(null)}>
            Add Session
          </Button>

          {!train.length && !loading && (
            <Text style={{ textAlign: "center", color: "black" }}>
              No sessions found. Add a session to get started.
            </Text>
          )}

          {train.map((s: any) => (
            <Card style={{ backgroundColor: "#F1F7FF" }} key={s._id}>
              <Card.Content>
                <Text style={{ color: "black" }}>{s.name}</Text>
                <Text style={{ color: "black" }}>{s.notes}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  textColor="black"
                  style={{ margin: 12 }}
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
              style={{ padding: 16, marginTop: -100 }}
              visible={isModalVisible}
              onDismiss={() => setIsModalVisible(false)}>
              <Card style={{ backgroundColor: "#CDD3DB" }}>
                <Card.Title
                  titleStyle={{ color: "black" }}
                  title={selectedTrain ? "Edit Train" : "Add Train"}
                />

                <View>
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#fff",
                    }}
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
                      padding: 10,
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
                  onPress={selectedTrain ? handleEdit : handleAddTrain}>
                  {selectedTrain ? "Save" : "Add"}
                </Button>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </>
  );
}
