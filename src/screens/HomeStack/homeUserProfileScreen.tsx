// HomeUserProfileScreen.tsx
// ** Almost identical copy of userSearchProfileScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { dark, light, lgray, dgray, gray, placeholder, error } from '../../components/colorModes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HomeStackParamList } from '../../components/types';

import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';

import { SpotifyRecentlyPlayedTrack } from '../../API';

import { formatRelativeTime } from '../../components/formatComponents';
import UserPostList from '../../components/userPostsList';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import UserSearchPostBottomSheetModal from '../../components/BottomSheets/UserSearchPostBottomSheetModal';
import { formatNumber } from '../../utils/numberFormatter';
import LiveWaveform from '../../components/LiveWaveform';

const spotifyIcon = faSpotify as IconProp;

Amplify.configure(awsconfig);

type HomeUserProfileScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeUserProfile'>;

const HomeUserProfileScreen: React.FC<HomeUserProfileScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);

  const [user, setUser] = useState<any | null>(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState<'Follow' | 'Requested' | 'Following'>('Follow');
  const [existingFriendRequest, setExistingFriendRequest] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'unfollow' | null>(null);
  const [recentlyPlayedTrack, setRecentlyPlayedTrack] = useState<SpotifyRecentlyPlayedTrack | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);

  const client = generateClient();

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId } = await getCurrentUser();
      setCurrentAuthUserInfo({ username, userId });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.graphql({
          query: queries.getUser,
          variables: { id: userId },
        });

        if (response.data && response.data.getUser) {
          const fetchedUser = response.data.getUser;
          setUser(fetchedUser);

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

          // Fetch the recently played track
          const recentlyPlayedResponse = await client.graphql({
            query: queries.listSpotifyRecentlyPlayedTracks,
            variables: { 
              filter: { 
                userSpotifyRecentlyPlayedTrackId: { eq: userId } 
              } 
            },
          });

          const recentlyPlayedTrack = recentlyPlayedResponse.data.listSpotifyRecentlyPlayedTracks.items[0];
          if (recentlyPlayedTrack) {
            setRecentlyPlayedTrack(recentlyPlayedTrack);
          }
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user or posts:', error);
      }
    };

    fetchUser();
  }, [userId, friendRequestStatus]);

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
            if (friendRequest.status === 'Pending') {
              setFriendRequestStatus('Requested');
            } else if (friendRequest.status === 'Following') {
              setFriendRequestStatus('Following');
            } else if (friendRequest.status === 'Cancelled') {
              setFriendRequestStatus('Follow');
            }
          } else {
            setExistingFriendRequest(null);
            setFriendRequestStatus('Follow');
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

  const handleFollowRequest = async () => {
    try {
      if (existingFriendRequest) {
        // If an existing request is found, update it to "Pending"
        const response = await client.graphql({
          query: mutations.updateFriendRequest,
          variables: {
            input: {
              id: existingFriendRequest.id,
              status: 'Pending',
              _version: existingFriendRequest._version,
            },
            condition: {
              status: { eq: 'Cancelled' }
            }
          }
        });
  
        if (response.data.updateFriendRequest) {
          console.log('Friend Request sent successfully!', response.data.updateFriendRequest);
          setFriendRequestStatus('Requested');
          setExistingFriendRequest(response.data.updateFriendRequest);
        } else {
          console.error('Failed to send friend request:', response.errors);
        }
      } else {
        // If no existing request, create a new one
        const response = await client.graphql({
          query: mutations.createFriendRequest,
          variables: {
            input: {
                userSentFriendRequestsId: currentAuthUserInfo.userId,
                userReceivedFriendRequestsId: user.id,
              status: 'Pending',
            }
          }
        });
  
        if (response.data.createFriendRequest) {
          console.log('Friend Request created successfully!', response.data.createFriendRequest);
          setFriendRequestStatus('Requested');
          setExistingFriendRequest(response.data.createFriendRequest);
        } else {
          console.error('Failed to create friend request:', response.errors);
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 

    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
        </TouchableOpacity>
          <Text style={styles.username}>{user.username}</Text>
      </View>


      <ScrollView>
        <View style={styles.profileContainer}>
          {/* Add following/followers count */}
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
            <TouchableOpacity onPress={handleButtonPress} style={styles.followButton}>
                <Text style={styles.followButtonText}>{friendRequestStatus}</Text>
            </TouchableOpacity>
          </View>

           {recentlyPlayedTrack && ( 
              <View style={[styles.recentlyPlayedBox, { width: '95%', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }]}>
                <View style={styles.spotifyIcon}>
                  <FontAwesomeIcon icon={spotifyIcon} size={32} color={light}/>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.recentlyPlayedContent}>
                  <View>
                    <Text style={styles.rpTitle}>{user.username}'s Recently Played</Text>
                    <Text style={styles.recentlyPlayedText}>
                      {recentlyPlayedTrack.trackName} -{' '}
                      {recentlyPlayedTrack.artistName} 
                    </Text>
                  </View>
                </ScrollView>
                <View style={styles.waveformContainer}>
                  <LiveWaveform />
                </View>
              </View>
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
    paddingTop: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: gray,
  },
  backButton: {
  },
  usernameContainer: {
  },
  profileContainer: {
    alignItems: 'center',
    // padding: 10,
  },
  username: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 15,
    color: light,
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
  followButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    color: light,
    fontWeight: 'bold',
    fontSize: 14,
  },
  followRequestContainer: {
    flexDirection: 'row',
    marginBottom: 15,
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
    alignSelf: 'flex-start', // Align to the left
    flexDirection: 'row',
    marginLeft: 10,
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
  recentlyPlayedContent: {
    flex: 1,
  },
  waveformContainer: {
    marginLeft: 10,
    marginRight: 5,
  },
  disabledStatItem: {
    opacity: 0.5,
  },
});

export default HomeUserProfileScreen;
