// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SessionProvider, useSession } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import AuthLayout from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/_layout";
import LoginPage from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/login/Index";
import Nav from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/_layout";

export default function App() {
  return (
    <SessionProvider>
      <PaperProvider>
        <Nav />
      </PaperProvider>
    </SessionProvider>
  );
}
