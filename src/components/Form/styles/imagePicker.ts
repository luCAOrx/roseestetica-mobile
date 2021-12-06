import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  errorMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#c52626",
  },

  imageInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageInput: {
    borderStyle: 'dashed',
    borderWidth: 1.4,
    margin: 15,
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageInputText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
  },

  uploadedImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadedImage: {
    margin: 15,
    width: 150,
    height: 150,
    borderRadius: 100,
  }
});

export default styles;