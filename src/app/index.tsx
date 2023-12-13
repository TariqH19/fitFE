import React from "react";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import Nav from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/_layout";

export default function App() {
  return (
    <PaperProvider>
      <SessionProvider>
        <Nav />
      </SessionProvider>
    </PaperProvider>
  );
}
