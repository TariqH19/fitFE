import { StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from "expo-media-library";
import { Text } from "react-native-paper";
// import Button from "./Button";
import { Button, useTheme } from "react-native-paper";
import ImageViewer from "./ImagePicker";

export default function ImagePick({ setFormImage }: any) {
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const placeholderImageSource = require("../assets/splash.png");
  const theme = useTheme();

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setFormImage(result.assets[0].uri); // Call the callback from RegisterForm
    }
  };

  // console.log("Selected image:", selectedImage);

  return (
    <GestureHandlerRootView>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          {selectedImage ? (
            <ImageViewer
              placeholderImageSource={placeholderImageSource}
              selectedImage={selectedImage}
            />
          ) : (
            <Text style={{ color: "black" }}>Upload a profile picture</Text>
          )}
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Button
          style={{
            margin: 12,
            backgroundColor: "black",
          }}
          textColor="white"
          onPress={pickImageAsync}>
          Choose a photo
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 20,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 50,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
