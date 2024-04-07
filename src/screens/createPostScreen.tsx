// CreatePostScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions } from 'react-native';

const CreatePostScreen = () => {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    // Handle submitting the post
    console.log('New Post:', postContent);
    // You can add code here to submit the post to your backend
    // For example, using AWS services like Amplify
    // You can also add validation logic here
    setPostContent(''); // Clear the input after posting
  };

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
