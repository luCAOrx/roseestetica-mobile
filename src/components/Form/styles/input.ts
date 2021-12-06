import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 15,
    
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 8
  },

  input: {
    flex: 1, 

    height: 50, 

    borderRadius: 8,
    
    fontSize: 15
  },

  errorMessage: {
    marginLeft: 15,
    fontSize: 16,
    color: "#c52626",
  }
});

export default styles;