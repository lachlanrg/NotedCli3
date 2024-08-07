import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { SearchScreenStackParamList } from '../../components/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; 
import { faX } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, placeholder, lgray, dgray, error } from '../../components/colorModes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { createPost } from '../../graphql/mutations';
import { NavigationHelpersContext } from '@react-navigation/native';
import CustomError from '../../errorHandling/CustomError';



type PostSCTrackScreenProps = NativeStackScreenProps<SearchScreenStackParamList, 'PostSCTrack'>;

const PostSCTrackScreen: React.FC<PostSCTrackScreenProps> = ({ route, navigation }) => {
  const { sctrack } = route.params;
  const [postText, setPostText] = useState('');
  const [userId, setUserId] = useState(''); // Store userId
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

  const handleSCTrackPost = async () => {
    try {
      const client = generateClient();
      const { userId } = await getCurrentUser();
    
      const PostDetails = {
        body: postText,
        userPostsId: userId,
        scTrackTitle: sctrack.title, 
        scTrackId: sctrack.id,
        scTrackUserId: sctrack.user_id,
        scTrackArtworkUrl: sctrack.artwork_url,
      };

      await client.graphql({
        query: createPost,
        variables: { input: PostDetails },
      });
      console.log('New SC Post created successfully!');
      setPostText('');
      navigation.goBack()
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

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faX} size={18} color={light} />
            </TouchableOpacity>
              <Text style={styles.headerTitle}> Share your music</Text> 
            <TouchableOpacity onPress={handleSCTrackPost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

      {/* Text Input for the Post */}
      <TextInput
        style={styles.postInput}
        placeholder="Write something about this track..."
        placeholderTextColor={placeholder}
        multiline={true}
        value={postText}
        onChangeText={setPostText}
      />

      {/* Track Information */}
      <View style={styles.trackInfoContainer}>
        <Image source={{ uri: sctrack.artwork_url}} style={styles.trackImage} />
        <View style={styles.trackDetails}>
          <Text style={styles.trackTitle}>
            {sctrack.title} 
          </Text>

        </View>
      </View> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: dark,
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 10,
    color: light,
  },
  postButtonText: {
    color: 'lightblue',
    fontWeight: 'bold',
    justifyContent: 'flex-end',
  },
  trackName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: light,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 60,
    color: light,
    padding: 10,
  },
  postInput: {
    height: 150,
    margin: 20,
    padding: 10,
    borderColor: lgray,
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: 'top',
    color: light, 
  },
  // Track Information styles
  trackInfoContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center', 
  },
  trackImage: {
    width: 80,
    height: 80,
    borderRadius: 8, 
    marginRight: 15,
  },
  trackDetails: {
    flex: 1, 
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light, 
  },
  trackArtist: {
    color: lgray, 
  },

});

export default PostSCTrackScreen;