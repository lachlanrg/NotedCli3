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
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { dark, light, gray, error } from '../../components/colorModes';
import { faEdit, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import awsconfig from '../../aws-exports';
import { formatRelativeTime } from '../../components/formatComponents';

Amplify.configure(awsconfig);


const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();

  const [refreshing, setRefreshing] = useState(false);
  const showRefreshIcon = useRef(new Animated.Value(0)).current; 


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


  const renderPostItem = ({ item }: {item: any}) => {
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
                <Image source={{ uri: item.scTrackArtworkUrl }} style={styles.image} />
              </View>
              <Text style={styles.trackTitle}>{item.scTrackTitle}</Text>
              <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
          )}
  
          {isSpotifyAlbum && (
            <View style={styles.spotifyPost}>
              <View style={styles.main}>
                <Image source={{ uri: item.spotifyAlbumImageUrl }} style={styles.image} />
              </View>
              <Text style={styles.albumTitle}>Album: {item.spotifyAlbumName}</Text>
              <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyAlbumArtists}</Text>
              <Text style={styles.date}>Total Tracks: {item.spotifyAlbumTotalTracks}</Text>
              <Text style={styles.date}>Release Date: {item.spotifyAlbumReleaseDate}</Text>
              <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
          )}
  
          {isSpotifyTrack && (
            <View style={styles.spotifyPost}>
              <View style={styles.main}>
                <Image source={{ uri: item.spotifyTrackImageUrl }} style={styles.image} />
              </View>
              <Text style={styles.trackTitle}>Track: {item.spotifyTrackName}</Text>
              <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyTrackArtists}</Text>
              <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              <Text style={styles.date}>{item.preview_url}</Text>

            </View>
          )}
        </View>
      </View>
    );
  };
  
    return (
      <View style={styles.container}>
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
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      paddingTop: 20,
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
    soundCloudPost: {
    },
    spotifyPost: {
    },
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
  });
  
  export default HomeScreen;