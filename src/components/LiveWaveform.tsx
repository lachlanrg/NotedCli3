import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LiveWaveform: React.FC = () => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (animation: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(animation1, 0);
    animate(animation2, 150);
    animate(animation3, 300);
  }, []);

  const getBarStyle = (animation: Animated.Value) => ({
    transform: [
      {
        scaleY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, getBarStyle(animation1)]} />
      <Animated.View style={[styles.bar, getBarStyle(animation2)]} />
      <Animated.View style={[styles.bar, getBarStyle(animation3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 20,
    height: 20,
  },
  bar: {
    width: 4,
    height: '100%',
    backgroundColor: '#1DB954', // Spotify green color
    borderRadius: 2,
  },
});

export default LiveWaveform;