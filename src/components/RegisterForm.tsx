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
import ImagePick from "./ImageView";
import { ScrollView } from "react-native-gesture-handler";

interface FormType {
  name?: string;
  email?: string;
  password?: string;
  image?: Blob;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { signIn }: any = useSession();
  const theme = useTheme();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleClick = () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", form.name ?? "");
    formData.append("email", form.email ?? "");
    formData.append("password", form.password ?? "");

    // Check if an image is selected before appending it to the form data
    // if (form.image) {
    //   const uriParts = form.image.split(".");
    //   const fileType = uriParts[uriParts.length - 1];

    //   // Fetch the image data and create a Blob
    fetch(form.image as any)
      .then((res) => res.blob())
      .then((imageBlob) => {
        formData.append("image", imageBlob);
        // console.log("Form data:", imageBlob);
        axios
          .post(
            "https://gym-api-omega.vercel.app/api/users/register",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            // console.log(response.data);
            signIn(response.data.token);
            navigation.navigate("(home)" as never);

            setForm({
              name: "",
              email: "",
              password: "",
            });
            setError("");
          })
          .catch((error) => {
            setIsLoading(false);
            if (error.response) {
              const responseData = error.response.data;

              if (responseData.msg && responseData.msg.errors) {
                const validationErrors = Object.values(responseData.msg.errors)
                  .map((errorItem: any) => errorItem.message)
                  .join(", ");

                setError(`${validationErrors}`);
              } else {
                setError("Error logging in. Please try again.");
              }
            } else {
              setError("Network error. Please try again.");
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
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
          placeholder="Name"
          onChangeText={(text) => setForm({ ...form, name: text })}
          value={form.name}
          id="name"
        />
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
        <ImagePick setFormImage={(image: any) => setForm({ ...form, image })} />

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
      </View>
    </>
  );
}
