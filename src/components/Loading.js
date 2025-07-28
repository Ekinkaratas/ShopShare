import React from 'react';
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
    ...StyleSheet.absoluteFillObject,  // tüm ekranı kaplar
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // yarı saydam siyah, arka planı kısar
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,  // üstte görünmesini sağlar
  },
});
