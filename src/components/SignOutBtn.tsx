import { useSession, SessionProvider } from "../contexts/AuthContext";
import { Button } from "react-native-paper";

export default function SignOutBtn() {
  const { signOut }: any = useSession();

  return (
    <Button mode="contained" onPress={signOut}>
      Sign Out
    </Button>
  );
}
