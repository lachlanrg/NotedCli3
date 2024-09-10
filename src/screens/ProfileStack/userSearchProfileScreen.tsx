import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, SafeAreaView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, light, lgray, dgray, gray, placeholder, error } from '../../components/colorModes';
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

  const client = generateClient();

  React.useEffect(() => {
    currentAuthenticatedUser();
    
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId } = await getCurrentUser();
      console.log('___________________________________')
      console.log(`Current Authenticated User Info:`);
      console.log(`The Username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log('___________________________________')
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
  
        // Check if getUser exists in the response:
        if (response.data && response.data.getUser) { 
          const fetchedUser = response.data.getUser;
          setUser(fetchedUser); 
  
          // Fetch the recently played track
          if (fetchedUser.spotifyRecentlyPlayedTrack) {
            setRecentlyPlayedTrack(fetchedUser.spotifyRecentlyPlayedTrack);
          }
  
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
      }
    };
  
    fetchUser();
  }, [userId, friendRequestStatus]);

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
            console.log('Existing Friend Request:', friendRequest);
          } else {
            setExistingFriendRequest(null);
            setFriendRequestStatus('Follow');
            console.log('No existing friend requests sent')
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.email}>{user.id}</Text>
          {/* Add more user details here */}

          {recentlyPlayedTrack && (
            <View>
              <Text>Recently Played:</Text>
              <Text>{recentlyPlayedTrack.trackName} by {recentlyPlayedTrack.artistName}</Text>
              {recentlyPlayedTrack.albumImageUrl && (
                <Image 
                  source={{ uri: recentlyPlayedTrack.albumImageUrl }} 
                  style={{ width: 50, height: 50 }} 
                />
              )}
            </View>
          )}

        <View style={styles.followRequestContainer}>
            <TouchableOpacity onPress={handleButtonPress} style={styles.followButton}>
                <Text style={styles.followButtonText}>{friendRequestStatus}</Text>
            </TouchableOpacity>
        </View>
        </View>
         {/* Show posts only if following the user */}
         {(friendRequestStatus === 'Following' || user.publicProfile) && ( 
          <ScrollView> 
            {posts.map((post) => (
              <View key={post.id} style={styles.postContainer}>
                <Text style={styles.postBody}>{post.body}</Text>
                <Text style={styles.postDate}>{formatRelativeTime(post.createdAt)}</Text>
              </View>
            ))}
          </ScrollView>
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
    padding: 10,
    marginBottom: 10,
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
    marginTop: 10,
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
});

export default UserSearchProfileScreen;