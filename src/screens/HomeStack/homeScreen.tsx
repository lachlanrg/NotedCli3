import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Linking,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { dark, light, gray, error, lgray, dgray } from '../../components/colorModes';
import { faEdit, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import awsconfig from '../../aws-exports';
import { formatRelativeTime } from '../../components/formatComponents';
import { User } from '../../models';


Amplify.configure(awsconfig);

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();

  const [refreshing, setRefreshing] = useState(false);
  const showRefreshIcon = useRef(new Animated.Value(0)).current;
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  
  const flatListRef = useRef<FlatList>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.graphql({ query: queries.listPosts });
      // Sort posts by createdAt in descending order
      const sortedPosts = response.data.listPosts.items.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Stop refreshing indicator
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.timing(showRefreshIcon, {
      toValue: event.nativeEvent.contentOffset.y <= -50 ? 1 : 0,
      duration: 100, // Adjust animation duration as needed
      useNativeDriver: true,
    }).start();
  };

  const handleTrackPress = (track: any) => {
    setSelectedTrack(track);
  };

  const closeTrackMenu = () => {
    setSelectedTrack(null);
  };

  const handleDetailsPress = () => {
    // TODO: Implement navigation to details screen for selectedTrack
    console.log('Details pressed for:', selectedTrack);
  };

  const handleListenPress = () => {
    if (selectedTrack) {
      const url = selectedTrack.scTrackPermalinkUrl 
                  || selectedTrack.spotifyAlbumExternalUrl 
                  || selectedTrack.spotifyTrackExternalUrl;

      if (url) {
        Linking.openURL(url);
        closeTrackMenu();
      } else {
        console.warn('No external URL found for selected track');
      }
    }
  };

  const renderPostItem = ({ item }: { item: any }) => {
    const isSoundCloud = item.scTrackId;
    const isSpotifyAlbum = item.spotifyAlbumId;
    const isSpotifyTrack = item.spotifyTrackId;

    return (
      <View style={styles.postContainer}>
        <View style={styles.post}>
          <Text style={styles.user}>{item.userPostsId}</Text>
          <Text style={styles.bodytext}>{item.body}</Text>

          {isSoundCloud && (
              <View style={styles.soundCloudPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.scTrackArtworkUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{item.scTrackTitle}</Text>
                </TouchableOpacity>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
          )}

          {isSpotifyAlbum && (
              <View style={styles.spotifyPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.spotifyAlbumImageUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">Album: {item.spotifyAlbumName}</Text>
                </TouchableOpacity>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                  {item.spotifyAlbumArtists}
                </Text>
                <Text style={styles.date}>Total Tracks: {item.spotifyAlbumTotalTracks}</Text>
                <Text style={styles.date}>Release Date: {item.spotifyAlbumReleaseDate}</Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
          )}

          {isSpotifyTrack && (
            <TouchableOpacity onPress={() => handleTrackPress(item)}>
              <View style={styles.spotifyPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.spotifyTrackImageUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">Track: {item.spotifyTrackName}</Text>
                </TouchableOpacity>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                  {item.spotifyTrackArtists}
                </Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
                <Text style={styles.date}>{item.preview_url}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

    const handleTopPress = () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topButton} onPress={handleTopPress}>
        <View style={styles.topButtonArea} />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesomeIcon icon={faEdit} size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton}>
          <FontAwesomeIcon icon={faSync} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.refreshIconContainer,
          {
            opacity: showRefreshIcon,
            transform: [
              {
                translateY: showRefreshIcon.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ActivityIndicator size="small" color="#fff" />
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {selectedTrack && (
        <View style={styles.trackMenu}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeTrackMenu}
          >
            <FontAwesomeIcon icon={faTimes} size={20} color={dark} />
          </TouchableOpacity>

          <Text style={styles.trackMenuText} numberOfLines={1} ellipsizeMode="tail">
            {selectedTrack.scTrackTitle ||
              selectedTrack.spotifyAlbumName ||
              selectedTrack.spotifyTrackName}
          </Text>

          <View style={styles.menuButtonContainer}> 
          <TouchableOpacity style={styles.menuDetailsButton} onPress={handleDetailsPress}>
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.menuListenButton, { 
                borderColor: selectedTrack.scTrackId ? 'orange' : 'green' 
              }]} 
              onPress={handleListenPress}
            >
              <Text style={styles.buttonText}>
                {selectedTrack.scTrackId ? 'SoundCloud' : 'Spotify'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20,
  },
  topButton: {
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    left: '36%',
    height: 50,
    width: 100,
    zIndex: 1,
    borderColor: 'white',
    borderWidth: 0.5,
  },
  topButtonArea: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  button: {
    padding: 10,
    marginRight: 10,
  },
  refreshButton: {
    padding: 10,
  },
  postContainer: {
    margin: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  post: {
    padding: 15,
  },
  main: {
    flex: 1,
  },
  user: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bodytext: {
    color: '#ccc',
    marginBottom: 10,
  },
  soundCloudPost: {},
  spotifyPost: {},
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#ccc',
    fontSize: 14,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  trackMenu: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: light,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center', 
  },
  closeButton: {
    position: 'absolute',
    top: 10, 
    right: 10,
    padding: 3,
    color: dark,
  },
  trackMenuText: {
    color: dark,
    marginBottom: 15, 
    textAlign: 'center', 
    width: '80%',
  },
  menuButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%', 
  },
  menuDetailsButton: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: lgray, 
  },
  menuListenButton: {
    backgroundColor: light, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    color: dark, // Set button text color to dark
    fontWeight: 'bold',
  },
});

export default HomeScreen;