import React from "react";
import { useStorageState } from "../hooks/useStorageState";
import { useNavigation } from "@react-navigation/native";

interface MyAuthContext {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<MyAuthContext | null>(null);

// This hook can be used to access the user info.
export function useSession(): any {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const navigation = useNavigation();

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
          navigation.navigate("(tabs)/login" as never);
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
