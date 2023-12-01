import { View } from "react-native";
import {
  TextInput,
  useTheme,
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useState } from "react";
import axios from "axios";
import { useSession } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

interface FormType {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn }: any = useSession();
  const theme = useTheme();

  const [form, setForm] = useState<FormType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleClick = () => {
    setIsLoading(true);
    console.log("clicked", form);

    axios
      .post("https://gym-api-omega.vercel.app/api/users/login", form, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log(response.data);
        signIn(response.data.token);
        navigation.navigate("(tabs)/home" as never);

        setForm({
          email: "",
          password: "",
        });
        setError("");
      })
      .catch((e) => {
        setIsLoading(false);
        // console.error(e);
        setError(e.response.data.msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <View style={{ width: "80%" }}>
        <TextInput
          style={{
            margin: 12,
            backgroundColor: "#F1F7FF",
            color: "black",
          }}
          placeholder="Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          value={form.email}
          id="email"
        />
        <TextInput
          style={{
            margin: 12,
            backgroundColor: "#F1F7FF",
            color: "black",
          }}
          placeholder="Password"
          onChangeText={(text) => setForm({ ...form, password: text })}
          value={form.password}
          id="password"
        />
        <Text style={{ margin: 12 }}>{error}</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Button
            style={{ margin: 12, backgroundColor: theme.colors.surface }}
            onPress={handleClick}>
            Submit
          </Button>
        )}
      </View>
    </>
  );
}
