import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import SignOutBtn from "../../../components/SignOutBtn";
import { SessionProvider } from "../../../contexts/AuthContext";
import UserInfo from "../../../services/User";
import { Image } from "react-native";

export default function ProfilePage() {
  const user = UserInfo();

  return (
    <SessionProvider>
      <View style={styles.container}>
        {user.file_path && (
          <Image
            source={{
              uri: `https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/${user.file_path}`,
            }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              marginBottom: 16,
            }}
          />
        )}
        <Text style={styles.greeting}>Hello {user.name}</Text>
        <Text style={styles.email}>Email: {user.email}</Text>
        <SignOutBtn />
      </View>
    </SessionProvider>
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
