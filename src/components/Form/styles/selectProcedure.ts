import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 20
  },

  checkbox: {
    margin: 20
  },

  text: {
    flex: 1,
    textAlign: "left",
    fontFamily: "Roboto_400Regular",
    lineHeight: 18,
    fontSize: 15
  },

  price: {
    marginRight: 20,

    fontFamily: "Roboto_400Regular",
    fontSize: 15
  },

  errorMessage: {
    marginBottom: 10,
    
    textAlign: 'center',

    fontSize: 16,

    color: "#c52626",
  }
});

export default styles;