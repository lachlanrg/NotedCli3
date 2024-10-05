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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { dark, light, gray, error, lgray, dgray, mediumgray } from '../../components/colorModes';
import { faHeart as faHeartSolid, faArrowsRotate, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons'
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { spotifyGreen, soundcloudOrange } from '../../components/colorModes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { mediumImpact } from '../../utils/hapticFeedback';

import { createSeenPost, updatePost, updateRepost, updateSeenPost } from '../../graphql/mutations';
import { listComments, listPosts, listFriendRequests, listSeenPosts } from '../../graphql/queries';
import { listRepostsWithOriginalPost } from '../../utils/customQueries';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { formatRelativeTime } from '../../components/formatComponents';
import CustomBottomSheet from '../../components/BottomSheets/CommentsBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { HomeStackParamList } from '../../components/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomePostBottomSheetModal from '../../components/BottomSheets/HomePostBottomSheetModal';
import { selectionChange } from '../../utils/hapticFeedback';
import { sendNotification } from '../../notifications/sendNotification';
import * as queries from '../../graphql/queries';
import { sendPostLikeNotification } from '../../notifications/sendPostLikeNotification';
import { LazyPost, LazyRepost, Post, Repost } from '../../models';
import { HomeScreenData } from '../../utils/homeScreenInitializer';
import { fetchPosts as fetchPostsUtil } from '../../utils/postFetcher';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalEventEmitter } from '../../utils/EventEmitter';

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
const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

