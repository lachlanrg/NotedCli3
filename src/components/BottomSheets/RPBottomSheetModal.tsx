import React, { forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { dark, light, gray } from '../colorModes';
import { useSpotify } from '../../context/SpotifyContext';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const spotifyIcon = faSpotify as IconProp;

const RPBottomSheetModal = forwardRef<BottomSheetModal>((_, ref) => {
  const { recentlyPlayed } = useSpotify();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={['50%']}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: dark }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Recently Played</Text>
        {recentlyPlayed.map((item, index) => (
          <View key={index} style={styles.trackItem}>
            <FontAwesomeIcon icon={spotifyIcon} size={20} color={light} style={styles.icon} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackName}>{item.track.name}</Text>
              <Text style={styles.artistName}>{item.track.artists[0].name}</Text>
            </View>
          </View>
        ))}
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    color: light,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: gray,
  },
});

export default RPBottomSheetModal;