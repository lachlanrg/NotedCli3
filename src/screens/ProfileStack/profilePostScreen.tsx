import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatRelativeTime } from '../../components/formatComponents';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartSolid, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ProfileStackParamList } from '../../components/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCurrentUser } from 'aws-amplify/auth';
import { dark, gray, light, soundcloudOrange, spotifyGreen } from '../../components/colorModes';
import { generateClient } from 'aws-amplify/api';
import { updatePost, updateRepost } from '../../graphql/mutations';
import CustomBottomSheet from '../../components/BottomSheets/CommentsBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { listComments } from '../../graphql/queries'; // Ensure you have the correct import for listComments
import { Linking } from 'react-native';
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { formatDate } from '../../utils/dateFormatter';
import { selectionChange } from '../../utils/hapticFeedback';
import { sendPostLikeNotification } from '../../notifications/sendPostLikeNotification';
import { UpdatePostMutation, UpdateRepostMutation } from '../../API';  // Make sure to import these types from your generated API file
import { Post, Repost } from '../../API';  // Adjust the import path as needed
import { getPost, getRepost } from '../../graphql/queries';  // Add this import

type ProfilePostScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfilePost'>;

const commentIcon = faComment as IconProp;
const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;
const repostIcon = faArrowsRotate as IconProp;
const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

