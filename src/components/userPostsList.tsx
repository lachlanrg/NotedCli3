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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { spotifyGreen, soundcloudOrange } from './colorModes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { formatDate } from '../utils/dateFormatter'; // Add this import

Amplify.configure(awsmobile);

interface UserPostListProps {
  userId: string; 
  onPostsCountUpdate?: (count: number) => void; // Add this line
  onPostPress?: (post: any) => void; // Add this line
  onPostLongPress?: (post: any) => void; // Add this line
}

const soundcloudIcon = faSoundcloud as IconProp;
const spotifyIcon = faSpotify as IconProp;

const UserPostList: React.FC<UserPostListProps> = ({ userId, onPostsCountUpdate, onPostPress, onPostLongPress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
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

      // Update posts state without clearing the previous posts
      setPosts(prevPosts => {
        const newPosts = sortedContent;
        // Only update onPostsCountUpdate if the count has changed
        if (onPostsCountUpdate && newPosts.length !== prevPosts.length) {
          onPostsCountUpdate(newPosts.length);
        }
        return newPosts;
      });
    } catch (error) {
      console.error('Error fetching user posts and reposts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onPostsCountUpdate]);

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId, fetchUserPosts]);

  const handlePostPress = (post: any) => {
    if (onPostPress) {
      onPostPress(post);
    } else {
      navigation.navigate('ProfilePost', { post });
    }
  };

  const handlePostLongPress = (post: any) => {
    if (onPostLongPress) {
      onPostLongPress(post);
    }
  };

  const renderPostItem = (item: any) => {
    const isRepost = 'originalPost' in item;
    const postToRender = isRepost ? item.originalPost : item;

    const isSoundCloud = postToRender.scTrackId;
    const isSpotifyAlbum = postToRender.spotifyAlbumId;
    const isSpotifyTrack = postToRender.spotifyTrackId;

    return (
      <TouchableOpacity 
        key={item.id} 
        onPress={() => handlePostPress(item)}
        onLongPress={() => handlePostLongPress(item)}
        activeOpacity={1}
      >
        <View style={styles.postContainer}>
          {isRepost && (
            <Text style={styles.repostText}>
              Reposted from <Text style={styles.boldUsername}>{postToRender.username || 'Unknown User'}</Text>
            </Text>
          )}
          {(isSoundCloud || isSpotifyAlbum || isSpotifyTrack) && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ 
                  uri: isSoundCloud 
                    ? postToRender.scTrackArtworkUrl.replace('-large', '-t500x500') 
                    : postToRender.spotifyAlbumImageUrl || postToRender.spotifyTrackImageUrl 
                }}
                style={styles.image}
              />
              <View style={styles.mediaInfo}>
                <View style={styles.mediaTitleContainer}>
                  <FontAwesomeIcon 
                    icon={isSoundCloud ? soundcloudIcon : spotifyIcon} 
                    size={21} 
                    color={isSoundCloud ? soundcloudOrange : spotifyGreen} 
                    style={styles.mediaTypeIcon}
                  />
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
                    {isSoundCloud ? postToRender.scTrackTitle :
                     isSpotifyAlbum ? postToRender.spotifyAlbumName :
                     postToRender.spotifyTrackName}
                  </Text>
                </View>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                  {isSoundCloud ? postToRender.scTrackArtist :
                   isSpotifyAlbum ? postToRender.spotifyAlbumArtists :
                   postToRender.spotifyTrackArtists}
                </Text>
                {isSpotifyAlbum && (
                  <Text style={styles.date}>Total Tracks: {postToRender.spotifyAlbumTotalTracks} • {formatDate(postToRender.spotifyAlbumReleaseDate)}</Text>
                )}
                {isSpotifyTrack && (
                  <Text style={styles.date}>{formatDate(postToRender.spotifyTrackReleaseDate)}</Text>
                )}
                {isSoundCloud && (
                  <Text style={styles.date}>{formatDate(postToRender.scTrackCreatedAt)}</Text>
                )}
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

  if (isLoading && posts.length === 0) {
    return null; // Only return null if it's the initial load
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
    flex: 1,
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
  mediaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  mediaTypeIcon: {
    marginRight: 6,
  },
});

export default UserPostList;