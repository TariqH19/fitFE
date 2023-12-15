import { Slot } from "expo-router";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function _layout() {
  return (
    <>
      <PaperProvider>
        <SessionProvider>
          <Slot />
        </SessionProvider>
      </PaperProvider>
    </>
  );
}
