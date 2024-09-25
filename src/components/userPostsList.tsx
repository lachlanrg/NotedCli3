// userPostsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { listRepostsWithOriginalPost } from '../utils/customQueries';
import awsmobile from '../aws-exports';
import { formatRelativeTime } from './formatComponents';
import { dark, light, lgray, gray } from './colorModes'; 
import { getCurrentUser } from '@aws-amplify/auth';

Amplify.configure(awsmobile);

interface UserPostListProps {
  userId: string; 
  onPostPress: (post: any) => void;
  onPostsCountUpdate?: (count: number) => void; // Add this line
}

const UserPostList: React.FC<UserPostListProps> = ({ userId, onPostPress, onPostsCountUpdate }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Fetch posts
      const postsResponse = await client.graphql({ 
        query: listPosts,
        variables: { 
          filter: {
            userPostsId: { eq: userId },
          }
        }
      });

      // Fetch reposts
      const repostsResponse = await client.graphql({
        query: listRepostsWithOriginalPost,
        variables: {
          filter: {
            userRepostsId: { eq: userId },
          }
        }
      });

      const posts = postsResponse.data.listPosts.items;
      const reposts = repostsResponse.data.listReposts.items;

      // Combine posts and reposts
      const allContent = [...posts, ...reposts];

      // Sort by createdAt and filter out deleted items
      const sortedContent = allContent
        .filter(item => !item._deleted)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setPosts(sortedContent);
    } catch (error) {
      console.error('Error fetching user posts and reposts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId, fetchUserPosts]);

  useEffect(() => {
    // Update the parent component with the post count
    if (onPostsCountUpdate) {
      onPostsCountUpdate(posts.length);
    }
  }, [posts, onPostsCountUpdate]);

  const renderPostItem = (item: any) => {
    const isRepost = 'originalPost' in item;
    const postToRender = isRepost ? item.originalPost : item;

    const isSoundCloud = postToRender.scTrackId;
    const isSpotifyAlbum = postToRender.spotifyAlbumId;
    const isSpotifyTrack = postToRender.spotifyTrackId;

    return (
      <TouchableOpacity key={item.id} onPress={() => onPostPress(item)}>
        <View style={styles.postContainer}>
          {isRepost && (
            <Text style={styles.repostText}>
              Reposted from <Text style={styles.boldUsername}>{postToRender.username || 'Unknown User'}</Text>
            </Text>
          )}
          {isSoundCloud && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: postToRender.scTrackArtworkUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{postToRender.scTrackTitle}</Text>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{postToRender.scTrackArtist}</Text>
                <Text style={styles.date}>{formatRelativeTime(postToRender.createdAt)}</Text>
              </View>
            </View>
          )}

          {isSpotifyAlbum && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: postToRender.spotifyAlbumImageUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">{postToRender.spotifyAlbumName}</Text>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{postToRender.spotifyAlbumArtists}</Text>
                <Text style={styles.date}>Total Tracks: {postToRender.spotifyAlbumTotalTracks}</Text>
                {/* <Text style={styles.date}>Release Date: {postToRender.spotifyAlbumReleaseDate}</Text> */}
                <Text style={styles.date}>{formatRelativeTime(postToRender.createdAt)}</Text>
              </View>
            </View>
          )}

          {isSpotifyTrack && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: postToRender.spotifyTrackImageUrl }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{postToRender.spotifyTrackName}</Text>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{postToRender.spotifyTrackArtists}</Text>
                <Text style={styles.date}>{formatRelativeTime(postToRender.createdAt)}</Text>
              </View>
            </View>
          )}

          {!isSoundCloud && !isSpotifyAlbum && !isSpotifyTrack && (
            <Text style={styles.bodyText}>{postToRender.body}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return null; // Return nothing while loading
  }

  if (posts.length === 0 && !isLoading) {
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
  postContainer: {
    marginBottom: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 5,
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
  repostText: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  boldUsername: {
    fontWeight: 'bold',
    color: '#888',
  },
  bodyText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 200,
  },
});

export default UserPostList;