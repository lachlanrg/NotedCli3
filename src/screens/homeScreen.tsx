import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../components/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';

import { formatRelativeTime } from '../components/formatComponents';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../aws-exports';
import { getCurrentUser } from '@aws-amplify/auth';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { Post } from '../API';
import { User } from '../models';


Amplify.configure(awsconfig);

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const client = generateClient();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const allPosts = await client.graphql({ query: queries.listPosts });
      const posts = allPosts.data.listPosts.items || [];
  
      // Map posts and add username
      const sortedposts = posts.map((post: Post) => ({
        ...post,
        // username: post.user?.username
      }));
  
      // Sort posts by createdAt in descending order
      sortedposts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
      return sortedposts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  // Display the posts
  const displayPosts = async () => {
    const posts = await fetchPosts();
    console.log('************************ LIST OF POSTS *************************');
    console.log(" ");

    posts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`);
      console.log(`ID: ${post.id}`);
      console.log(`Body: ${post.body}`);
      console.log(`Created At: ${post.createdAt}`);
      console.log('Created:', formatRelativeTime(post.createdAt));
      // console.log(`Updated At: ${post.updatedAt}`);
      console.log(`UserPostId Username: ${post.userPostsId}`);
      console.log(`User ID: ${post.user?.id}`);
      console.log('------------------------------------------');
    });    
    console.log(" ");
    console.log('**************************** END ****************************');

    console.log(" ");
    console.log(" ");
    setPosts(posts);
  };

  // Refresh the posts
  const refreshPosts = () => {
    displayPosts();
  };

  useEffect(() => {
    displayPosts();
  }, []);

  // const handleDeletePost = async (postId: string) => {    try {
  const handleDeletePost = async (postId: string) => {    try {

      const postDetails = {
        id: postId
          // id: "49ef7ecf-6893-4a72-bab8-c10eca5e98f9"
      };
      await client.graphql({
        query: mutations.deletePost, 
        variables: { input: postDetails }
      });
      console.log('Post deleted successfully:', postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreatePostTab')}>
          <FontAwesomeIcon icon={faEdit} size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshPosts}>
          <FontAwesomeIcon icon={faSync} size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.postsContainer}>
        {posts.map(post => (
          <View key={post.id} style={styles.post}>
            <Text>{post.body}</Text>
            <Text>{post.userPostsId}</Text>
            <Text>{post.user?.username}</Text>
            <Text>{formatRelativeTime(post.createdAt)}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(post.id)}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  postsContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  post: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
});

export default HomeScreen;