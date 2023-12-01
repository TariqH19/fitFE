import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import Nav from "./_layout";

export default function App() {
  return (
    <SessionProvider>
      <PaperProvider>
        <NavigationContainer>
          <Nav />
        </NavigationContainer>
      </PaperProvider>
    </SessionProvider>
  );
}
