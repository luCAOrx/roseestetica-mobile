import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  hour: {
    height: 60,
    margin: 15,
    width: 95,

    backgroundColor: "#248E54" ,
    borderRadius: 8,

    justifyContent: "center",
    alignItems: "center",
  },
  
  hourTitle: {
    fontFamily: "Roboto_900Black",
    fontSize: 15,
    lineHeight: 18
  },

  selectedHour: {
    backgroundColor: "#333529"
  },

  errorMessage: {
    marginBottom: 10,
    
    textAlign: 'center',

    fontSize: 16,

    color: "#c52626",
  }
});

export default styles;