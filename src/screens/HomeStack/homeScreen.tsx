import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, RouteProp,  useFocusEffect, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { dark, light, gray, error, lgray, dgray } from '../../components/colorModes';
import { faEdit, faSync, faTimes, faPaperPlane, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { formatRelativeTime } from '../../components/formatComponents';
import { User } from '../../models';
import CustomBottomSheet from '../../components/BottomSheets/CommentsBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { fetchUsernameById } from '../../components/getUserUsername';
import { HomeStackParamList } from '../../components/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

Amplify.configure(awsconfig);

const commentIcon = faComment as IconProp;
const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();
  const [refreshing, setRefreshing] = useState(false);
  const showRefreshIcon = useRef(new Animated.Value(0)).current;
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const commentMenuHeight = useRef(new Animated.Value(0)).current;

  const [likedPosts, setLikedPosts] = useState<{ postId: string, likeId: string }[]>([]);
  const [userInfo, setUserId] = React.useState<any>(null);
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [postUsernames, setPostUsernames] = useState<{ [postId: string]: string | null }>({}); 

  const [following, setFollowing] = useState<string[]>([]);
  

  
  const fetchPostUsername = useCallback(async (postId: string) => {
    try {
      const username = await fetchUsernameById(postId);
      setPostUsernames(prevUsernames => ({ ...prevUsernames, [postId]: username }));
    } catch (error) {
      console.error('Error fetching username for postId', postId, error);
      setPostUsernames(prevUsernames => ({ ...prevUsernames, [postId]: null }));
    }
  }, []);
  useEffect(() => {
    const fetchUsernamesForPosts = async () => {
      const postIds = posts.map(post => post.userPostsId); 
      for (const postId of postIds) {
        await fetchPostUsername(postId);
      }
    };
    fetchUsernamesForPosts();
  }, [posts, fetchPostUsername]); 


  React.useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId  } = await getCurrentUser();
      console.log(`The User Id: ${userId}`);
  
      setUserId({ userId });
    } catch (err) {
      console.log(err);
    }
  }


  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch posts from followed users:
      const followingPostPromises = following.map(async (userId) => {
        const response = await client.graphql({
          query: queries.listPosts,
          variables: {
            filter: { 
              userPostsId: { eq: userId } 
            }
          },
        });
        return response.data.listPosts.items; 
      });
  
      // 2. Fetch posts from the current user:
      const currentUserPostPromise = client.graphql({
        query: queries.listPosts,
        variables: {
          filter: {
            userPostsId: { eq: userInfo?.userId } 
          }
        },
      }).then(response => response.data.listPosts.items);
  
      // 3. Wait for all requests:
      const allPosts = await Promise.all([
        ...followingPostPromises, 
        currentUserPostPromise
      ]);
  
      // 4. Combine, flatten, and sort:
      const flattenedPosts = allPosts.flat(); 
      const sortedPosts = flattenedPosts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPosts(sortedPosts);
  
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [following, userInfo?.userId]);
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.timing(showRefreshIcon, {
      toValue: event.nativeEvent.contentOffset.y <= -50 ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleTrackPress = (track: any) => {
    setSelectedTrack(track);
  };

  const closeTrackMenu = () => {
    setSelectedTrack(null);
  };

  const handleDetailsPress = () => {
    console.log('Details pressed for:', selectedTrack);
  };

  const handleListenPress = () => {
    if (selectedTrack) {
      const url = selectedTrack.scTrackPermalinkUrl
                  || selectedTrack.spotifyAlbumExternalUrl
                  || selectedTrack.spotifyTrackExternalUrl;

      if (url) {
        Linking.openURL(url);
        closeTrackMenu();
      } else {
        console.warn('No external URL found for selected track');
      }
    }
  };


  const handleLikePress = async (itemId: string) => {
    try {
      const { userId } = await getCurrentUser();
      const client = generateClient();
      
      if (!userInfo) {
        console.error("User not logged in!");
        return;
      }
        const postToUpdate = posts.find((post) => post.id === itemId);
      if (!postToUpdate) {
        console.error("Post not found!");
        return;
      }
        const isLiked = (postToUpdate.likedBy || []).includes(userInfo?.userId || "");
  
        let updatedLikedBy = Array.isArray(postToUpdate.likedBy)
        ? postToUpdate.likedBy 
        : []; // Start with an empty array if null or not an array
  
      if (!isLiked) {
        updatedLikedBy = [...updatedLikedBy, userId]; 
      } else {
        updatedLikedBy = updatedLikedBy.filter((id: string) => id !== userId);
      }
        const updatedLikesCount = updatedLikedBy.length;
        const updatedPost = await client.graphql({
          query: mutations.updatePost, 
          variables: {
            input: {
              id: itemId,
              likedBy: updatedLikedBy,
              likesCount: updatedLikesCount,
              _version: postToUpdate._version, // Important for optimistic locking 
            },
          },
        });
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === itemId ? updatedPost.data.updatePost : post 
      ));
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const fetchFollowing = useCallback(async () => {
    if (userInfo?.userId) {
      try {
        const response = await client.graphql({
          query: queries.listFriendRequests,
          variables: {
            filter: {
              userSentFriendRequestsId: { eq: userInfo.userId }, // Current user is the sender
              status: { eq: 'Following' }  // Make sure the request is approved/following
            },
          },
        });
  
        const friendRequests = response.data.listFriendRequests.items;
        const followingIds = friendRequests.map((request: any) => request.userReceivedFriendRequestsId);
  
        setFollowing(followingIds);
        console.log("Following IDs:", followingIds); // Check if you are getting the correct IDs
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    }
  }, [userInfo?.userId]);

  useEffect(() => {
    fetchFollowing(); // Call fetchFollowing when the component mounts
  }, [userInfo?.userId]);  // Run when userInfo?.userId changes

  useEffect(() => { 
    if (following.length > 0) { 
      fetchPosts();
    }
  }, [following]); 


  const fetchCommentCounts = useCallback(async () => {
    try {
      const counts = await Promise.all(
        posts.map(async (post) => {
          const response = await client.graphql({
            query: queries.listComments,
            variables: {
              filter: { postId: { eq: post.id } },
            },
          });
          return [post.id, response.data.listComments.items.length];
        })
      );
      setCommentCounts(Object.fromEntries(counts));
    } catch (error) {
      console.error('Error fetching comment counts:', error);
    }
  }, [posts]);

  useEffect(() => {
    fetchCommentCounts();
  }, [fetchCommentCounts]);


  const renderPostItem = ({ item }: { item: any }) => {
    const isSoundCloud = item.scTrackId;
    const isSpotifyAlbum = item.spotifyAlbumId;
    const isSpotifyTrack = item.spotifyTrackId;

    return (
      <View style={styles.postContainer}>
        <View style={styles.post}>
          <TouchableOpacity 
              onPress={() => navigation.navigate('HomeUserProfile', { userId: item.userPostsId })}
          >
            <Text style={styles.user}>{item.username}</Text>
          </TouchableOpacity>
          <Text style={styles.bodytext}>{item.body}</Text>

          {isSoundCloud && (
              <View style={styles.soundCloudPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.scTrackArtworkUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{item.scTrackTitle}</Text>
                </TouchableOpacity>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
                  <View style={styles.commentLikeSection}>
                    <TouchableOpacity 
                      style={styles.likeIcon}
                      onPress={() => handleLikePress(item.id)} 
                    >
                      <FontAwesomeIcon
                        icon={(item.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                        size={20}
                        color={(item.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.likesCountText}>
                      {item.likesCount || ''} 
                    </Text>
                    <TouchableOpacity style={styles.commentIcon} onPress={() => handlePresentModalPress(item)}>
                      <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.commentCountText}>
                        {commentCounts[item.id] || null}
                    </Text>
                  </View>
              </View>
          )}

          {isSpotifyAlbum && (
              <View style={styles.spotifyPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.spotifyAlbumImageUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">Album: {item.spotifyAlbumName}</Text>
                </TouchableOpacity>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                  {item.spotifyAlbumArtists}
                </Text>
                <Text style={styles.date}>Total Tracks: {item.spotifyAlbumTotalTracks}</Text>
                <Text style={styles.date}>Release Date: {item.spotifyAlbumReleaseDate}</Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
                  <View style={styles.commentLikeSection}>
                    <TouchableOpacity 
                      style={styles.likeIcon}
                      onPress={() => handleLikePress(item.id)} 
                    >
                      <FontAwesomeIcon
                        icon={(item.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                        size={20}
                        color={(item.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'} 
                      />
                    </TouchableOpacity>
                      <Text style={styles.likesCountText}>
                        {item.likesCount || ''} 
                      </Text>
                      <TouchableOpacity style={styles.commentIcon} onPress={() => handlePresentModalPress(item)}>
                        <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                      </TouchableOpacity>
                      <Text style={styles.commentCountText}>
                        {commentCounts[item.id] || null}
                      </Text>
                  </View>
              </View>
          )}

          {isSpotifyTrack && (
              <View style={styles.spotifyPost}>
                <View style={styles.main}>
                  <Image
                    source={{ uri: item.spotifyTrackImageUrl }}
                    style={styles.image}
                  />
                </View>
                <TouchableOpacity onPress={() => handleTrackPress(item)}>
                  <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">Track: {item.spotifyTrackName}</Text>
                </TouchableOpacity>
                <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                  {item.spotifyTrackArtists}
                </Text>
                <Text style={styles.date}>{formatRelativeTime(item.createdAt)}</Text>
                  <View style={styles.commentLikeSection}>
                    <TouchableOpacity 
                      style={styles.likeIcon}
                      onPress={() => handleLikePress(item.id)} 
                    >
                      <FontAwesomeIcon
                        icon={(item.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                        size={20}
                        color={(item.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.likesCountText}>
                      {item.likesCount || ''} 
                    </Text>
                    <TouchableOpacity style={styles.commentIcon} onPress={() => handlePresentModalPress(item)}>
                      <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.commentCountText}>
                        {commentCounts[item.id] || null}
                      </Text>
                  </View>
              </View>
          )}
        </View>
      </View>
    );
  };

  const handleTopPress = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();

  const handlePresentModalPress = (post: any) => { 
    setSelectedPost(post);
    bottomSheetRef.current?.present();
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
    <View style={styles.container}>
      <TouchableOpacity style={styles.topButton} onPress={handleTopPress}>
        <View style={styles.topButtonArea} />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesomeIcon icon={faEdit} size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton}>
          <FontAwesomeIcon icon={faSync} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* <Animated.View
        style={[
          styles.refreshIconContainer,
          {
            opacity: showRefreshIcon,
            transform: [
              {
                translateY: showRefreshIcon.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ActivityIndicator size="small" color="#fff" />
      </Animated.View> */}

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        // ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <Animated.View 
          style={[
            styles.commentMenuContainer,
            { height: commentMenuHeight }
          ]}
        >
          {selectedPostId && (
            <View style={styles.commentMenu}>
              <Text>Comments for Post ID: {selectedPostId}</Text>
              {/* Here you will add the comment list and input later */}
            </View>
          )}
        </Animated.View>

        <CustomBottomSheet ref={bottomSheetRef} selectedPost={selectedPost}/>

      {selectedTrack && (
        <View style={styles.trackMenu}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeTrackMenu}
          >
            <FontAwesomeIcon icon={faTimes} size={20} color={dark} />
          </TouchableOpacity>

          <Text style={styles.trackMenuText} numberOfLines={1} ellipsizeMode="tail">
            {selectedTrack.scTrackTitle ||
              selectedTrack.spotifyAlbumName ||
              selectedTrack.spotifyTrackName}
          </Text>

          <View style={styles.menuButtonContainer}>
          <TouchableOpacity style={styles.menuDetailsButton} onPress={handleDetailsPress}>
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuListenButton, {
                borderColor: selectedTrack.scTrackId ? 'orange' : 'green'
              }]}
              onPress={handleListenPress}
            >
              <Text style={styles.buttonText}>
                {selectedTrack.scTrackId ? 'SoundCloud' : 'Spotify'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    // paddingTop: 20,
  },
  topButton: {
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    left: '36%',
    height: 50,
    width: 100,
    zIndex: 1,
    borderColor: 'white',
    // borderWidth: 0.5,
  },
  topButtonArea: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  button: {
    padding: 10,
    marginRight: 10,
  },
  refreshButton: {
    padding: 10,
  },
  postContainer: {
    margin: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  post: {
    padding: 15,
  },
  main: {
    flex: 1,
  },
  user: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bodytext: {
    color: '#ccc',
    marginBottom: 10,
  },
  soundCloudPost: {},
  spotifyPost: {},
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#ccc',
    fontSize: 14,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#333',
    marginVertical: 10,
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  trackMenu: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: light,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 3,
    color: dark,
  },
  trackMenuText: {
    color: dark,
    marginBottom: 15,
    textAlign: 'center',
    width: '80%',
  },
  menuButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
  },
  menuDetailsButton: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: lgray,
  },
  menuListenButton: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonText: {
    color: dark,
    fontWeight: 'bold',
  },
  commentLikeSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentIcon: {
    marginLeft: 20,
  },
  likeIcon: {
    marginLeft: 2,
  },
  likesCountText: {
    color: '#fff', // Set your desired color
    fontSize: 16,  // Set your desired font size
    marginLeft: 8,  // Add spacing between icon and count
  },
  commentCountText: {
    color: '#fff', // Set your desired color
    fontSize: 16,  // Set your desired font size
    marginLeft: 8,  // Add spacing between icon and count
  },
  commentMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    borderRadius: 18,
  },
  commentMenu: {
    flex: 1,
    padding: 10,
  },
  bottomSheetContent: { 
    padding: 20,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default HomeScreen;

