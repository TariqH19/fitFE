import React from "react";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomePage() {
  const navigation = useNavigation();

  const handleImagePress = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  return (
    <ScrollView style={{ paddingHorizontal: 12 }}>
      <TouchableOpacity onPress={() => handleImagePress("(tabs)/ExercisePage")}>
        <Image
          source={require("../../assets/Exercises.jpg")}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(tabs)/WorkoutPage")}>
        <Image
          source={require("../../assets/Workouts.jpg")}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(tabs)/SplitsPage")}>
        <Image
          source={require("../../assets/Splits.jpg")}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(tabs)/TrainPage")}>
        <Image
          source={require("../../assets/Sessions.jpg")}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
