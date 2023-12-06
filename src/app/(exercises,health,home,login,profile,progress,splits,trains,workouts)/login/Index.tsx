import React, { useState } from "react";
import LoginForm from "../../../components/LoginForm";
import RegisterForm from "../../../components/RegisterForm";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Stack } from "expo-router";

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Welcome` }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -60,
        }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
          WELCOME TO FITX
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}>
          <Button
            mode="contained"
            onPress={handleLoginClick}
            style={{ margin: 5 }}>
            Login
          </Button>
          <Button
            mode="contained"
            onPress={handleRegisterClick}
            style={{ margin: 5 }}>
            Register
          </Button>
        </View>

        {showLogin ? <LoginForm /> : <RegisterForm />}
      </View>
    </>
  );
}
