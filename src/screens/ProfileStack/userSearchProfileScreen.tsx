import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, light, lgray, dgray, gray, placeholder, error } from '../../components/colorModes';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ProfileStackParamList } from '../../components/types';

import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';

import { createFriendRequest, updateFriendRequest } from '../../graphql/mutations'; // Import updateFriendRequest mutation

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';

import { SpotifyRecentlyPlayedTrack } from '../../API'; // Update the import path as needed

import { formatRelativeTime } from '../../components/formatComponents';
import UserPostList from '../../components/userPostsList';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import UserSearchPostBottomSheetModal from '../../components/BottomSheets/UserSearchPostBottomSheetModal';
import { formatNumber } from '../../utils/numberFormatter'; // Import the formatNumber function
import LiveWaveform from '../../components/LiveWaveform';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import RPBottomSheetModal from '../../components/BottomSheets/RPBottomSheetModal';
import { mediumImpact } from '../../utils/hapticFeedback';
import { faLink } from '@fortawesome/free-solid-svg-icons'; // Add this import
import UserSearchLinkBottomSheetModal from '../../components/BottomSheets/UserSearchLinkBottomSheetModal';


const spotifyIcon = faSpotify as IconProp;

Amplify.configure(awsconfig);

type UserSearchProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'UserSearchProfile'>;

