import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useStorageState } from "../hooks/useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MyAuthContext {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<MyAuthContext | null>(null);

export function useSession(): MyAuthContext {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value as MyAuthContext;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const navigation = useNavigation();

  useEffect(() => {
    // Load session from storage on component mount
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem("session");
        if (storedSession) {
          setSession(storedSession);
        }
      } catch (error) {
        console.error("Error loading session from storage:", error);
      }
    };

    loadSession();
  }, []); // Empty dependency array to ensure it runs only once on mount

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          setSession(token);
          // Store the session in AsyncStorage for persistence
          AsyncStorage.setItem("session", token);
        },
        signOut: () => {
          setSession(null);

          // Remove the session from AsyncStorage on sign out
          AsyncStorage.removeItem("session");

          navigation.reset({
            index: 0,
            routes: [{ name: "(login)" as never }],
          });
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
