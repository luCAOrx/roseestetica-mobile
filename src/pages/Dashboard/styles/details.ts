import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    height: 550,
    margin: 20,

    borderRadius: 8
  },

  header: {
    height: 28,

    borderRadius: 8,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#3A4498'
  },

  text: {
    fontSize: 15,

    color: '#D2D2E3'
  },

  detail: {
    marginTop: 20,
    marginBottom: 20,

    justifyContent: 'center',
    alignItems: 'center'
  },

  detailChild: {
    marginTop: 20,
    margin: 20,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  price: {
    fontFamily: 'Roboto_400Regular',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,

    color: '#248E54'
  },
});

export default styles;