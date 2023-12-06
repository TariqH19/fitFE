import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import Nav from "./_layout";
import AuthLayout from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/_layout";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <SessionProvider>
          <Nav />
          <AuthLayout />
        </SessionProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
