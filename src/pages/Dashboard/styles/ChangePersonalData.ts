import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  imageProfileContainer: {
    justifyContent: "center",
    alignItems: "center"
  },

  imageProfile: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  
  modal: {
    backgroundColor: "#333333"
  },

  headerModalContainer: {
    padding: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 23,
    lineHeight: 42,

    color: "#D2D2E3",
  }
});

export default styles;