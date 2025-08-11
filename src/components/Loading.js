import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ecf0f1" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Used to cover the background, create an overlay, or position a component so that it covers its parent entirely.
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,  
  },
});
