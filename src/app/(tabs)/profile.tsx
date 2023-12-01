import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { useSession } from "../../contexts/AuthContext";
import { decode } from "base-64";

export default function ProfilePage() {
  const [data, setData] = useState({} as any);
  const { session, signOut }: any = useSession();

  useEffect(() => {
    if (session) {
      // Decode the JWT token to get user information
      const tokenArray = session.split(".");
      if (tokenArray.length === 3) {
        const decodedToken = JSON.parse(
          decode(tokenArray[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        setData(decodedToken);
        console.log(decodedToken);

        // Set the authorization header with the token
        axios.defaults.headers.common["Authorization"] = `Bearer ${session}`;
      }
    }
  }, [session]);

  return (
    <View>
      <Text>Hello {data.name}</Text>
      <Text>Email: {data.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
