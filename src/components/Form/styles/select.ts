import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 15,
    height: 50,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderRadius: 8
  },

  placeholder: {
    flex: 1,
    textAlign: "left"
  },

  errorMessage: {
    marginLeft: 15,
    fontSize: 16,
    color: "#c52626",
  },

  modal: {
    backgroundColor: "#333333"
  },

  itemContainer: {
    borderBottomWidth: 1
  },

  item: {
    height: 65,

    justifyContent: "center",
    alignItems: "center",
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16
  },

  selected: {
    flex: 1,
    textAlign: "left"
  }
});

export default styles;