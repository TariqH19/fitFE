import { View } from "react-native";
import {
  TextInput,
  useTheme,
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

interface FormType {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn }: any = useSession();
  const theme = useTheme();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [form, setForm] = useState<FormType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOpenURL = async (event: { url: string }) => {
      console.log("Received URL:", event.url);

      const token = event.url.split("token=")[1];
      console.log("Extracted Token:", token);

      if (token) {
        // Decode the URI-encoded token
        const decodedToken = decodeURIComponent(token);
        console.log("Decoded Token:", decodedToken);

        // Store the token in the state variable
        setAuthToken(decodedToken);

        try {
          // Use the decoded token to sign in
          await signIn(decodedToken);
          console.log("Sign-in successful");
          navigation.navigate("(home)" as never);
        } catch (error) {
          // Handle any errors during sign-in
          console.error("Error during sign-in:", error);
          // You might want to show an error message to the user here
        }
      }
    };

    Linking.addEventListener("url", handleOpenURL);

    // Cleanup the event listener when the component unmounts
    return () => Linking.removeEventListener("url", handleOpenURL);
  }, [signIn, navigation]);

  const handleLink = () => {
    Linking.openURL("http://localhost:3000/auth/");
  };

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
        navigation.navigate("(home)" as never);

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
          mode="outlined"
          textColor="black"
          placeholderTextColor="black"
          style={{
            margin: 12,
            backgroundColor: "#F1F7FF",
          }}
          placeholder="Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          value={form.email}
          id="email"
        />
        <TextInput
          mode="outlined"
          textColor="black"
          placeholderTextColor="black"
          style={{
            margin: 12,
            backgroundColor: "#F1F7FF",
          }}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => setForm({ ...form, password: text })}
          value={form.password}
          id="password"
        />
        <Text style={{ margin: 12, color: "red" }}>{error}</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Button
            style={{
              margin: 12,
              backgroundColor: "black",
            }}
            textColor="white"
            onPress={handleClick}>
            Submit
          </Button>
        )}
        <Text style={{ margin: 12, color: "black" }}>OR</Text>
        <Button
          style={{
            margin: 12,
            backgroundColor: "black",
          }}
          textColor="white"
          onPress={handleLink}>
          Login with Google
        </Button>
      </View>
    </>
  );
}
