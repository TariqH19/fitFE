import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
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
import { addSplits, editSplit } from "../../services/ApiCalls";
import UserInfo from "../../services/User";
import DeleteBtn from "../../components/DeleteBtn";
import axios from "axios";
import { useSession } from "../../contexts/AuthContext";

export default function SplitPage() {
  const [split, setSplit] = useState([] as any);
  const [workouts, setWorkouts] = useState([] as any);
  const [selectedSplit, setSelectedSplit] = useState(null as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

      setIsModalVisible(false);
      setSplit((prevSplits: any) =>
        prevSplits.map((split: any) =>
          split._id === selectedSplit._id ? editedSplit : split
        )
      );

      // Close the modal after editing
      setIsModalVisible(false);
      console.log("Split edited:", editedSplit);
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error editing split:", error);
    }
  };

  const handleAddSplit = async () => {
    try {
      // Include the user property in the form with the user id
      const addedSplit = await addSplits({ ...form, user: userId }, session);
      setIsModalVisible(false);
      setSplit([...split, addedSplit] as any);
      console.log("Split added:", addedSplit);

      // Reset the form or perform any other actions after successful submission
    } catch (error) {
      // Handle the error (e.g., display an error message)
      console.error("Error adding split:", error);
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
        const { splits, workout } = response.data;
        setSplit(splits);
        setWorkouts(workout);
      });
    if (selectedSplit) {
      // If a split is selected for editing, set its values in the form
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
      <View style={{ flex: 1, gap: 10 }}>
        <Button mode="contained" onPress={() => toggleModal(null)}>
          Add Split
        </Button>

        {split.map((s: any) => (
          <Card key={s._id}>
            <Card.Content>
              <Text>{s.name}</Text>
              <Text>{s.notes}</Text>

              {/* Map through workouts associated with the current s */}
              <Text>
                {s.workout && s.workout.length > 0
                  ? s.workout.map((workoutId: any) => {
                      const workout = workouts.find(
                        (w: any) => w._id === workoutId
                      );
                      return workout ? (
                        <Text key={workout._id}>{`${workout.name} `}</Text>
                      ) : null;
                    })
                  : null}
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
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}>
            <Card>
              <Card.Title title={selectedSplit ? "Edit Split" : "Add Split"} />

              <View>
                <TextInput
                  placeholder="Split Name"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                />
                <MultiSelect
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

              <Button onPress={selectedSplit ? handleEdit : handleAddSplit}>
                {selectedSplit ? "Save" : "Add"}
              </Button>
            </Card>
          </Modal>
        </Portal>
      </View>
    </>
  );
}
