// userPostsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import awsmobile from '../aws-exports';
import { formatRelativeTime } from './formatComponents';
import { dark, light, lgray } from './colorModes'; 
import { getCurrentUser } from '@aws-amplify/auth';

Amplify.configure(awsmobile);

interface UserPostListProps {
  userId: string; 
  onPostPress: (postId: string) => void;
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, onPostPress }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();

  const fetchUserPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await client.graphql({ 
        query: listPosts,
        variables: { 
          filter: {
            userPostsId: { eq: userId } ,
          }
        }
      });
      const sortedPosts = response.data.listPosts.items
        .filter(post => !post._deleted)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const renderPostItem = (item: any) => {
    const isSoundCloud = item.scTrackId;
    const isSpotifyAlbum = item.spotifyAlbumId;
    const isSpotifyTrack = item.spotifyTrackId;

    return (
      <TouchableOpacity key={item.id} onPress={() => onPostPress(item)}>
        <View style={styles.postContainer}>
          {isSoundCloud && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: item.scTrackArtworkUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{item.scTrackTitle}</Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
            </View>
          )}

          {isSpotifyAlbum && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: item.spotifyAlbumImageUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">{item.spotifyAlbumName}</Text>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyAlbumArtists}</Text>
                <Text style={styles.date}>Total Tracks: {item.spotifyAlbumTotalTracks}</Text>
                <Text style={styles.date}>Release Date: {item.spotifyAlbumReleaseDate}</Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
            </View>
          )}

          {isSpotifyTrack && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: item.spotifyTrackImageUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{item.spotifyTrackName}</Text>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyTrackArtists}</Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#fff" style={styles.loader} />;
  }

  if (posts.length === 0) {
    return (
      <View style={styles.noPostsContainer}>
        <Text style={styles.noPostsText}>No posts made yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {posts.map(renderPostItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: dark,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  postContainer: {
    marginBottom: 20,
  },
  bodytext: {
    // This style can be removed if it's not used elsewhere
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  mediaInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  albumTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  artist: {
    color: '#ccc',
    fontSize: 12,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
  },
  noPostsText: {
    fontSize: 16,
    color: lgray,
    textAlign: 'center',
  },
});

export default UserPostList;