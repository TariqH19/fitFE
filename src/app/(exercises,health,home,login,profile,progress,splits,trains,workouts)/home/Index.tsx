import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSession } from "../../../contexts/AuthContext";
import { useEffect } from "react";

export default function HomePage() {
  const { session }: any = useSession();
  const navigation = useNavigation();

  const handleImagePress = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  return (
    <ScrollView style={{ paddingHorizontal: 12 }}>
      <TouchableOpacity onPress={() => handleImagePress("(exercises)")}>
        <Image
          source={{
            uri: "https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/Exercises.jpg",
          }}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(workouts)")}>
        <Image
          source={{
            uri: "https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/Workouts.jpg",
          }}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(splits)")}>
        <Image
          source={{
            uri: "https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/Splits.jpg",
          }}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleImagePress("(trains)")}>
        <Image
          source={{
            uri: "https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/Sessions.jpg",
          }}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