const UserSearchProfileScreen: React.FC<UserSearchProfileScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = React.useState<any>(null);

  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [friendRequestStatus, setFriendRequestStatus] = useState<'Follow' | 'Requested' | 'Following'>('Follow');
  const [existingFriendRequest, setExistingFriendRequest] = useState<any | null>(null); // State to store existing friend request
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'unfollow' | null>(null); // State to store the type of modal
  const [recentlyPlayedTrack, setRecentlyPlayedTrack] = useState<SpotifyRecentlyPlayedTrack | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  
  const rpBottomSheetRef = useRef<BottomSheetModal>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [recentlyPlayedDisabled, setRecentlyPlayedDisabled] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [userFetched, setUserFetched] = useState(false);

  const linkBottomSheetRef = useRef<BottomSheetModal>(null);



  const client = generateClient();

  useEffect(() => {
    currentAuthenticatedUser();
    
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId } = await getCurrentUser();
      // console.log('___________________________________')
      // console.log(`Current Authenticated User Info:`);
      // console.log(`The Username: ${username}`);
      // console.log(`The userId: ${userId}`);
      // console.log('___________________________________')
      setCurrentAuthUserInfo({ username, userId });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await client.graphql({
          query: queries.getUser,
          variables: { id: userId },
        });
  
        // Check if getUser exists in the response:
        if (response.data && response.data.getUser) { 
          const fetchedUser = response.data.getUser;
          setUser(fetchedUser);
          setUserFetched(true);
  
          // Fetch following and followers counts
          const followingResponse = await client.graphql({
            query: queries.listFriendRequests,
            variables: {
              filter: {
                userSentFriendRequestsId: { eq: userId },
                status: { eq: 'Following' },
              },
            },
          });
          setFollowingCount(followingResponse.data.listFriendRequests.items.length);

          const followersResponse = await client.graphql({
            query: queries.listFriendRequests,
            variables: {
              filter: {
                userReceivedFriendRequestsId: { eq: userId },
                status: { eq: 'Following' },
              },
            },
          });
          setFollowersCount(followersResponse.data.listFriendRequests.items.length);

          // Fetch posts count
          const postsResponse = await client.graphql({
            query: queries.listPosts,
            variables: {
              filter: {
                userPostsId: { eq: userId },
              },
            },
          });
          const posts = postsResponse.data.listPosts.items.filter(post => !post._deleted);
          setPostsCount(posts.length);

          // Fetch the recently played track and recentlyPlayedDisabled status
          const recentlyPlayedResponse = await client.graphql({
            query: queries.listSpotifyRecentlyPlayedTracks,
            variables: { 
              filter: { 
                userSpotifyRecentlyPlayedTrackId: { eq: userId } 
              } 
            },
          });

          const recentlyPlayedItems = recentlyPlayedResponse.data.listSpotifyRecentlyPlayedTracks.items;
          if (recentlyPlayedItems && recentlyPlayedItems.length > 0) {
            const mostRecentTrack = recentlyPlayedItems.reduce((latest, current) => {
              return new Date(current._lastChangedAt) > new Date(latest._lastChangedAt) ? current : latest;
            });
            setRecentlyPlayedTrack(mostRecentTrack as any);
          }

          // Fetch recentlyPlayedDisabled status
          const recentlyPlayedDisabledResponse = await client.graphql({
            query: queries.getUser,
            variables: { id: userId },
          });

          const recentlyPlayedDisabled = recentlyPlayedDisabledResponse.data.getUser?.recentlyPlayedDisabled ?? false;
          setRecentlyPlayedDisabled(recentlyPlayedDisabled);
          
          // Now it's safe to use fetchedUser.publicProfile:
          if (fetchedUser.publicProfile || friendRequestStatus === 'Following') {
            const postsResponse = await client.graphql({
              query: queries.listPosts,
              variables: {
                filter: {
                  userPostsId: { eq: userId },
                },
              },
            });
            setPosts(postsResponse.data.listPosts.items);
          } 
        } else {
          // Handle the case where getUser is not found (e.g., user doesn't exist)
          console.error('User not found');
          // You might want to display an error message to the user or navigate back
        }
  
      } catch (error) {
        console.error('Error fetching user or posts:', error);
        // Handle other potential errors (network issues, etc.)
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, [userId, friendRequestStatus, recentlyPlayedDisabled]);

  // Check for existing friend request
  useEffect(() => {
    const checkExistingFriendRequest = async () => {
      if (currentAuthUserInfo && user) {
        try {
          const response = await client.graphql({
            query: queries.listFriendRequests,
            variables: {
              filter: {
                userSentFriendRequestsId: { eq: currentAuthUserInfo.userId },
                userReceivedFriendRequestsId: { eq: user.id },
              }
            }
          });
  
          if (response.data.listFriendRequests.items.length > 0) {
            const friendRequest = response.data.listFriendRequests.items[0];
            setExistingFriendRequest(friendRequest);
            // Update friendRequestStatus based on the actual status from the database
            if (friendRequest.status === 'Pending') {
              setFriendRequestStatus('Requested');
            } else if (friendRequest.status === 'Following') {
              setFriendRequestStatus('Following');
            } else if (friendRequest.status === 'Cancelled') { // Handle Cancelled status
              setFriendRequestStatus('Follow'); 
            } 
            // console.log('Existing Friend Request:', friendRequest);
          } else {
            setExistingFriendRequest(null);
            setFriendRequestStatus('Follow');
            // console.log('No existing friend requests sent')
          }
        } catch (error) {
          console.error('Error checking existing friend request:', error);
        }
      }
    };
  
    if (currentAuthUserInfo && user) {
      checkExistingFriendRequest();
    }
  }, [currentAuthUserInfo, user]);

  if (isLoading || !userFetched) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleFollowRequest = async () => {
    try {
      if (user.publicProfile && existingFriendRequest) {
        // Public profile and existing request: update to "Following"
        const response = await client.graphql({
          query: mutations.updateFriendRequest,
          variables: {
            input: {
              id: existingFriendRequest.id,
              status: 'Following', // Directly set to "Following"
              _version: existingFriendRequest._version,
            },
          },
        });
  
        if (response.data.updateFriendRequest) {
          console.log('Automatically followed successfully!');
          setFriendRequestStatus('Following');
          setExistingFriendRequest(response.data.updateFriendRequest);
        } else {
          console.error('Failed to follow:', response.errors);
        }
      } else if (user.publicProfile && !existingFriendRequest) { 
        // Public profile and no existing request: create a "Following" relationship
        try {
          const response = await client.graphql({
            query: mutations.createFriendRequest,
            variables: {
              input: {
                userSentFriendRequestsId: currentAuthUserInfo.userId,
                userReceivedFriendRequestsId: user.id,
                status: 'Following',
              },
            },
          });
  
          if (response.data.createFriendRequest) {
            console.log('Automatically followed successfully!');
            setFriendRequestStatus('Following');
            setExistingFriendRequest(response.data.createFriendRequest);
          } else {
            console.error('Failed to follow:', response.errors);
          }
        } catch (error) {
          console.error('Error sending follow request:', error);
        }
      } else if (!user.publicProfile) {
        // Private profile: handle as a normal friend request
        if (existingFriendRequest) {
          // Existing request: update to "Pending"
          const response = await client.graphql({
            query: mutations.updateFriendRequest,
            variables: {
              input: {
                id: existingFriendRequest.id,
                status: 'Pending',
                _version: existingFriendRequest._version,
              },
              condition: {
                status: { eq: 'Cancelled' },
              },
            },
          });
  
          if (response.data.updateFriendRequest) {
            console.log('Friend Request sent successfully!', response.data.updateFriendRequest);
            setFriendRequestStatus('Requested');
            setExistingFriendRequest(response.data.updateFriendRequest);
          } else {
            console.error('Failed to send friend request:', response.errors);
          }
        } else {
          // No existing request: create a new one
          const response = await client.graphql({
            query: mutations.createFriendRequest,
            variables: {
              input: {
                userSentFriendRequestsId: currentAuthUserInfo.userId,
                userReceivedFriendRequestsId: user.id,
                status: 'Pending',
              },
            },
          });
  
          if (response.data.createFriendRequest) {
            console.log('Friend Request created successfully!', response.data.createFriendRequest);
            setFriendRequestStatus('Requested');
            setExistingFriendRequest(response.data.createFriendRequest);
          } else {
            console.error('Failed to create friend request:', response.errors);
          }
        }
      } 
    } catch (error) {
      console.error('Error handling follow request:', error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (existingFriendRequest) {
        const response = await client.graphql({
          query: mutations.updateFriendRequest,
          variables: {
            input: {
              id: existingFriendRequest.id,
              status: 'Cancelled',
              _version: existingFriendRequest._version,
            },
            condition: {
              status: { eq: 'Pending' }
            }
          }
        });
  
        if (response.data.updateFriendRequest) {
          console.log('Friend Request cancelled successfully!', response.data.updateFriendRequest);
          setFriendRequestStatus('Follow'); 
          setExistingFriendRequest(response.data.updateFriendRequest);
          setIsModalVisible(false); // Close the modal when the "Cancel" button is pressed
        } else {
          console.error('Failed to cancel friend request:', response.errors);
        }
      }
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      // Display an error message to the user
    }
  };
  

  const handleUnfollow = async () => {
    try {
      if (existingFriendRequest) {
        const response = await client.graphql({
          query: mutations.updateFriendRequest,
          variables: {
            input: {
              id: existingFriendRequest.id,
              status: 'Cancelled',
              _version: existingFriendRequest._version,
            },
            condition: {
              status: { eq: 'Following' }
            }
          }
        });
  
        if (response.data.updateFriendRequest) {
          console.log('Unfollowed successfully!', response.data.updateFriendRequest);
          setFriendRequestStatus('Follow'); 
          setExistingFriendRequest(response.data.updateFriendRequest);
          setIsModalVisible(false); // Close the modal when the "Cancel" button is pressed
        } else {
          console.error('Failed to unfollow:', response.errors);
        }
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
      // Display an error message to the user
    }
  };
  

  const handleModalClose = () => {
    setIsModalVisible(false); 
    setModalType(null); // Reset modal type
  };

  const handleButtonPress = () => {
    if (friendRequestStatus === 'Follow') {
      handleFollowRequest();
    } else if (friendRequestStatus === 'Requested') {
      setModalType('cancel');
      setIsModalVisible(true);
    } else if (friendRequestStatus === 'Following') {
      setModalType('unfollow');
      setIsModalVisible(true);
    }
  };

  const handlePresentPostModalPress = (post: any) => {
    setSelectedPost(post);
    postBottomSheetRef.current?.present();
  };

  const canViewFollowList = user?.publicProfile || friendRequestStatus === 'Following';

  const handleFollowListNavigation = (initialTab: 'following' | 'followers') => {
    if (canViewFollowList) {
      navigation.navigate('FollowList', { userId: userId, initialTab });
    }
  };

  const getButtonStyle = () => {
    switch (friendRequestStatus) {
      case 'Following':
        return styles.followingButton;
      case 'Requested':
        return styles.requestedButton;
      default:
        return styles.followButton;
    }
  };

  const getButtonTextStyle = () => {
    return friendRequestStatus === 'Following' ? styles.followingButtonText : styles.followButtonText;
  };

  const handleLongPress = () => {
    mediumImpact()

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  
    rpBottomSheetRef.current?.present();
  };

  const handleLinkPress = () => {
    linkBottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
          </TouchableOpacity>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{user.username}</Text>
            <TouchableOpacity onPress={handleLinkPress} style={styles.linkButton}>
            <FontAwesomeIcon icon={faLink} size={24} color={light} />
          </TouchableOpacity>
          </View>
         
        </View>

        <ScrollView>
          <View style={styles.profileContainer}>
            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={[styles.statItem, !canViewFollowList && styles.disabledStatItem]}
                onPress={() => handleFollowListNavigation('following')}
                disabled={!canViewFollowList}
              >
                <Text style={styles.statNumber}>{formatNumber(followingCount)}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statItem, !canViewFollowList && styles.disabledStatItem]}
                onPress={() => handleFollowListNavigation('followers')}
                disabled={!canViewFollowList}
              >
                <Text style={styles.statNumber}>{formatNumber(followersCount)}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatNumber(postsCount)}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>
            <View style={styles.followRequestContainer}>
              <TouchableOpacity 
                onPress={handleButtonPress} 
                style={[styles.followButtonBase, getButtonStyle()]}
              >
                <Text style={getButtonTextStyle()}>{friendRequestStatus}</Text>
              </TouchableOpacity>
            </View>

            {/* Spotify Recently Played - renders if there is a recentlyPlayedTarack available, user hasnt disabled, or following/public account*/}
             {!isLoading && recentlyPlayedTrack && !recentlyPlayedDisabled && (friendRequestStatus === 'Following' || user.publicProfile) && ( 
                <GestureHandlerRootView>
                    <LongPressGestureHandler
                      onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) {
                          handleLongPress();
                        }
                      }}
                      minDurationMs={800}
                    >
                      <Animated.View
                        style={[
                          styles.recentlyPlayedBox,
                          { transform: [{ scale: scaleAnim }] },
                          { width: '95%', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }
                        ]}
                      >
                        <View style={styles.spotifyIcon}>
                          <FontAwesomeIcon icon={spotifyIcon} size={32} color={light}/>
                        </View>
                        <View style={styles.recentlyPlayedContent}>
                        <Text style={styles.rpTitle}>{user.username}'s Recently Played</Text>
                          <ScrollView 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.recentlyPlayedContent}
                            contentContainerStyle={styles.recentlyPlayedContentContainer}
                          >
                            <View>
                              <Text style={styles.recentlyPlayedText}>
                                {recentlyPlayedTrack.trackName} - {recentlyPlayedTrack.artistName} 
                              </Text>
                            </View>
                          </ScrollView>
                        </View>
                        <View style={styles.waveformContainer}>
                          <LiveWaveform />
                        </View>
                      </Animated.View>
                    </LongPressGestureHandler>
                  </GestureHandlerRootView>
                )}

          </View>
           {/* Show posts only if following the user */}
           {(friendRequestStatus === 'Following' || user.publicProfile) && (
              <UserPostList userId={userId} onPostPress={handlePresentPostModalPress} />
            )}

          {/* Show "no posts" message if needed */}
          {!(friendRequestStatus === 'Following' || user.publicProfile) && (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>
                {user.publicProfile
                  ? "This user hasn't posted yet."
                  : "Follow this user to see their posts."}
              </Text>
            </View>
          )}
          
          </ScrollView>

        {/* Modal to confirm cancellation/unfollow */}
        <Modal 
          animationType="none" 
          transparent={true} 
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {modalType === 'cancel'
                  ? 'Are you sure you want to cancel the friend request?'
                  : 'Are you sure you want to unfollow this user?'
                }
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  onPress={modalType === 'cancel' ? handleCancelRequest : handleUnfollow} 
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                >
                  <Text style={styles.modalButtonText}>
                    {modalType === 'cancel' ? 'Cancel Request' : 'Unfollow'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModalClose} style={[styles.modalButton, styles.modalButtonCancel]}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </View>
        </Modal>
        <UserSearchPostBottomSheetModal ref={postBottomSheetRef} post={selectedPost}/>
        <RPBottomSheetModal ref={rpBottomSheetRef} userId={userId} />
        <UserSearchLinkBottomSheetModal ref={linkBottomSheetRef} userId={userId} />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  header: {
    backgroundColor: dark,
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: gray,
  },
  backButton: {
    width: 40,
  },
  usernameContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
  },
  linkButton: {
    width: 40,
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 10,
  },
  email: {
    fontSize: 18,
    marginTop: 10,
    color: light,
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: dark,
    borderRadius: 5,
  },
  postBody: {
    fontSize: 16,
    color: light,
  },
  postDate: {
    fontSize: 12,
    color: lgray,
    marginTop: 5,
  },
  followRequestContainer: {
    flexDirection: 'row',
    // marginVertical: 15,
    marginBottom: 10,
    justifyContent: 'center',
  },
  followButtonBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  followButton: {
    backgroundColor: light,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: light,
  },
  requestedButton: {
    backgroundColor: dgray,
  },
  followButtonText: {
    color: dark,
    fontWeight: '600',
    fontSize: 14,
  },
  followingButtonText: {
    color: light,
    fontWeight: '600',
    fontSize: 14,
  },
   noPostsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noPostsText: {
    fontSize: 16,
    color: lgray,
  },

  // Modal Styles
  modalContainer: {
    position: 'absolute', 
    top: 0, 
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackgroundContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: {
    backgroundColor: gray,
    padding: 20,
    borderRadius: 10,
    shadowColor: dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    maxWidth: '90%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center', 
    color: light,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Even spacing between buttons
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: '#007AFF', // Primary color for confirm button
  },
  modalButtonCancel: {
    backgroundColor: error, // Gray color for cancel button
  },
  modalButtonText: {
    color: light,
    fontWeight: 'bold',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 70, 
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  recentlyPlayedBox: {
    backgroundColor: gray,
    padding: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  recentlyPlayedContent: {
    flex: 1,
  },
  recentlyPlayedContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  rpTitle: {
    color: dgray,
    fontSize: 10,
    fontStyle: 'italic',
  },
  recentlyPlayedText: {
    color: light,
    fontSize: 16,
  },
  spotifyIcon: {
    paddingRight: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
    paddingRight: 25, ///This is only a temp fix for the spacing issue
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
  },
  statLabel: {
    fontSize: 14,
    color: lgray,
  },
  waveformContainer: {
    marginLeft: 10,
    marginRight: 5,
  },
  disabledStatItem: {
    opacity: 0.5,
  },
  loadingText: {
    color: light,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 300,
  },
});

export default UserSearchProfileScreen;