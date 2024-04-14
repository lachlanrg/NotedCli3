import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { createPost } from '../graphql/mutations';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { User } from '../models';

import CustomError from '../errorHandling/CustomError';
import { CustomCreatePostInput } from '../components/CustomTypes';


const CreatePostScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [userInfo, setUserUsername] = React.useState<any>(null);

  React.useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username  } = await getCurrentUser();
      console.log(`The username: ${username}`);
  
      setUserUsername({ username });
    } catch (err) {
      console.log(err);
    }
  }

  const handlePost = async () => {
   
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();
      const PostDetails = { 
        body: postContent,
        userPostsId: username, // This used to be 'userId', which showd the userID, but have subsituted the username
        // username: username,
      }
      await client.graphql({
        query: createPost,
        variables: { input: PostDetails }
      });
      console.log('New Post created successfully:', postContent, "User ID:", userId, "Username:", username);
      setPostContent('');

    } catch (error) {
      if (error instanceof CustomError) {
        console.error('Custom error:', error.message, error.code, error.stack);
      } else if (error instanceof Error) {
        console.error('Error:', error.message, error.stack);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };
  

  // useEffect(() => {
  //   // Set userId here, e.g., from context or props
  //   setUserId('your_user_id_here');
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Create a new post.."
          placeholderTextColor="#888"
          value={postContent}
          onChangeText={setPostContent}
          multiline
          numberOfLines={6}
        />
      </View>
      <Button title="Post" onPress={handlePost} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100, // Add padding at the top
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
});

export default CreatePostScreen;