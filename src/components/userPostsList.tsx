// userPostsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import awsmobile from '../aws-exports';
import { formatRelativeTime } from './formatComponents';
import { fetchUsernameById } from './getUserUsername';

import { dark, light } from './colorModes'; 

Amplify.configure(awsmobile);

interface UserPostListProps {
  userId: string; 
  onPostPress: (postId: string) => void; // Add onPostPress prop
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
      // Sort by createdAt in descending order
      const sortedPosts = response.data.listPosts.items
      .filter(post => !post._deleted)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
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


  return (
    <View> 
    {/* {isLoading ? ( 
      <ActivityIndicator size="small" color="#fff" style={{ marginTop: 100 }} />
    ) : ( */}
    <ScrollView contentContainerStyle={styles.container}>
      {posts.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => onPostPress(item)}>
        <View key={item.id} style={styles.postContainer}>
          <View style={styles.post}>
          {item.scTrackId && (
          <View>
            <Text style={styles.user}>{item.username}</Text>
            <Text style={styles.bodytext}>{item.body}</Text>
            <Text style={styles.date}>SoundCloud Track: {item.scTrackTitle}</Text>
            <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        )}

        {item.spotifyAlbumId && (
          <View>  
            <Text style={styles.user}>{item.username}</Text>
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
            <Text style={styles.user}>{item.username}</Text>
            <Text style={styles.bodytext}>{item.body}</Text>
            <Text style={styles.date}>Track: {item.spotifyTrackName}</Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{item.spotifyTrackArtists}</Text>
            <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
          
        )}
        </View>
        </View>
        </TouchableOpacity>
      )
      )
    }
    </ScrollView>
     {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({

  container: { // Update container styles for loading
    flex: 1,             // Take up available space
    padding: 20,
    backgroundColor: dark, 
  },
  scrollViewContent: {
    padding: 0, // Remove default padding from ScrollView content
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
});

export default UserPostList;