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

  const renderPostItem = ({ item }: { item: any }) => (
    <View style={styles.postContainer}>
      <View style={styles.post}>
        {item.scTrackId && (
          <View>
            <Text style={styles.user}>{item.userPostsId}</Text>
            <Text style={styles.bodytext}>{item.body}</Text>
            <Text style={styles.date}>SoundCloud Track: {item.scTrackTitle}</Text>
            <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        )}

        {item.spotifyAlbumId && (
          <View>
            <Text style={styles.user}>{item.userPostsId}</Text>
            <Text style={styles.bodytext}>{item.body}</Text>
            <Text style={styles.bodytext}>Album: {item.spotifyAlbumName}</Text>
            <Text style={styles.date}>Total Tracks: {item.spotifyAlbumTotalTracks}</Text>
            <Text style={styles.date}>{item.spotifyAlbumReleaseDate}</Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyAlbumArtists}</Text>
            <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        )}

        {item.spotifyTrackId && (
          <View>
            <Text style={styles.user}>{item.userPostsId}</Text>
            <Text style={styles.bodytext}>{item.body}</Text>
            <Text style={styles.date}>Track: {item.spotifyTrackName}</Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyTrackArtists}</Text>
            <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesomeIcon icon={faEdit} size={20} color={light}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton}>
          <FontAwesomeIcon icon={faSync} size={20} color={light}/>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.refreshIconContainer,
          { 
            opacity: showRefreshIcon, // Control opacity for fade-in/out 
            transform: [
              {
                translateY: showRefreshIcon.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0], // Adjust translation for smoother effect
                }),
              },
            ],
          }
        ]}
      >
        <ActivityIndicator size="small" color={light} /> 
      </Animated.View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll} // Add scroll event listener
        scrollEventThrottle={16} // Adjust throttle for performance
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: dark,
    paddingTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingTop: 10,
    color: light,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginBottom: 10,
    backgroundColor: dark,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  refreshButton: {
    borderRadius: 8,
    padding: 10,
  },
  postContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  post: {
    padding: 8,
    borderRadius: 8,
  },
  user: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bodytext: {
    color: '#ccc',
    marginBottom: 5,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
  artist: {
    fontSize: 12,
    color: '#888',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#333',
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