import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput,
  Button,
  Alert, 
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { getCurrentUser } from 'aws-amplify/auth';
import { HomeStackParamList } from '../../components/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { light, dark, gray, lgray } from '../../components/colorModes';
import { Post } from '../../models';

const client = generateClient();

const xIcon = faX as IconProp;

type PostRepostScreenRouteProp = NativeStackScreenProps<HomeStackParamList, 'PostRepost'>;

const PostRepostScreen: React.FC<PostRepostScreenRouteProp> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { post } = route.params;
  const [repostText, setRepostText] = useState('');

  const handleRepost = async () => {
    try {
        const { userId, username } = await getCurrentUser();
        const input = {
        body: repostText,
        userRepostsId: userId,
        userOriginalPostId: post.userPostsId,
        username: username,
        postRepostsId: post.id,
        };

        await client.graphql({
        query: mutations.createRepost,
        variables: { input }
        });

        setRepostText('');
        navigation.goBack()

    } catch (error) {
        console.error('Error creating repost:', error);
        Alert.alert('Error', 'Could not repost. Please try again.');
    }
    };

  // Function to determine what to render at the bottom
  const renderPostContent = () => {
    
    const getImageUrl = (url: string | null | undefined) => {
        return url ? { uri: url } : require('../../assets/placeholder.png');
      };

    if (post.scTrackId) {
      return ( 
        // Render SoundCloud content
        <View style={styles.trackInfoContainer}>
           <Image source={getImageUrl(post.scTrackArtworkUrl)} style={styles.trackImage} />
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle}>
              {post.scTrackTitle} 
            </Text>
            <Text style={styles.trackArtist}>
              {post.scTrackUsername} 
            </Text>
          </View>
        </View> 
      )
    } else if (post.spotifyAlbumId) {
      return (
        // Render Spotify Album content
        <View style={styles.trackInfoContainer}>
          <Image source={getImageUrl(post.spotifyAlbumImageUrl)} style={styles.trackImage} />
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle}>
              {post.spotifyAlbumName} 
            </Text>
            <Text style={styles.trackArtist}>
              {post.spotifyAlbumArtists} 
            </Text>
          </View>
        </View> 
      )
    } else if (post.spotifyTrackId) {
      return (
        // Render Spotify Track content
        <View style={styles.trackInfoContainer}>
          <Image source={getImageUrl(post.spotifyTrackImageUrl )} style={styles.trackImage} />
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle}>
              {post.spotifyTrackName} 
            </Text>
            <Text style={styles.trackArtist}>
              {post.spotifyTrackArtists} 
            </Text>
          </View>
        </View> 
      )
    } else {
      // Render default content (for text-only posts or other types in the future)
      return (
        <View style={styles.trackInfoContainer}>
          <Text>{post.body}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 

    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={xIcon} size={18} color={light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Repost</Text> 
        <TouchableOpacity onPress={handleRepost}>
          <Text style={styles.postButtonText}>Repost</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add your thoughts..."
        value={repostText}
        onChangeText={setRepostText}
        multiline
        maxLength={600}
      />

      {/* Render the original post content */}
      {renderPostContent()}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark, // Background color
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: light, 
  },
  // Track Information styles (reused from your example)
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
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default PostRepostScreen;