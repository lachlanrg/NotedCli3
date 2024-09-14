import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { dark, light, gray, modalBackground } from '../colorModes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';

const spotifyIcon = faSpotify as IconProp;

interface RPBottomSheetModalProps {
  userId: string;
}

const RPBottomSheetModal = forwardRef<BottomSheetModal, RPBottomSheetModalProps>(({ userId }, ref) => {
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Recently Played</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={light} />
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {recentlyPlayedTracks.map((item, index) => (
              <View key={index} style={styles.trackItem}>
                <FontAwesomeIcon icon={spotifyIcon} size={20} color={"#1DB954"} style={styles.icon} />
                <View style={styles.trackInfo}>
                    
                  <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">{item.trackName}</Text>
                  <Text style={styles.artistName} numberOfLines={1} ellipsizeMode="tail">{item.artistName}</Text>
                </View>
              </View>
            ))}
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
});

export default RPBottomSheetModal;