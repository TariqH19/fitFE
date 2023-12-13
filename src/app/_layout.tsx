import { Slot } from "expo-router";
import { SessionProvider } from "../contexts/AuthContext";

export default function _layout() {
  return (
    <>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </>
  );
}
