import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    height: Dimensions.get('screen').height
  },

  box: {
    height: '30%',
    width: '80%',

    borderRadius: 10,

    backgroundColor: '#333',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    padding: '5%',

    borderTopStartRadius: 10,
    borderTopEndRadius: 10,

    backgroundColor: '#333'
  },

  title: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 18
  },

  messageContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',

    height: '45%',

    marginHorizontal: '5%',
  },

  message: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 18
  },

  buttonContainer: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  button: {
    padding: '3%',
  },

  text: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 18, 
  },
});