// Not used but could be part of exporting menu
import React, { useRef, useEffect, useState } from 'react';
import { 
  Animated,
  Easing,
  PanResponder
} from 'react-native';
import { Track } from '../spotifyConfig/itemInterface';


export const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
export const bottomSheetHeight = useRef(new Animated.Value(0)).current;
export const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); 


export const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Calculate new height based on drag
        const newHeight = Math.max(0, 200 - gesture.dy); // 200 is the initial height
        bottomSheetHeight.setValue(newHeight); 
      },
      onPanResponderRelease: (event, gesture) => {
        // If dragged down enough, close the sheet
        if (gesture.dy > 50 && isBottomSheetOpen) { 
          closeBottomSheet();
        } else {
          // Otherwise, snap back to open position
          Animated.timing(bottomSheetHeight, {
            toValue: 200,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

export const toggleBottomSheet = (track: Track | null) => {
    setSelectedTrack(track);
  
    Animated.timing(bottomSheetHeight, {
      toValue: track ? 200 : 0, 
      duration: 200, 
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, 
    }).start(() => {
      // Update isBottomSheetOpen after animation completes
      setIsBottomSheetOpen(track !== null); 
    });
  };
  
  export const closeBottomSheet = () => {
    toggleBottomSheet(null); 
  };

