import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ProfileStackParamList } from '../components/types';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { ListFriendRequestsQuery, FriendRequest } from '../API'; // Import types from your API.ts file
import { getUser } from '../graphql/queries'; // Import the getUser query
import { formatRelativeTime } from '../components/formatComponents';
import { dark, light, gray, lgray, placeholder, dgray } from '../components/colorModes';

Amplify.configure(awsconfig);

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);
  const [friendRequests, setFriendRequests] = useState<Array<FriendRequest>>([]); // Type the state

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
        fetchFriendRequests(currentAuthUserInfo.userId); // Refresh the friend requests list
      } else {
        console.error('Failed to approve friend request:', response.errors);
      }
    } catch (error) {
      console.error('Error approving friend request:', error);
    }
  };

  const renderItem = ({ item }: { item: FriendRequest }) => {
    // Conditional rendering for the entire item container
    if (item.status !== 'Cancelled') {
      return (
        <View style={styles.friendRequestItem}>
          {/* <Text style={styles.friendRequestUsername}>{item.userSentFriendRequestsId} </Text> */}
          {item.status === 'Pending' ? (
            <Text style={styles.friendRequestStatus}>Sent a friend request</Text>
          ) : (
            <Text style={styles.friendRequestStatus}>Is now following you</Text>
          )}
          {/* Remove the approve button if the status is not Pending */}
          {item.status === 'Pending' && (
            <TouchableOpacity onPress={() => handleApproveRequest(item)} style={styles.approveButton}>
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return null; // Return null for cancelled items
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
      </TouchableOpacity>
      <View style={styles.friendRequestList}>
        <FlatList
          data={friendRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={() => (
            <Text style={styles.noMoreNotifications}>No more notifications</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  backButton: {
    marginRight: 10,
    marginTop: 30,
    marginLeft: 20,
  },
  friendRequestList: {
    flex: 1,
    padding: 20,
  },
  noMoreNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: lgray,
  },
  friendRequestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendRequestUsername: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendRequestStatus: {
    fontSize: 16,
    color: light,
    paddingBottom: 8,
  },
  noFriendRequests: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  approveButton: {
    backgroundColor: '#007AFF',
    paddingBottom: 10,
    borderRadius: 5,
  },
  approveButtonText: {
    color: light,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NotificationsScreen;
