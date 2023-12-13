import { StyleSheet, Image, ImageSourcePropType } from "react-native";
import { Text } from "react-native-paper";

interface Props {
  placeholderImageSource: ImageSourcePropType;
  selectedImage?: null | string;
}

export default function ImageViewer({
  placeholderImageSource,
  selectedImage,
}: Props) {
  const imageSource =
    selectedImage !== null ? { uri: selectedImage } : placeholderImageSource;

  // console.log("Image source:", imageSource);

  return <Text style={{ color: "black" }}>Image Uploaded</Text>;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
