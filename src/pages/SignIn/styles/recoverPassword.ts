import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  noticeContainer: {
    margin: 15,
    height: 150,

    borderRadius: 15,
    
    backgroundColor: "#222325",
  },

  text: {
    marginTop: 10,
    margin: 10,

    color: "#D2D2E3",

    fontFamily: "Roboto_400Regular",
    fontSize: 15
  },

  title: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default styles;