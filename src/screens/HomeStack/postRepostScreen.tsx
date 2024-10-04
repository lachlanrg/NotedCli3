import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert, 
  Image,
  SafeAreaView,
  ScrollView
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
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { dark, light, gray, lgray, mediumgray, spotifyGreen, soundcloudOrange } from '../../components/colorModes';
import { Post } from '../../models';
import { formatRelativeTime } from '../../components/formatComponents';
import { formatDate } from '../../utils/dateFormatter'; // Add this import
import { sendRepostNotification } from '../../notifications/sendRepostNotification';

const client = generateClient();

const xIcon = faX as IconProp;
const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

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
        likesCount: 0,
      };

      const response = await client.graphql({
        query: mutations.createRepost,
        variables: { input }
      });

      setRepostText('');
      navigation.goBack();

      // Send notification after the repost is complete and navigation has occurred
      if (response.data && response.data.createRepost) {
        sendRepostNotification(post.id, post.userPostsId, username)
          .catch(error => console.error("Error sending repost notification:", error));
      }
    } catch (error) {
      console.error('Error creating repost:', error);
      Alert.alert('Error', 'Could not repost. Please try again.');
    }
  };

  const renderPostContent = () => {
    const isSoundCloud = post.scTrackId;
    const isSpotifyAlbum = post.spotifyAlbumId;
    const isSpotifyTrack = post.spotifyTrackId;

    const getImageUrl = () => {
      if (isSoundCloud && post.scTrackArtworkUrl) {
        return post.scTrackArtworkUrl.replace('-large', '-t500x500');
      }
      return post.spotifyAlbumImageUrl || post.spotifyTrackImageUrl || '';
    };

    return (
      <View style={styles.postContent}>
        <TouchableOpacity>
          <Text style={styles.username}>{post.username}</Text>
        </TouchableOpacity>
        {post.body && (
          <Text style={styles.bodyText}>{post.body}</Text>
        )}
        {(isSoundCloud || isSpotifyAlbum || isSpotifyTrack) && (
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: getImageUrl() }}
              style={styles.mediaImage}
            />
            <View style={styles.mediaInfo}>
              <View style={styles.mediaTitleContainer}>
                <FontAwesomeIcon 
                  icon={isSoundCloud ? soundcloudIcon : spotifyIcon} 
                  size={21} 
                  color={isSoundCloud ? soundcloudOrange : spotifyGreen} 
                  style={styles.mediaTypeIcon}
                />
                <Text style={styles.mediaTitle} numberOfLines={1} ellipsizeMode="tail">
                  {isSoundCloud ? post.scTrackTitle :
                   isSpotifyAlbum ? post.spotifyAlbumName :
                   post.spotifyTrackName}
                </Text>
              </View>
              <Text style={styles.mediaArtist} numberOfLines={1} ellipsizeMode="tail">
                {isSoundCloud ? post.scTrackArtist :
                 isSpotifyAlbum ? post.spotifyAlbumArtists :
                 post.spotifyTrackArtists}
              </Text>
              {isSpotifyAlbum && post.spotifyAlbumTotalTracks && post.spotifyAlbumReleaseDate && (
                <Text style={styles.mediaDetails}>
                  {`${post.spotifyAlbumTotalTracks} tracks • ${formatDate(post.spotifyAlbumReleaseDate)}`}
                </Text>
              )}
              {isSpotifyTrack && post.spotifyTrackReleaseDate && post.spotifyTrackDurationMs && (
                <View>
                  <Text style={styles.mediaDetails}>
                    {`${formatDate(post.spotifyTrackReleaseDate)} • ${Math.floor(
                      post.spotifyTrackDurationMs / 60000)}m ${((post.spotifyTrackDurationMs % 60000) / 1000).toFixed(0).padStart(2, '0')}s`}
                  </Text>
                  {post.spotifyTrackExplicit && (
                    <View style={styles.explicitLabelContainer}>
                      <Text style={styles.explicitLabel}>Explicit</Text>
                    </View>
                  )}
                </View>
              )}
              {isSoundCloud && post.scTrackCreatedAt && (
                <Text style={styles.mediaDetails}>
                  {formatDate(post.scTrackCreatedAt)}
                </Text>
              )}
            </View>
          </View>
        )}
        <Text style={styles.timestamp}>{formatRelativeTime(post.createdAt)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <FontAwesomeIcon icon={xIcon} size={18} color={light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Repost</Text>
          <TouchableOpacity 
            onPress={handleRepost} 
            style={styles.headerButton}
          >
            <Text style={styles.postButtonText}>
              Repost
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={styles.input}
            placeholder="Add your thoughts or leave blank..."
            placeholderTextColor={lgray}
            value={repostText}
            onChangeText={setRepostText}
            multiline
            maxLength={600}
          />
          <View style={styles.separator} />
          <View style={styles.originalPostContainer}>
            {renderPostContent()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: dark,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,  // Add this line
    borderBottomColor: mediumgray,  // Add this line
  },
  headerButton: {
    width: 60, // Adjust this value as needed
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    flex: 1,
    textAlign: 'center',
  },
  postButtonText: {
    color: 'lightblue',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  disabledPostButton: {
    color: gray,
  },
  input: {
    color: light,
    fontSize: 16,
    padding: 15,
    minHeight: 50,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: mediumgray,
    marginHorizontal: 15,
  },
  originalPostContainer: {
    padding: 15,
    marginLeft: 20,
  },
  postContent: {
    marginBottom: 10,
  },
  username: {
    color: light,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  bodyText: {
    color: light,
    fontSize: 14,
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: 120,
    height: 120,
    borderRadius: 4,
  },
  mediaInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  mediaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mediaTypeIcon: {
    marginRight: 6,
  },
  mediaTitle: {
    color: light,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  mediaArtist: {
    color: lgray,
    fontSize: 12,
  },
  mediaDetails: {
    color: lgray,  // Change this from gray to lgray
    fontSize: 11,
    marginTop: 4,
  },
  explicitLabelContainer: {
    backgroundColor: '#444',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  explicitLabel: {
    color: light,
    fontSize: 10,
    fontWeight: 'bold',
  },
  timestamp: {
    color: lgray,  // Change this from gray to lgray
    fontSize: 12,
    marginTop: 10,
  },
});

export default PostRepostScreen;