import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    margin: 20,

    borderRadius: 8
  },

  header:{
    margin: 17,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  
  text: {
    flex:1,
    
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default styles;