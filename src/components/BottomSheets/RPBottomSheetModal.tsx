import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faMusic, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, modalBackground } from '../colorModes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import { useNavigation } from '@react-navigation/native';

const spotifyIcon = faSpotify as IconProp;
const searchIcon = faSearch as IconProp;
const musicIcon = faMusic as IconProp;

// Add this constant for the Spotify green color
const spotifyGreen = "#1DB954";

interface RPBottomSheetModalProps {
  userId: string;
}

const RPBottomSheetModal = forwardRef<BottomSheetModal, RPBottomSheetModalProps>(({ userId }, ref) => {
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
  const navigation = useNavigation();

  const client = generateClient();

  const fetchRecentlyPlayedTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.graphql({
        query: queries.listSpotifyRecentlyPlayedTracks,
        variables: { 
          filter: { 
            userSpotifyRecentlyPlayedTrackId: { eq: userId },
            _deleted: { ne: true }
          },
        },
      });

      const tracks = response.data.listSpotifyRecentlyPlayedTracks.items;
      tracks.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
      setRecentlyPlayedTracks(tracks);
    } catch (error) {
      console.error('Error fetching recently played tracks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecentlyPlayedTracks();
  }, [fetchRecentlyPlayedTracks]);

  const handleTrackPress = (track: any) => {
    if (selectedTrack && selectedTrack.id === track.id) {
      // If the pressed track is already selected, deselect it
      setSelectedTrack(null);
    } else {
      // Otherwise, select the new track
      setSelectedTrack(track);
    }
  };

  const handleSearchDetails = () => {
    if (selectedTrack) {
      // navigation.navigate('SearchSpotifyTrack', { trackId: selectedTrack.trackId });
      setSelectedTrack(null);
    }
  };

  const handleListenOnSpotify = () => {
    if (selectedTrack && selectedTrack.spotifyUri) {
      Linking.openURL(selectedTrack.spotifyUri);
      setSelectedTrack(null);
    }
  };

  const handleDismiss = useCallback(() => {
    setSelectedTrack(null);
  }, []);

  const renderTrackItem = (item: any, index: number) => (
    <View key={index}>
      <TouchableOpacity 
        style={[styles.trackItem, selectedTrack?.id === item.id && styles.selectedTrackItem]} 
        onPress={() => handleTrackPress(item)}
      >
        <FontAwesomeIcon icon={spotifyIcon} size={21} color={spotifyGreen} style={styles.icon} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">{item.trackName}</Text>
          <Text style={styles.artistName} numberOfLines={1} ellipsizeMode="tail">{item.artistName}</Text>
        </View>
      </TouchableOpacity>
      {selectedTrack?.id === item.id && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleSearchDetails}>
            <FontAwesomeIcon icon={searchIcon} size={18} color={dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.spotifyButton} onPress={handleListenOnSpotify}>
            <Text style={[styles.optionText, { color: spotifyGreen }]}>Spotify</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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
      backgroundStyle={{ backgroundColor: modalBackground }}
      onDismiss={handleDismiss}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Recently Played</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={light} />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {recentlyPlayedTracks.map(renderTrackItem)}
          </ScrollView>
        )}
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // padding: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: dark,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
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
    color: dark,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: gray,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
    marginBottom: 12,
    paddingLeft: 32, // Align with the track text
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginLeft: 10,
  },
  spotifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginLeft: 10,
  },  
  optionText: {
    fontSize: 16,
    color: dark,
    fontWeight: 'bold',
  },
  selectedTrackItem: {
    backgroundColor: 'rgba(29, 185, 84, 0.05)', // Lighter green background for selected track
    borderRadius: 8,
    // padding: 10,
  },
});

export default RPBottomSheetModal;