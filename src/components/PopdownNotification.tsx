import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet, TouchableOpacity, PanResponder, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '../context/NotificationContext';

interface PopdownNotificationProps {
  title: string;
  message: string;
  isComment: boolean;
  onDismiss: () => void;
}

const PopdownNotification: React.FC<PopdownNotificationProps> = ({ title, message, isComment, onDismiss }) => {
  const { inAppEnabled } = useNotification();
  const translateY = useRef(new Animated.Value(-100)).current;
  const { height } = Dimensions.get('window');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy < 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -50) {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(onDismiss);
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (!inAppEnabled) {
      onDismiss();
      return;
    }

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start(onDismiss);
    }, 8000);

    return () => clearTimeout(timer);
  }, [inAppEnabled]);

  if (!inAppEnabled) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { top: height * 0.08 }]} edges={['top']}>
      <Animated.View
        style={[styles.animatedContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.shadowContainer}>
          <TouchableOpacity onPress={onDismiss} style={styles.touchable}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.message}>{message}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  animatedContainer: {
    // No styles needed here
  },
  shadowContainer: {
    backgroundColor: '#333', // Solid background color
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchable: {
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PopdownNotification;