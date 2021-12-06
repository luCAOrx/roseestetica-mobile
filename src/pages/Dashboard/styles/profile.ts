import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    // borderBottomColor: "#5C5C5C",
    borderBottomWidth: 0.3
  },

  header: {
    margin: 20,
    marginTop: 50,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 50,
  },

  textContainer: {
    flex: 1,
    flexDirection: "column",

    marginLeft: 21
  },

  name: {
    fontFamily: "Roboto_400Regular",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 29,

    // color: "#D2D2E3"
  },

  description: {
    fontFamily: "Roboto_400Regular",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: 14,

    // color: "#5C5C5C"
  },

  label: {
    justifyContent: "center",
    alignItems: "center"
  },

  buttonContainer: {
    borderBottomWidth: 0.3
  },

  button: {
    height: 50,

    margin: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  otherButton: {
    height: 60,
    // marginBottom: 50,

    flexDirection: "row",
    alignItems: "center",
  },

  themeMode: {
    // margin: 6,
    // color: "#D2D2E3"
    fontSize: 15
  },

  phone: {
    marginLeft: 10,
    color: "#248E54",
    fontSize: 15
  },

  exit: {
    marginLeft: 10,
    color: "#C52233",
    fontSize: 15
  }
});

export default styles;