// HomeScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { dark, light, gray, error, lgray, dgray } from '../../components/colorModes';
import { faEdit, faSync, faTimes, faPaperPlane, faHeart as faHeartSolid, faArrowsRotate, faCompactDisc, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { formatRelativeTime } from '../../components/formatComponents';
import CustomBottomSheet from '../../components/BottomSheets/CommentsBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { HomeStackParamList } from '../../components/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomePostBottomSheetModal from '../../components/BottomSheets/HomePostBottomSheetModal';
import { listRepostsWithOriginalPost } from '../../utils/customQueries';
import { selectionChange } from '../../utils/hapticFeedback';


Amplify.configure(awsconfig);

type UpdatePostMutation = {
  updatePost: {
    id: string;
    likedBy: string[];
    likesCount: number;
    _version: number;
  };
};

type UpdateRepostMutation = {
  updateRepost: {
    id: string;
    likedBy: string[];
    likesCount: number;
    _version: number;
  };
};

const commentIcon = faComment as IconProp;
const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;
const repostIcon = faArrowsRotate as IconProp;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = generateClient();
  const [refreshing, setRefreshing] = useState(false);
  const showRefreshIcon = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const [likedPosts, setLikedPosts] = useState<{ postId: string, likeId: string }[]>([]);
  const [userInfo, setUserId] = React.useState<any>(null);
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const [following, setFollowing] = useState<string[]>([]);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  // const { spotifyUser } = useSpotify();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const scaleAnim = useRef(new Animated.Value(1)).current;


  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    currentAuthenticatedUser();
    fetchCurrentUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      setUserId({ userId });
    } catch (err) {
      console.log(err);
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const { userId } = await getCurrentUser();
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch posts from followed users:
      const followingPostPromises = following.map(async (userId) => {
        const response = await client.graphql({
          query: queries.listPosts,
          variables: {
            filter: {
              userPostsId: { eq: userId },
            },
          },
        });
        return response.data.listPosts.items;
      });

      // 2. Fetch posts from the current user:
      const currentUserPostPromise = client.graphql({
        query: queries.listPosts,
        variables: {
          filter: {
            userPostsId: { eq: userInfo?.userId },
          },
        },
      }).then(response => response.data.listPosts.items);

      // 3. Fetch reposts from followed users
      const followingRepostPromises = following.map(async (userId) => {
        const response = await client.graphql({
          query: listRepostsWithOriginalPost, // Use the custom query here
          variables: {
            filter: {
              userRepostsId: { eq: userId },
            },
          },
        });
        return response.data.listReposts.items;
      });

      // 4. Fetch reposts from the current user:
      const currentUserRepostPromise = client.graphql({
        query: listRepostsWithOriginalPost, // Use the custom query here
        variables: {
          filter: {
            userRepostsId: { eq: userInfo?.userId },
          },
        },
      }).then(response => response.data.listReposts.items);

      // 5. Wait for all post and repost requests:
      const [
        allPosts,
        ...allReposts
      ] = await Promise.all([
        ...followingPostPromises,
        currentUserPostPromise,
        ...followingRepostPromises,
        currentUserRepostPromise,
      ]);

      // 6. Combine, flatten, and sort:
      const flattenedPosts = allPosts.flat();
      const flattenedReposts = allReposts.flat();

      // // 7. Filter out deleted posts and reposts after fetching
      const filteredPosts = flattenedPosts.filter(post => !post._deleted);
      const filteredReposts = flattenedReposts.filter(repost => !repost._deleted);

      // 8. Combine posts and reposts
      const allContent = [...filteredPosts, ...filteredReposts];

      // 9. Sort by createdAt
      const sortedContent = allContent.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPosts(sortedContent);

    } catch (error) {
      console.error('Error fetching posts and reposts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [following, userInfo?.userId]);

  // useEffect(() => {
  //   fetchPosts();
  // }, [fetchPosts]);

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

  const handleItemPress = (item: any) => {
    setSelectedPost(item);
    postBottomSheetRef.current?.present();
  };

  const handleLikePress = async (itemId: string, isRepost: boolean = false) => {
    selectionChange();
    try {
      const { userId } = await getCurrentUser();
      const client = generateClient();
  
      if (!userInfo) {
        console.error("User not logged in!");
        return;
      }
  
      const itemToUpdate = posts.find((post) => post.id === itemId);
      if (!itemToUpdate) {
        console.error("Post not found!");
        return;
      }
  
      const isLiked = (itemToUpdate.likedBy || []).includes(userInfo?.userId || "");
  
      let updatedLikedBy = Array.isArray(itemToUpdate.likedBy)
        ? itemToUpdate.likedBy
        : []; 
  
      if (!isLiked) {
        updatedLikedBy = [...updatedLikedBy, userId];
      } else {
        updatedLikedBy = updatedLikedBy.filter((id: string) => id !== userId);
      }
      const updatedLikesCount = updatedLikedBy.length;
  
      let updatedItem;
      if (isRepost) {
        updatedItem = await client.graphql({
          query: mutations.updateRepost,
          variables: {
            input: {
              id: itemId,
              likedBy: updatedLikedBy,
              likesCount: updatedLikesCount,
              _version: itemToUpdate._version, 
            },
          },
        });
      } else {
        updatedItem = await client.graphql({
          query: mutations.updatePost,
          variables: {
            input: {
              id: itemId,
              likedBy: updatedLikedBy,
              likesCount: updatedLikesCount,
              _version: itemToUpdate._version, 
            },
          },
        });
      }
  
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === itemId) {
          if ('updatePost' in updatedItem.data) {
            return updatedItem.data.updatePost;
          } else if ('updateRepost' in updatedItem.data) {
            return updatedItem.data.updateRepost;
          }
        }
        return post;
      }));
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
              userSentFriendRequestsId: { eq: userInfo.userId },
              status: { eq: 'Following' } 
            },
          },
        });

        const friendRequests = response.data.listFriendRequests.items;
        const followingIds = friendRequests.map((request: any) => request.userReceivedFriendRequestsId);

        setFollowing(followingIds);
        // console.log("Following IDs:", followingIds);
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    }
  }, [userInfo?.userId]);

  useEffect(() => {
    fetchFollowing(); 
  }, [userInfo?.userId]); 

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
              filter: {
                postId: 'originalPost' in post ? undefined : { eq: post.id },
                repostId: 'originalPost' in post ? { eq: post.id } : undefined,
              },
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
    const isRepost = 'originalPost' in item;
    const postContent = isRepost ? item.originalPost : item;
    const isSoundCloud = postContent.scTrackId;
    const isSpotifyAlbum = postContent.spotifyAlbumId;
    const isSpotifyTrack = postContent.spotifyTrackId;

    const handleUsernamePress = (userId: string) => {
      if (userId === currentUserId) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('HomeUserProfile', { userId });
      }
    };

    const handlePostPress = () => {
      if (isRepost) {
        navigation.navigate('RepostOriginalPost', { post: postContent });
      } else {
        handleItemPress(postContent);
      }
    };

    const renderPostContent = () => (
      <View style={[styles.postContent, isRepost && styles.indentedContent]}>
        {isRepost && (
          <TouchableOpacity onPress={() => handleUsernamePress(postContent.userPostsId)}>
            <Text style={styles.originalPostUsername}>{postContent.username}</Text>
          </TouchableOpacity>
        )}
        {postContent.body && (
          <View>
            <Text 
              style={styles.bodyText} 
              numberOfLines={expandedPosts.has(postContent.id) ? undefined : 2}
            >
              {postContent.body}
            </Text>
            {postContent.body.length > 110 && (
              <TouchableOpacity
                onPress={() => {
                  selectionChange();
                  togglePostExpansion(postContent.id);
                }}
                style={styles.seeMoreButton}
                activeOpacity={0.5}
              >
                <Text style={styles.seeMoreText}>
                  {expandedPosts.has(postContent.id) ? 'See less' : 'See more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {(isSoundCloud || isSpotifyAlbum || isSpotifyTrack) && (
          <View style={styles.mediaContainer}>
            <Image
              source={{ 
                uri: isSoundCloud 
                  ? postContent.scTrackArtworkUrl.replace('-large', '-t500x500') 
                  : postContent.spotifyAlbumImageUrl || postContent.spotifyTrackImageUrl 
              }}
              style={styles.mediaImage}
            />
            <View style={styles.mediaInfo}>
              <View style={styles.mediaTitleContainer}>
                {(isSpotifyAlbum || isSpotifyTrack) && (
                  <FontAwesomeIcon 
                    icon={isSpotifyAlbum ? faCompactDisc : faMusic} 
                    size={16} 
                    color="#1DB954" 
                    style={styles.mediaTypeIcon}
                  />
                )}
                <Text style={styles.mediaTitle} numberOfLines={1} ellipsizeMode="tail">
                  {isSoundCloud ? postContent.scTrackTitle :
                   isSpotifyAlbum ? postContent.spotifyAlbumName :
                   postContent.spotifyTrackName}
                </Text>
              </View>
              <Text style={styles.mediaArtist} numberOfLines={1} ellipsizeMode="tail">
                {isSoundCloud ? postContent.scTrackArtist :
                 isSpotifyAlbum ? postContent.spotifyAlbumArtists :
                 postContent.spotifyTrackArtists}
              </Text>
              {isSpotifyAlbum && (
                <Text style={styles.mediaDetails}>
                  {`${postContent.spotifyAlbumTotalTracks} tracks • ${postContent.spotifyAlbumReleaseDate}`}
                </Text>
              )}
              {isSpotifyTrack && (
                <Text style={styles.mediaDetails}>
                  {`${postContent.spotifyTrackReleaseDate} • ${Math.floor(
                    postContent.spotifyTrackDurationMs / 60000)}m ${((postContent.spotifyTrackDurationMs % 60000) / 1000).toFixed(0).padStart(2, '0')}s`}
                </Text>
              )}
            </View>
          </View>
        )}

        {isRepost && (
          <Text style={styles.originalPostDate}>{formatRelativeTime(postContent.createdAt)}</Text>
        )}
      </View>
    );

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <TouchableOpacity onPress={() => handleUsernamePress(isRepost ? item.userRepostsId : item.userPostsId)}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
          {isRepost && (
            <View style={styles.repostIndicator}>
              <FontAwesomeIcon icon={repostIcon} size={14} color="#888" />
              <Text style={styles.repostText}>Reposted</Text>
            </View>
          )}
        </View>

        {isRepost && (
          <>
            <Text style={styles.repostBody}>{item.body}</Text>
            <View style={styles.repostSeparator} />
          </>
        )}

        {isRepost ? (
          <TouchableOpacity activeOpacity={0.8}onPress={handlePostPress}>
            {renderPostContent()}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={handlePostPress}>
            {renderPostContent()}
          </TouchableOpacity>
        )}

        {isRepost && <View style={styles.bottomRepostSeparator} />}

        <View style={styles.postFooter}>
          <Text style={styles.timestamp}>{formatRelativeTime(postContent.createdAt)}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLikePress(item.id, isRepost)}>
              <FontAwesomeIcon
                icon={(item.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                size={18}
                color={(item.likedBy || []).includes(userInfo?.userId) ? 'red' : '#888'}
              />
              <Text style={styles.actionText}>{item.likesCount || ''}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handlePresentModalPress(item)}>
              <FontAwesomeIcon icon={commentIcon} size={18} color="#888" />
              <Text style={styles.actionText}>{commentCounts[item.id] || ''}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PostRepost', { post: postContent })}>
              <FontAwesomeIcon icon={repostIcon} size={18} color="#888" transform={{ rotate: 160 }} />
            </TouchableOpacity>
          </View>
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
        <View style={styles.headerContainer}>
          <Text style={styles.title}>SoundCred</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <FontAwesomeIcon icon={faEdit} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton}>
              <FontAwesomeIcon icon={faSync} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          // ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />

        <CustomBottomSheet ref={bottomSheetRef} selectedPost={selectedPost} />
        <HomePostBottomSheetModal ref={postBottomSheetRef} item={selectedPost} />

      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  },
  topButtonArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    paddingBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  button: {
    padding: 10,
  },
  refreshButton: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  repostIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repostText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  repostBody: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
  },
  repostSeparator: {
    height: 1,
    backgroundColor: '#333',
    // marginVertical: 8,
    marginTop: 0,
    marginBottom: 8
  },
  bottomRepostSeparator: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 2,
  },
  postContent: {
    marginBottom: 12,
  },
  bodyText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  seeMoreButton: {
    marginTop: 4,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  seeMoreText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    // borderRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'relative', // Add this to allow absolute positioning of the icon
  },
  mediaImage: {
    width: 120,
    height: 120,
  },
  mediaInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  mediaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaTypeIcon: {
    marginRight: 6,
  },
  mediaTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  mediaArtist: {
    color: '#ccc',
    fontSize: 12,
    // marginTop: 2,
  },
  mediaDetails: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
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
  repostIcon: {
    marginLeft: 20,
  },
  likeIcon: {
    marginLeft: 2,
  },
  likesCountText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  commentCountText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
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
    backgroundColor: dark,
  },
  // repostText: {
  //   color: '#ccc',
  //   marginBottom: 5,
  //   fontStyle: 'italic',
  // },
  repostedPostContainer: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  originalPostUsername: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  RepostCommentLikeSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  repostDate: {
    color: '#888',
    fontSize: 12,
  },
  spotifyText: {
    color: 'white',
    fontSize: 16,
  },
  spotifySection: {
    padding: 10,
    backgroundColor: dark,
    borderRadius: 5,
    marginTop: 10,
  },
  indentedContent: {
    marginLeft: 16, // Adjust this value to increase or decrease the indentation
  },
  originalPostDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

export default HomeScreen;