const ProfilePostScreen: React.FC<ProfilePostScreenProps> = ({ route }) => {
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
    const { post } = route.params;
    const [userInfo, setUserId] = React.useState<any>(null);
    const [updatedPost, setUpdatedPost] = useState(post);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});
    const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    currentAuthenticatedUser();
    fetchPostData();
    fetchCommentCounts();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      console.log(`The User Id: ${userId}`);

      setUserId({ userId });
    } catch (err) {
      console.log(err);
    }
  }

  const fetchPostData = async () => {
    setIsLoading(true);
    try {
      const client = generateClient();
      let fetchedPost;

      if (isRepost(post)) {
        const repostData = await client.graphql({
          query: getRepost,
          variables: { id: post.id },
        });
        fetchedPost = repostData.data.getRepost;
      } else {
        const postData = await client.graphql({
          query: getPost,
          variables: { id: post.id },
        });
        fetchedPost = postData.data.getPost;
      }

      setUpdatedPost(fetchedPost);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePress = async (itemId: string) => {
    selectionChange();
    try {
      const { userId, username } = await getCurrentUser();
      const client = generateClient();

      if (!userInfo) {
        console.error("User not logged in!");
        return;
      }

      const isLiked = (updatedPost.likedBy || []).includes(userInfo?.userId || "");

      let updatedLikedBy = Array.isArray(updatedPost.likedBy)
        ? [...updatedPost.likedBy]
        : [];

      if (!isLiked) {
        updatedLikedBy.push(userId);
      } else {
        updatedLikedBy = updatedLikedBy.filter((id: string) => id !== userId);
      }
      const updatedLikesCount = updatedLikedBy.length;

      const isRepost = 'originalPost' in updatedPost;
      const mutation = isRepost ? updateRepost : updatePost;

      const updatedItemData = await client.graphql({
        query: mutation,
        variables: {
          input: {
            id: itemId,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount,
            _version: updatedPost._version,
          },
        },
      });

      // Type guard functions
      function isUpdateRepostMutation(data: any): data is { data: { updateRepost: Repost } } {
        return 'updateRepost' in data.data;
      }

      function isUpdatePostMutation(data: any): data is { data: { updatePost: Post } } {
        return 'updatePost' in data.data;
      }

      // Update the state
      setUpdatedPost((prevPost: Post | Repost) => {
        if (isUpdateRepostMutation(updatedItemData)) {
          return {
            ...prevPost,
            ...updatedItemData.data.updateRepost,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount,
          } as Repost;
        } else if (isUpdatePostMutation(updatedItemData)) {
          return {
            ...prevPost,
            ...updatedItemData.data.updatePost,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount,
          } as Post;
        } else {
          // This should never happen, but TypeScript needs this case
          console.error("Unexpected data structure from mutation");
          return prevPost;
        }
      });

      // Send notification if the item was liked
      if (!isLiked) {
        const postUserId = isRepost ? updatedPost.userRepostsId : updatedPost.userPostsId;
        sendPostLikeNotification(itemId, postUserId, username || 'A user')
          .catch(error => console.error("Error sending like notification:", error));
      }

    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();

  const handlePresentModalPress = (post: any) => {
    setSelectedPost(post);
    bottomSheetRef.current?.present();
  }

  const getImageUrl = (url: string | null | undefined) => {
    if (url) {
      if (displayPost.scTrackId) {
        // For SoundCloud tracks, replace the size in the URL to get the highest quality
        const highQualityUrl = url.replace('-large', '-t500x500');
        return { uri: highQualityUrl };
      }
      return { uri: url };
    }
    return require('../../assets/placeholder.png');
  };

  const fetchCommentCounts = useCallback(async () => {
    try {
      const client = generateClient();
      const response = await client.graphql({
        query: listComments,
        variables: {
          filter: {
            postId: { eq: post.id },
            _deleted: { ne: true }, // Add this line to exclude deleted comments
          },
        },
      });
      const nonDeletedComments = response.data.listComments.items.filter(
        (comment: any) => !comment._deleted
      );
      setCommentCounts({ [post.id]: nonDeletedComments.length });
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  }, [post]);

  useEffect(() => {
    fetchCommentCounts();
  }, [fetchCommentCounts]);

  const isRepost = (post: any) => {
    return post.originalPost !== undefined;
  };

  const getDisplayPost = (post: any) => {
    return isRepost(post) ? post.originalPost : post;
  };

  const displayPost = getDisplayPost(post);

  const handleSpotifyPress = () => {
    const url = displayPost.spotifyTrackExternalUrl || displayPost.spotifyAlbumExternalUrl;
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleSoundCloudPress = () => {
    if (displayPost.scTrackPermalinkUrl) {
      Linking.openURL(displayPost.scTrackPermalinkUrl);
    }
  };

  useEffect(() => {
    // console.log('Display post:', displayPost);
  }, [displayPost]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            {(displayPost.spotifyTrackExternalUrl || displayPost.spotifyAlbumExternalUrl) && (
              <TouchableOpacity onPress={handleSpotifyPress} style={styles.playButton}>
                <FontAwesomeIcon icon={spotifyIcon} size={24} color={spotifyGreen} />
                <Text style={styles.playButtonText}>Play on Spotify</Text>
              </TouchableOpacity>
            )}
            {displayPost.scTrackId && (
              <TouchableOpacity onPress={handleSoundCloudPress} style={styles.playButton}>
                <FontAwesomeIcon icon={soundcloudIcon} size={24} color={soundcloudOrange} />
                <Text style={styles.playButtonText}>Play on SoundCloud</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView>
          <View style={styles.postContent}>
            {isRepost(post) && (
              <View style={styles.repostContainer}>
                <Text style={styles.repostIndicator}>
                  Reposted by {post.username}
                </Text>
                {post.body && <Text style={styles.repostBody}>{post.body}</Text>}
              </View>
            )}
            <TouchableOpacity>
              <Text style={styles.username}>{displayPost.username}</Text>
            </TouchableOpacity>
            <Text style={styles.bodyText}>{displayPost.body}</Text>

            <View style={styles.imageContainer}>
              <Image 
                source={getImageUrl(
                  displayPost.scTrackArtworkUrl || 
                  displayPost.spotifyAlbumImageUrl || 
                  displayPost.spotifyTrackImageUrl
                )} 
                style={styles.image} 
              />
            </View>

            <View style={styles.trackDetails}>
              {/* Update all references to 'post' with 'displayPost' */}
              {displayPost.scTrackId && (
                <>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{displayPost.scTrackTitle}</Text>
                  <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{displayPost.scTrackArtist}</Text>
                  {displayPost.scTrackCreatedAt && (
                    <Text style={styles.trackInfo}>
                      Created: {new Date(displayPost.scTrackCreatedAt).toLocaleDateString()}
                    </Text>
                  )}
                </>
              )}
              {displayPost.spotifyAlbumId && (
                <>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">Album: {displayPost.spotifyAlbumName}</Text>
                  <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{displayPost.spotifyAlbumArtists}</Text>
                  <Text style={styles.trackInfo}>Total Tracks: {displayPost.spotifyAlbumTotalTracks}</Text>
                  <Text style={styles.trackInfo}>Release Date: {formatDate(displayPost.spotifyAlbumReleaseDate)}</Text>
                </>
              )}
              {displayPost.spotifyTrackId && (
                <>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">Track: {displayPost.spotifyTrackName}</Text>
                  <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">{displayPost.spotifyTrackArtists}</Text>
                  <Text style={styles.trackInfo}>Release Date: {formatDate(displayPost.spotifyTrackReleaseDate)}</Text>
                  {displayPost.spotifyTrackDurationMs && (
                    <Text style={styles.trackInfo}>
                      {Math.floor(displayPost.spotifyTrackDurationMs / 60000)}m {((displayPost.spotifyTrackDurationMs % 60000) / 1000).toFixed(0).padStart(2, '0')}s
                    </Text>
                  )}
                  {displayPost.spotifyTrackExplicit && (
                    <View style={styles.explicitLabelContainer}>
                      <Text style={styles.explicitLabel}>Explicit</Text>
                    </View>
                  )}
                </>
              )}
              <Text style={styles.date}>{formatRelativeTime(displayPost.createdAt)}</Text>
            </View>

            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleLikePress(updatedPost.id)}>
                <FontAwesomeIcon
                  icon={(updatedPost.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                  size={24}
                  color={(updatedPost.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'}
                />
                {updatedPost.likesCount > 0 && (
                  <Text style={styles.actionText}>{updatedPost.likesCount}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handlePresentModalPress(post)}>
                <FontAwesomeIcon icon={commentIcon} size={24} color="#fff" />
                {(commentCounts[post.id] || 0) > 0 && (
                  <Text style={styles.actionText}>{commentCounts[post.id]}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesomeIcon icon={repostIcon} size={24} color="#fff" transform={{ rotate: 160 }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <CustomBottomSheet ref={bottomSheetRef} selectedPost={selectedPost} postId={post.id} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: dark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: gray,

  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerRightButtons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  playButtonText: {
    color: light,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
  },
  postContent: {
    padding: 20,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  bodyText: {
    color: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: 200,
  },
  trackDetails: {
    alignItems: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  artist: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  trackInfo: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 3,
  },
  date: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  backButton: {
    padding: 10,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  explicitLabelContainer: {
    backgroundColor: '#444',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
  },
  explicitLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  repostContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  repostIndicator: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  repostBody: {
    color: '#ccc',
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ProfilePostScreen;