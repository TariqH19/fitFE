import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useStorageState } from "../hooks/useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MyAuthContext {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null | undefined;
  isLoading: boolean;
}

const AuthContext = React.createContext<MyAuthContext | null>(null);

export function useSession(): MyAuthContext {
  const value = React.useContext(AuthContext);
  return value as MyAuthContext;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [sessionData, setSessionData] = useStorageState("session");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem("session");
        if (storedSession) {
          setSessionData(storedSession);
        }
      } catch (error) {
        console.error("Error loading session from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Extract session from the sessionData tuple
  const session = sessionData[1];

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          setSessionData(token);
          // Store the session in AsyncStorage for persistence
          AsyncStorage.setItem("session", token);
        },
        signOut: () => {
          setSessionData(null);

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