const isWithinLastWeek = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date > oneWeekAgo;
};

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const { initialData } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [posts, setPosts] = useState<any[]>(initialData?.posts || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const client = generateClient();
  const [refreshing, setRefreshing] = useState(false);
  const showRefreshIcon = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const [likedPosts, setLikedPosts] = useState<{ postId: string, likeId: string }[]>([]);
  const [userInfo, setUserInfo] = useState<any>(initialData?.userInfo);
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});

  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const [following, setFollowing] = useState<string[]>(initialData?.following || []);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(initialData?.currentUserId ?? null);

  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [seenPostIds, setSeenPostIds] = useState<string[]>(initialData?.seenPostIds || []);

  const INITIAL_BATCH_SIZE = 5;
  const BATCH_SIZE = 5;

  useEffect(() => {
    if (posts.length > 0) {
      setDisplayedPosts(posts.slice(0, INITIAL_BATCH_SIZE));
    }
  }, [posts]);

  const loadMorePosts = () => {
    if (isLoadingMore || displayedPosts.length >= posts.length) return;

    setIsLoadingMore(true);
    const nextBatch = posts.slice(
      displayedPosts.length,
      displayedPosts.length + BATCH_SIZE
    );
    setDisplayedPosts(prevPosts => [...prevPosts, ...nextBatch]);
    setIsLoadingMore(false);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#888" />
      </View>
    );
  };

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

  const refreshPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const newPosts = await fetchPostsUtil(following, currentUserId, seenPostIds);
      setPosts(newPosts);
    } catch (error) {
      console.error('Error fetching posts and reposts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [following, currentUserId, seenPostIds]);

  async function markPostAsSeen(itemId: string, itemType: 'Post' | 'Repost') {
    try {
      const { userId } = await getCurrentUser();

      // Check if the post is already marked as seen in the local state
      if (seenPostIds.includes(itemId)) {
        return; // Exit if already seen
      }

      // Check if the post is already marked as seen in the database
      const existingEntryResponse = await client.graphql({
        query: listSeenPosts,
        variables: {
          filter: {
            itemId: { eq: itemId },
          },
        },
      });

      const existingEntries = existingEntryResponse.data.listSeenPosts.items;
      if (existingEntries.length > 0) {
        const existingEntry = existingEntries[0];
        if (existingEntry.userIds.includes(userId)) {
          return; // Exit if already seen by this user
        }

        // Update the existing entry with the new userId
        // console.log(`Updating SeenPost for itemId: ${itemId} with new userId: ${userId}`);
        await client.graphql({
          query: updateSeenPost, // Ensure you have this mutation defined
          variables: {
            input: {
              id: existingEntry.id,
              userIds: [...existingEntry.userIds, userId],
            },
          },
        });
      } else {
        // Create a new entry if none exists
        // console.log(`Creating new SeenPost for itemId: ${itemId} with userId: ${userId}`);
        await client.graphql({
          query: createSeenPost,
          variables: { 
            input: { 
              itemId: itemId,
              userIds: [userId],
              itemType: itemType, 
            } 
          },
        });
      }

      // Optimistically update the local state
      setSeenPostIds((prevSeenIds) => [...prevSeenIds, itemId]);

    } catch (error) {
      console.error("Error marking post/repost as seen:", error);
      // Revert the optimistic update if there's an error
      setSeenPostIds((prevSeenIds) => prevSeenIds.filter(id => id !== itemId));
    }
  }

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 99, // Adjusted threshold to 99%
    minimumViewTime: 1000, // 1 second minimum view time
  }).current;

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    const newlyVisibleItems = viewableItems.filter(
      (viewableItem) => !seenPostIds.includes(viewableItem.item.id)
    );

    newlyVisibleItems.forEach((viewableItem) => {
      const isRepost = 'originalPost' in viewableItem.item; 
      markPostAsSeen(viewableItem.item.id, isRepost ? 'Repost' : 'Post'); 
    });
  }).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshPosts();
  }, [refreshPosts]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.timing(showRefreshIcon, {
      toValue: event.nativeEvent.contentOffset.y <= -50 ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleItemPress = (item: any) => {
    setSelectedPost(item);
    mediumImpact();
    postBottomSheetRef.current?.present();
  };

  const handleLikePress = async (itemId: string, isRepost: boolean = false) => {
    selectionChange();
    try {
      const { userId, username } = await getCurrentUser();
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

      // Update UI immediately
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === itemId) {
          return {
            ...post,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount
          };
        }
        return post;
      }));

      // Update database
      let updatedItem;
      if (isRepost) {
        updatedItem = await client.graphql({
          query: updateRepost,
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
          query: updatePost,
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

      // Update posts state with the response from the server
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

      // Send notification asynchronously if the post was liked
      if (!isLiked) {
        const postUserId = isRepost ? itemToUpdate.userRepostsId : itemToUpdate.userPostsId;
        sendPostLikeNotification(itemId, postUserId, username || 'A user')
          .catch(error => console.error("Error sending like notification:", error));
      }

    } catch (error) {
      console.error("Error updating post:", error);
      // Revert UI changes if there was an error
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === itemId) {
          return posts.find(p => p.id === itemId) || post;
        }
        return post;
      }));
    }
  };

  const fetchFollowing = useCallback(async () => {
    if (userInfo?.userId) {
      try {
        const response = await client.graphql({
          query: listFriendRequests,
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
      refreshPosts();
    }
  }, [following]);

  const fetchCommentCounts = useCallback(async () => {
    try {
      const counts = await Promise.all(
        posts.map(async (post) => {
          const response = await client.graphql({
            query: listComments,
            variables: {
              filter: {
                postId: 'originalPost' in post ? undefined : { eq: post.id },
                repostId: 'originalPost' in post ? { eq: post.id } : undefined,
                _deleted: { ne: true }, // Add this line to exclude deleted comments
              },
            },
          });
          const nonDeletedComments = response.data.listComments.items.filter(
            (comment: any) => !comment._deleted
          );
          return [post.id, nonDeletedComments.length];
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

  useEffect(() => {
    const commentAddedListener = globalEventEmitter.on('commentAdded', (postId: string) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
    });

    const commentDeletedListener = globalEventEmitter.on('commentDeleted', (postId: string) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, commentCount: Math.max((post.commentCount || 0) - 1, 0) }
            : post
        )
      );
    });

    return () => {
      commentAddedListener();
      commentDeletedListener();
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

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
                <FontAwesomeIcon 
                  icon={isSoundCloud ? soundcloudIcon : spotifyIcon} 
                  size={21} 
                  color={isSoundCloud ? soundcloudOrange : spotifyGreen} 
                  style={styles.mediaTypeIcon}
                />
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
                  {`${postContent.spotifyAlbumTotalTracks} tracks • ${formatDate(postContent.spotifyAlbumReleaseDate)}`}
                </Text>
              )}
              {isSpotifyTrack && (
                <View>
                  <Text style={styles.mediaDetails}>
                    {`${formatDate(postContent.spotifyTrackReleaseDate)} • ${Math.floor(
                      postContent.spotifyTrackDurationMs / 60000)}m ${((postContent.spotifyTrackDurationMs % 60000) / 1000).toFixed(0).padStart(2, '0')}s`}
                  </Text>
                  {postContent.spotifyTrackExplicit && (
                    <View style={styles.explicitLabelContainer}>
                      <Text style={styles.explicitLabel}>Explicit</Text>
                    </View>
                  )}
                </View>
              )}
              {isSoundCloud && (
                <Text style={styles.mediaDetails}>
                  {`${formatDate(postContent.scTrackCreatedAt)}`}
                </Text>
              )}
            </View>
            {isWithinLastWeek(isSoundCloud ? postContent.scTrackCreatedAt :
                              isSpotifyAlbum ? postContent.spotifyAlbumReleaseDate :
                              postContent.spotifyTrackReleaseDate) && (
              <View style={[
                styles.newContainer,
                isSoundCloud && styles.newContainerSoundCloud
              ]}>
                <Text style={[
                  styles.newText,
                  isSoundCloud && styles.newTextSoundCloud
                ]}>New!</Text>
              </View>
            )}
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
          <TouchableOpacity activeOpacity={0.8} onPress={handlePostPress}>
            {renderPostContent()}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={handlePostPress}>
            {renderPostContent()}
          </TouchableOpacity>
        )}

        {isRepost && <View style={styles.bottomRepostSeparator} />}

        <View style={styles.postFooter}>
          <Text style={styles.timestamp}>
            {formatRelativeTime(isRepost ? item.createdAt : postContent.createdAt)}
          </Text>
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
              <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={displayedPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleViewableItemsChanged}
        />

        <CustomBottomSheet 
          ref={bottomSheetRef} 
          selectedPost={selectedPost} 
          postId={selectedPost?.id || ''}
        />
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
    // borderWidth: 0.5,
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
    backgroundColor: mediumgray,
    // backgroundColor: dark,
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
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'relative', // Add this to allow absolute positioning of the new label
  },
  mediaImage: {
    width: 125,
    height: 125,
    borderRadius: 4,
  },
  mediaInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  mediaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Add some space below the title container
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
    marginTop: 4,
    marginBottom: 8,
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
  newContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newContainerSoundCloud: {
    backgroundColor: `rgba(255, 85, 0, 0.1)`, // SoundCloud orange with opacity
  },
  newText: {
    color: spotifyGreen,
    fontSize: 12,
    fontWeight: 'bold',
  },
  newTextSoundCloud: {
    color: soundcloudOrange,
  },
  explicitLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  explicitLabelContainer: {
    backgroundColor: '#444',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default HomeScreen;