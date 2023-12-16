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
import { addSplits, editSplit } from "../../../services/ApiCalls";
import UserInfo from "../../../services/User";
import DeleteBtn from "../../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../../contexts/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

export default function SplitPage() {
  const [split, setSplit] = useState([] as any);
  const [workouts, setWorkouts] = useState([] as any);
  const [selectedSplit, setSelectedSplit] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    workout: [] as any,
    notes: "",
    dateStart: new Date(),
    dateEnd: new Date(),
    user: "",
  });

  const { session }: any = useSession();
  const user = UserInfo();
  const userId = user._id;

  const toggleModal = (split: any) => {
    setSelectedSplit(split);
    setIsModalVisible(!isModalVisible);
  };

  const handleEdit = async () => {
    try {
      // Call the editSplit function to update the selected split
      const editedSplit = await editSplit(
        selectedSplit._id, // Pass the ID of the selected split
        form,
        session
      );

      setSplit((prevSplits: any) =>
        prevSplits.map((split: any) =>
          split._id === selectedSplit._id ? editedSplit : split
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      // console.log("Split edited:", editedSplit);
    } catch (error: any) {
      // Handle the error (e.g., display an error message)
      // console.error("Error editing split:", error);
      setError(error.response.data.errors.name.message);
    }
  };

  const handleAddSplit = async () => {
    try {
      // Include the user property in the form with the user id
      const addedSplit = await addSplits({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setSplit([...split, addedSplit] as any);
      // console.log("Split added:", addedSplit);

      // Reset the form or perform any other actions after successful submission
    } catch (error: any) {
      setError(error.response.data.errors.name.message);
      // console.error("Error adding split:", error);
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
        const { splits, workout } = response.data;
        setSplit(splits);
        setWorkouts(workout);
        setLoading(false);
      });
    if (selectedSplit) {
      // If a split is selected for editing, set its values in the form
      setError("");
      setForm({
        name: selectedSplit.name || "",
        workout: selectedSplit.workout || [],
        notes: selectedSplit.notes || "",
        dateStart: selectedSplit.dateStart || "",
        dateEnd: selectedSplit.dateEnd || "",
        user: userId,
      });
    } else {
      // If no split is selected, reset the form
      setError("");
      setForm({
        name: "",
        workout: [],
        notes: "",
        dateStart: new Date(),
        dateEnd: new Date(),
        user: userId,
      });
    }
  }, [session, isModalVisible]);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Splits` }} />
      <ScrollView>
        <View style={{ flex: 1, gap: 10, padding: 16 }}>
          <Button mode="contained" onPress={() => toggleModal(null)}>
            Add Split
          </Button>

          {!split.length && !loading && (
            <Text style={{ textAlign: "center" }}>
              You have no splits yet. Add one above!
            </Text>
          )}

          {loading && <ActivityIndicator />}

          {split.map((s: any) => (
            <Card style={{ backgroundColor: "#F1F7FF" }} key={s._id}>
              <Card.Content>
                <Text style={{ color: "black" }}>{s.name}</Text>
                <Text style={{ color: "black" }}>{s.notes}</Text>

                {/* Map through workouts associated with the current s */}
                <Text style={{ color: "black" }}>
                  {s.workout && s.workout.length > 0
                    ? s.workout.map((workoutId: any) => {
                        const workout = workouts.find(
                          (w: any) => w._id === workoutId
                        );
                        return workout ? (
                          <Text
                            style={{ color: "black" }}
                            key={workout._id}>{`${workout.name} `}</Text>
                        ) : null;
                      })
                    : null}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  textColor="black"
                  style={{ margin: 12 }}
                  onPress={() => toggleModal(s)}>
                  Edit
                </Button>
                <DeleteBtn
                  resource="splits"
                  _id={s._id}
                  deleteCallback={(id) =>
                    setSplit(split.filter((e: { _id: string }) => e._id !== id))
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
                  title={selectedSplit ? "Edit Split" : "Add Split"}
                />

                <View>
                  <TextInput
                    mode="outlined"
                    textColor="black"
                    placeholderTextColor="black"
                    style={{
                      backgroundColor: "#fff",
                    }}
                    placeholder="Split Name"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />
                  <MultiSelect
                    textColor="black"
                    items={workouts.map((workout: any) => ({
                      id: workout._id,
                      name: workout.name,
                    }))}
                    uniqueKey="id"
                    selectedItems={form.workout}
                    onSelectedItemsChange={(items) =>
                      setForm({ ...form, workout: items })
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
                  onPress={selectedSplit ? handleEdit : handleAddSplit}>
                  {selectedSplit ? "Save" : "Add"}
                </Button>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </>
  );
}
