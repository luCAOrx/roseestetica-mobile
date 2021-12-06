import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    height: Dimensions.get("screen").height,

    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,

    backgroundColor: "rgba(18, 18, 18, 0.8)"
  },

  text: {
    fontFamily: "Roboto_900Black",
    fontSize: 25,

    color: "#D2D2E3"
  }
});

export default styles;