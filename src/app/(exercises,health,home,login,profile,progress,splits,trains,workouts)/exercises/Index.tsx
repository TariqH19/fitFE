import { View } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { useSession } from "../../../contexts/AuthContext";
import axios from "axios";
import {
  Card,
  Text,
  Button,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addExercise, editExercise } from "../../../services/ApiCalls";
import UserInfo from "../../../services/User";
import DeleteBtn from "../../../components/DeleteBtn";
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default function ExercisePage() {
  const [exercises, setExercises] = useState([] as any);
  const [selectedExercise, setSelectedExercise] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    muscle_group: "",
    notes: "",
    user: "",
  });
  const [loading, setLoading] = useState(true);
  const { session }: any = useSession();
  const user = UserInfo();
  const userId = user._id;

  const toggleModal = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsModalVisible(!isModalVisible);
  };

  const handleEdit = async () => {
    try {
      // Call the editExercise function to update the selected exercise
      const editedExercise = await editExercise(
        selectedExercise._id, // Pass the ID of the selected exercise
        form,
        session
      );

      setExercises((prevExercises: any) =>
        prevExercises.map((exercise: any) =>
          exercise._id === selectedExercise._id ? editedExercise : exercise
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      // console.log("Exercise edited:", editedExercise);
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error editing exercise:", error);
    }
  };

  const handleAddExercise = async () => {
    try {
      // Include the user property in the form with the user id
      const addedExercise = await addExercise(
        { ...form, user: userId },
        session
      );
      setIsModalVisible(false);
      setExercises([...exercises, addedExercise] as any);
      // console.log("Exercise added:", addedExercise);

      // Reset the form or perform any other actions after successful submission
    } catch (error: any) {
      // Handle the error (e.g., display an error message)
      // console.error("Error adding exercise:", error);
      setError(error.response.data.errors.name.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://gym-api-omega.vercel.app/api/exercises/", {
        headers: {
          Authorization: `Bearer ${session}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data);
        setExercises(response.data);
        setLoading(false);
      });
    if (selectedExercise) {
      // If an exercise is selected for editing, set its values in the form
      setError("");
      setForm({
        name: selectedExercise.name || "",
        muscle_group: selectedExercise.muscle_group || "",
        notes: selectedExercise.notes || "",
        user: userId,
      });
    } else {
      // If no exercise is selected, reset the form
      setError("");
      setForm({
        name: "",
        muscle_group: "",
        notes: "",
        user: userId,
      });
    }
  }, [session, isModalVisible]);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Exercises` }} />
      <ScrollView>
        <View style={{ flex: 1, gap: 10, padding: 16 }}>
          <Button mode="contained" onPress={() => toggleModal(null)}>
            Add Exercise
          </Button>

          {!exercises.length && !loading && (
            <Text style={{ textAlign: "center", color: "black" }}>
              You have no exercises. Add one above.
            </Text>
          )}

          {loading && <ActivityIndicator />}

          {exercises.map((exercise: any) => (
            <Card style={{ backgroundColor: "#F1F7FF" }} key={exercise._id}>
              <Card.Content>
                <Text style={{ color: "black" }}>{exercise.name}</Text>
                <Text style={{ color: "black" }}>{exercise.muscle_group}</Text>
                <Text style={{ color: "black" }}>{exercise.notes}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  textColor="black"
                  style={{ margin: 12 }}
                  onPress={() => toggleModal(exercise)}>
                  Edit
                </Button>
                <DeleteBtn
                  resource="exercises"
                  _id={exercise._id}
                  deleteCallback={(id) =>
                    setExercises(
                      exercises.filter((e: { _id: string }) => e._id !== id)
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
                  title={selectedExercise ? "Edit Exercise" : "Add Exercise"}
                />
                <View>
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#F1F7FF",
                    }}
                    placeholder="Exercise Name"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#F1F7FF",
                    }}
                    placeholder="Muscle Group"
                    value={form.muscle_group}
                    onChangeText={(text) =>
                      setForm({ ...form, muscle_group: text })
                    }
                  />
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#F1F7FF",
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
                  onPress={selectedExercise ? handleEdit : handleAddExercise}>
                  {selectedExercise ? "Save" : "Add"}
                </Button>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </>
  );
}
