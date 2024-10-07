import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ProfileStackParamList } from '../../components/types';
import { getUser, listFriendRequests } from '../../graphql/queries';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { FriendRequest } from '../../API';
import { dark, light, gray, lgray, dgray } from '../../components/colorModes';
import { formatRelativeTime } from '../../components/formatComponents';
import { sendApprovalNotification } from '../../notifications/sendApprovalNotification';
import { updateFriendRequest, createFriendRequest } from '../../graphql/mutations';
import { fetchUsernameById } from '../../components/getUserUsername';

Amplify.configure(awsconfig);

type FriendRequestsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'FriendRequests'>;
};

// Update this type definition
type FollowStatusType = 'Follow' | 'Follow Back' | 'Following' | 'Requested';

const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({ navigation }) => {
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);
  const [friendRequests, setFriendRequests] = useState<Array<FriendRequest>>([]);
  const [requestUsernames, setRequestUsernames] = useState<{ [userId: string]: string | null }>({});
  // Update the type here
  const [followStatus, setFollowStatus] = useState<{ [userId: string]: FollowStatusType }>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const client = generateClient();

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      setCurrentAuthUserInfo({ userId });
      fetchFriendRequests(userId);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const fetchFriendRequests = async (userId: string) => {
    try {
      const response = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            userReceivedFriendRequestsId: { eq: userId },
            or: [
              { status: { eq: 'Pending' } },
              { status: { eq: 'Following' } }
            ]
          }
        }
      });

      const requests = response.data.listFriendRequests.items as Array<FriendRequest>;
      setFriendRequests(requests);

      // Check existing friend requests for each sender
      for (const request of requests) {
        if (request.userSentFriendRequestsId) {
          checkExistingFriendRequest(request.userSentFriendRequestsId);
        }
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingFriendRequest = async (senderId: string) => {
    const { userId } = await getCurrentUser();
  
    try {
      // Check if the other user is following the current user
      const otherUserFollowingResponse = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            userSentFriendRequestsId: { eq: senderId },
            userReceivedFriendRequestsId: { eq: userId },
            status: { eq: 'Following' }
          }
        }
      });
  
      // Check if the current user has sent a request to the other user
      const currentUserRequestResponse = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            userSentFriendRequestsId: { eq: userId },
            userReceivedFriendRequestsId: { eq: senderId },
          }
        }
      });
  
      const otherUserFollowing = otherUserFollowingResponse.data.listFriendRequests.items.length > 0;
      const currentUserRequest = currentUserRequestResponse.data.listFriendRequests.items[0];
  
      if (currentUserRequest) {
        if (currentUserRequest.status === 'Following') {
          setFollowStatus(prev => ({ ...prev, [senderId]: 'Following' }));
        } else if (currentUserRequest.status === 'Pending') {
          setFollowStatus(prev => ({ ...prev, [senderId]: 'Requested' }));
        } else if (currentUserRequest.status === 'Cancelled') {
          setFollowStatus(prev => ({ ...prev, [senderId]: 'Follow Back' }));
        }
      } else if (otherUserFollowing) {
        setFollowStatus(prev => ({ ...prev, [senderId]: 'Follow Back' }));
      } else {
        setFollowStatus(prev => ({ ...prev, [senderId]: 'Follow Back' }));
      }
    } catch (error) {
      console.error('Error checking existing friend request:', error);
    }
  };

  const handleApproveRequest = async (friendRequest: FriendRequest) => {
    try {
      const response = await client.graphql({
        query: updateFriendRequest,
        variables: {
          input: {
            id: friendRequest.id,
            status: 'Following',
            _version: friendRequest._version,
          }
        }
      });

      if (response.data.updateFriendRequest) {
        // Update UI
        setFriendRequests(prev => prev.map(req => 
          req.id === friendRequest.id ? { ...req, status: 'Following' } : req
        ));
        
        // Send approval notification
        if (friendRequest.userSentFriendRequestsId) {
          const currentUsername = await fetchUsernameById(currentAuthUserInfo.userId);
          await sendApprovalNotification(friendRequest.userSentFriendRequestsId, currentUsername || '');
        }
      } else {
        console.error('Failed to approve friend request:', response.errors);
      }
    } catch (error) {
      console.error('Error approving friend request:', error);
    }
  };

  const handleFollowRequest = async (userId: string) => {
    try {
      // First, check if there's an existing friend request
      const existingRequestResponse = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            userSentFriendRequestsId: { eq: currentAuthUserInfo.userId },
            userReceivedFriendRequestsId: { eq: userId },
          }
        }
      });

      const existingRequests = existingRequestResponse.data.listFriendRequests.items;

      if (existingRequests.length > 0) {
        // If there's an existing request, update it
        const existingRequest = existingRequests[0];
        const response = await client.graphql({
          query: updateFriendRequest,
          variables: {
            input: {
              id: existingRequest.id,
              status: 'Pending',
              _version: existingRequest._version,
            }
          }
        });

        if (response.data.updateFriendRequest) {
          setFollowStatus(prev => ({ ...prev, [userId]: 'Requested' }));
          console.log('Friend request updated successfully');
        } else {
          console.error('Failed to update friend request:', response.errors);
        }
      } else {
        // If there's no existing request, create a new one
        const response = await client.graphql({
          query: createFriendRequest,
          variables: {
            input: {
              userSentFriendRequestsId: currentAuthUserInfo.userId,
              userReceivedFriendRequestsId: userId,
              status: 'Pending',
            },
          },
        });

        if (response.data.createFriendRequest) {
          setFollowStatus(prev => ({ ...prev, [userId]: 'Requested' }));
          console.log('New friend request created successfully');
        } else {
          console.error('Failed to create friend request:', response.errors);
        }
      }
    } catch (error) {
      console.error('Error handling follow request:', error);
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const newRequestUsernames: { [userId: string]: string | null } = {};

      for (const request of friendRequests) {
        if (request.userSentFriendRequestsId) {
          const username = await fetchUsernameById(request.userSentFriendRequestsId);
          newRequestUsernames[request.userSentFriendRequestsId] = username;
        }
      }

      setRequestUsernames(newRequestUsernames);
    };

    fetchUsernames();
  }, [friendRequests]);

  const renderItem = ({ item }: { item: FriendRequest }) => {
    const username = item.userSentFriendRequestsId 
      ? requestUsernames[item.userSentFriendRequestsId] || 'Loading...' 
      : 'Loading...';

    return (
      <View style={styles.friendRequestItem}>
        <View style={styles.requestInfo}>
          <Text style={styles.friendRequestUsername}>{username}</Text>
          <Text style={styles.friendRequestStatus}>
            {item.status === 'Pending' ? 'Sent a friend request' : 'Is now following you'}
          </Text>
          <Text style={styles.timestamp}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        {item.status === 'Pending' ? (
          <TouchableOpacity onPress={() => handleApproveRequest(item)} style={styles.approveButton}>
            <FontAwesomeIcon icon={faCheck} size={16} color={light} />
          </TouchableOpacity>
        ) : (
          item.userSentFriendRequestsId && (
            <TouchableOpacity 
              onPress={() => handleFollowRequest(item.userSentFriendRequestsId!)}
              style={[
                styles.followButton, 
                (followStatus[item.userSentFriendRequestsId] === 'Following' || followStatus[item.userSentFriendRequestsId] === 'Requested') 
                  ? styles.followingButton 
                  : styles.followBackButton
              ]}
              disabled={followStatus[item.userSentFriendRequestsId] === 'Following' || followStatus[item.userSentFriendRequestsId] === 'Requested'}
            >
              <Text style={[
                styles.followButtonText,
                (followStatus[item.userSentFriendRequestsId] === 'Following' || followStatus[item.userSentFriendRequestsId] === 'Requested') 
                  ? styles.followingButtonText 
                  : styles.followBackButtonText
              ]}>
                {followStatus[item.userSentFriendRequestsId] || 'Follow Back'}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={light} />
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
          <Text style={styles.headerTitle}>Friend Requests</Text>
          <View style={styles.placeholderView} />
        </View>
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.noNotifications}>No friend requests</Text>
          )}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  backButton: {
    width: 40, // Set a fixed width
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    textAlign: 'center',
  },
  placeholderView: {
    width: 40, // Match the width of the backButton
  },
  listContent: {
    paddingHorizontal: 20,
  },
  friendRequestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  requestInfo: {
    flex: 1,
  },
  friendRequestUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: light,
    marginBottom: 4,
  },
  friendRequestStatus: {
    fontSize: 14,
    color: lgray,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: dgray,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: lgray,
  },
  noMoreNotifications: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 14,
    color: dgray,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: light,
    borderWidth: 1,
  },
  followBackButton: {
    backgroundColor: light,
  },
  followButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  followingButtonText: {
    color: light,
  },
  followBackButtonText: {
    color: dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: dark,
  },
});

export default FriendRequestsScreen;