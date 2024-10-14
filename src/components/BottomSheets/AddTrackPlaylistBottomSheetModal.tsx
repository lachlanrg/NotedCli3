import React, { useMemo, forwardRef, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { dark, light, lgray, mediumgray, spotifyGreen, gray, error } from '../colorModes';
import { addTrackToPlaylist } from '../../utils/spotifyPlaylistAPI';
import { CLIENT_ID, CLIENT_SECRET } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { generateClient } from 'aws-amplify/api';
import { getSpotifyPlaylist, listSpotifyPlaylists, getUserPlaylistTrack } from '../../graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';

type AddTrackPlaylistBottomSheetModalProps = {
  playlistId: string;
  onTracksAdded: () => void;
};

const AddTrackPlaylistBottomSheetModal = forwardRef<BottomSheetModal, AddTrackPlaylistBottomSheetModalProps>(
  ({ playlistId, onTracksAdded }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
    const [playlistType, setPlaylistType] = useState<string>('');
    const [userTrackCount, setUserTrackCount] = useState(0);
    const [userId, setUserId] = useState('');
    const [trackLimitPerUser, setTrackLimitPerUser] = useState<number | 'unlimited'>(0);

    const snapPoints = useMemo(() => ['80%'], []);

    useEffect(() => {
      // Get Spotify Access Token
      var authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }
      fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => setAccessToken(data.access_token))
    }, []);

    useEffect(() => {
      // Fetch playlist type and track limit from our database
      const fetchPlaylistDetails = async () => {
        try {
          const client = generateClient();
          const response = await client.graphql({
            query: listSpotifyPlaylists,
            variables: { 
              filter: { 
                spotifyPlaylistId: { eq: playlistId }
              }
            }
          });
          const dbPlaylist = response.data.listSpotifyPlaylists.items[0];
          if (dbPlaylist) {
            setPlaylistType(dbPlaylist.type);
            const trackLimit = dbPlaylist.trackLimitPerUser;
            setTrackLimitPerUser(trackLimit === 'unlimited' ? 'unlimited' : Number(trackLimit) || 0);
          }
        } catch (error) {
          console.error('Error fetching playlist details:', error);
        }
      };
      fetchPlaylistDetails();
    }, [playlistId]);

    useEffect(() => {
      const fetchUserIdAndTrackCount = async () => {
        try {
          const { userId } = await getCurrentUser();
          setUserId(userId); // Set the userId state
          
          const client = generateClient();
          const response = await client.graphql({
            query: getUserPlaylistTrack,
            variables: { 
              id: `${playlistId}:${userId}`
            }
          });
          
          const userPlaylistTrack = response.data.getUserPlaylistTrack;
          console.log('User playlist track:', userPlaylistTrack);
          
          if (userPlaylistTrack) {
            const newTrackCount = userPlaylistTrack.trackCount;
            setUserTrackCount(newTrackCount);
            console.log('User track count:', newTrackCount);
          } else {
            setUserTrackCount(0);
            console.log('User track count: 0 (no existing track data)');
          }
        } catch (error) {
          console.error('Error fetching user track count:', error);
        }
      };
      fetchUserIdAndTrackCount();
    }, [playlistId]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      []
    );

    const handleSearch = useCallback(async () => {
      if (searchQuery.trim() === '') return;
      setIsLoading(true);
      try {
        var searchParameters = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          }
        }
        var response = await fetch('https://api.spotify.com/v1/search?q=' + searchQuery + '&type=track&limit=20', searchParameters);
        var data = await response.json();
        setSearchResults(data.tracks.items);
      } catch (error) {
        console.error('Error searching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    }, [searchQuery, accessToken]);

    const toggleTrackSelection = useCallback((trackUri: string) => {
      setSelectedTracks(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(trackUri)) {
          newSelected.delete(trackUri);
        } else if (trackLimitPerUser === 'unlimited' || newSelected.size < trackLimitPerUser - userTrackCount) {
          newSelected.add(trackUri);
        }
        return newSelected;
      });
    }, [trackLimitPerUser, userTrackCount]);

    const handleAddSelectedTracks = useCallback(async () => {
      try {
        const trackUris = Array.from(selectedTracks);
        await addTrackToPlaylist(playlistId, trackUris, playlistType, userId);
        setSelectedTracks(new Set());
        setUserTrackCount(prevCount => prevCount + trackUris.length); // Update local state
        onTracksAdded();
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      } catch (error) {
        console.error('Error adding tracks to playlist:', error);
        Alert.alert('Error', 'Failed to add tracks to the playlist. Please try again.');
      }
    }, [playlistId, selectedTracks, onTracksAdded, playlistType, userId]);

    const clearSelectedTracks = useCallback(() => {
      setSelectedTracks(new Set());
    }, []);

    const renderTrackItem = ({ item }: { item: any }) => (
      <TouchableOpacity 
        style={styles.trackItem} 
        onPress={() => toggleTrackSelection(item.uri)}
        disabled={trackLimitPerUser !== 'unlimited' && selectedTracks.size >= trackLimitPerUser - userTrackCount && !selectedTracks.has(item.uri)} // Disable if limit reached
      >
        <Image source={{ uri: item.album.images[0]?.url }} style={styles.trackImage} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.name}</Text>
          <Text style={styles.artistName}>{item.artists.map((artist: any) => artist.name).join(', ')}</Text>
        </View>
        {selectedTracks.has(item.uri) && (
          <FontAwesomeIcon icon={faCheck} size={20} color={spotifyGreen} />
        )}
      </TouchableOpacity>
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="extend"
      >
        <View style={styles.contentContainer}>
          {userTrackCount >= (trackLimitPerUser === 'unlimited' ? Infinity : trackLimitPerUser) ? (
            <View style={styles.limitReachedContainer}>
              <Text style={styles.limitReachedText}>Sorry!</Text>
              <Text style={styles.limitReachedText}>You have reached your limit for this playlist</Text>
            </View>
          ) : (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a track..."
                placeholderTextColor={lgray}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                editable={trackLimitPerUser !== 'unlimited' && userTrackCount < trackLimitPerUser} // Disable if limit reached
              />
              {selectedTracks.size > 0 && (
                <TouchableOpacity style={styles.deselectButton} onPress={clearSelectedTracks}>
                  <Text style={styles.deselectButtonText}>Deselect</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {isLoading ? (
            <ActivityIndicator size="large" color={spotifyGreen} />
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderTrackItem}
              keyExtractor={(item) => item.id}
              style={styles.resultsList}
            />
          )}
          {selectedTracks.size > 0 && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddSelectedTracks}>
              <Text style={styles.addButtonText}>
                Add {selectedTracks.size} Track{selectedTracks.size > 1 ? 's' : ''} 
                (Total: {userTrackCount + selectedTracks.size})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: mediumgray,
  },
  handleIndicator: {
    backgroundColor: lgray,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: dark,
    color: light,
    padding: 10,
    borderRadius: 5,
  },
  resultsList: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    color: lgray,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: spotifyGreen,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deselectButton: {
    marginLeft: 10,
    padding: 10,
  },
  deselectButtonText: {
    color: error,
    fontWeight: 'bold',
  },
  limitReachedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 10,
  },
  limitReachedText: {
    color: lgray,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AddTrackPlaylistBottomSheetModal;
