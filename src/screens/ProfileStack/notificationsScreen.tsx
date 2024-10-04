import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ProfileStackParamList } from '../../components/types';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { FriendRequest } from '../../API';
import { formatRelativeTime } from '../../components/formatComponents';
import { dark, light, gray, lgray, dgray } from '../../components/colorModes';
import { fetchUsernameById } from '../../components/getUserUsername'; 
import { useNotification } from '../../context/NotificationContext';
import { sendNotification } from '../../notifications/sendNotification';
import { sendApprovalNotification } from '../../notifications/sendApprovalNotification';

Amplify.configure(awsconfig);

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);
  const [friendRequests, setFriendRequests] = useState<Array<FriendRequest>>([]);
  const [requestUsernames, setRequestUsernames] = useState<{ [userId: string]: string | null }>({});
  const { deviceToken } = useNotification();

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
    }
  }

  const fetchFriendRequests = async (userId: string) => {
    try {
      const response = await client.graphql({
        query: queries.listFriendRequests,
        variables: {
          filter: {
            userReceivedFriendRequestsId: { eq: userId },
          }
        }
      });

      setFriendRequests(response.data.listFriendRequests.items as Array<FriendRequest>);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };
  

  const handleApproveRequest = async (friendRequest: FriendRequest) => {
    try {
      const response = await client.graphql({
        query: mutations.updateFriendRequest,
        variables: {
          input: {
            id: friendRequest.id,
            status: 'Following',
            _version: friendRequest._version,
          }
        }
      });

      if (response.data.updateFriendRequest) {
        // Immediately update the UI and refetch friend requests
        fetchFriendRequests(currentAuthUserInfo.userId);

        // Send approval notification asynchronously
        sendApprovalNotificationAsync(friendRequest);
      } else {
        console.error('Failed to approve friend request:', response.errors);
      }
    } catch (error) {
      console.error('Error approving friend request:', error);
    }
  };

  const sendApprovalNotificationAsync = async (friendRequest: FriendRequest) => {
    try {
      // Fetch the current user's username
      const currentUserResponse = await client.graphql({
        query: queries.getUser,
        variables: { id: currentAuthUserInfo.userId }
      });

      const currentUser = currentUserResponse.data.getUser;
      if (currentUser && currentUser.username) {
        const currentUsername = currentUser.username;

        // Send approval notification
        if (friendRequest.userSentFriendRequestsId) {
          await sendApprovalNotification(friendRequest.userSentFriendRequestsId, currentUsername);
        }
      } else {
        console.error('Current user or username not found');
      }
    } catch (error) {
      console.error('Error sending approval notification:', error);
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

  const handleSendTestNotification = async () => {
    const payload = {
      deviceToken: "84844bde225c32584f881d97cdb03ad47efe373639f5540f3a82180e96f04f73",
      message: "This is a test notification",
      title: "Test Notification"
    };

    await sendNotification(payload);
  };

  const renderItem = ({ item }: { item: FriendRequest }) => {
    const username = item.userSentFriendRequestsId 
      ? requestUsernames[item.userSentFriendRequestsId] || 'Loading...' 
      : 'Loading...';

    if (item.status !== 'Cancelled') {
      return (
        <View style={styles.friendRequestItem}>
          <View style={styles.requestInfo}>
            <Text style={styles.friendRequestUsername}>{username}</Text> 
            <Text style={styles.friendRequestStatus}>
              {item.status === 'Pending' ? 'Sent a friend request' : 'Is now following you'}
            </Text>
            <Text style={styles.timestamp}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
          {item.status === 'Pending' && (
            <TouchableOpacity onPress={() => handleApproveRequest(item)} style={styles.approveButton}>
              <FontAwesomeIcon icon={faCheck} size={16} color={light} />
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return null;
    }
  };

  const renderFooter = () => {
    if (friendRequests.length === 0) {
      return null; // Don't render anything if there are no notifications
    }
    return (
      <Text style={styles.noMoreNotifications}>No more notifications</Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholderView} />
        </View>
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.noNotifications}>No notifications</Text>
          )}
          ListFooterComponent={renderFooter}
        />
        <TouchableOpacity onPress={handleSendTestNotification} style={styles.sendNotificationButton}>
          <Text style={styles.sendNotificationButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
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
  sendNotificationButton: {
    backgroundColor: light,
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  sendNotificationButtonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;