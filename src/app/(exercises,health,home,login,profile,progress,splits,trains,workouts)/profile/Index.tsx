import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import axios from "axios";
import { useSession } from "../../../contexts/AuthContext";
import { decode } from "base-64";
import { Button } from "react-native-paper";

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

        // Set the authorization header with the token
        axios.defaults.headers.common["Authorization"] = `Bearer ${session}`;
      }
    }
  }, [session]);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello {data.name}</Text>
      <Text style={styles.email}>Email: {data.email}</Text>
      <Button mode="contained" onPress={signOut}>
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
  },
});
