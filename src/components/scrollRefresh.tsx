//scrollRefresh.tsx
import React, { useRef, useState } from "react";
import { Animated } from "react-native";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

// Used for Profile
export const showRefreshIcon = useRef(new Animated.Value(0)).current; 
export const [refreshing, setRefreshing] = useState(false);

export const handleScrollRefresh = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.timing(showRefreshIcon, {
      toValue: event.nativeEvent.contentOffset.y <= -50 ? 1 : 0, 
      duration: 100, // Adjust animation duration as needed
      useNativeDriver: true, 
    }).start();
  };


// Put animated view in each screen and create onRefresh const for onScroll function