import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../components/types';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, lgray } from '../../components/colorModes';
import { getCurrentUser } from 'aws-amplify/auth';

type FollowListScreenProps = NativeStackScreenProps<ProfileStackParamList, 'FollowList'>;

const FollowListScreen: React.FC<FollowListScreenProps> = ({ route, navigation }) => {
  const { userId, initialTab } = route.params;
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(initialTab);
  const [following, setFollowing] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const client = generateClient();

  useEffect(() => {
    fetchUserData();
    fetchFollowList();
    fetchCurrentUser();
  }, [userId]);

  const fetchCurrentUser = async () => {
    try {
      const { userId } = await getCurrentUser();
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await client.graphql({
        query: queries.getUser,
        variables: { id: userId },
      });
      if (userResponse.data && userResponse.data.getUser) {
        setUsername(userResponse.data.getUser.username || 'Unknown User');
      } else {
        setUsername('Unknown User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUsername('Unknown User');
    }
  };

  const fetchFollowList = async () => {
    try {
      const followingResponse = await client.graphql({
        query: queries.listFriendRequests,
        variables: {
          filter: {
            userSentFriendRequestsId: { eq: userId },
            status: { eq: 'Following' },
          },
        },
      });
      const followingWithUserDetails = await Promise.all(
        followingResponse.data.listFriendRequests.items.map(async (item: any) => {
          const userDetails = await client.graphql({
            query: queries.getUser,
            variables: { id: item.userReceivedFriendRequestsId },
          });
          return { ...item, userDetails: userDetails.data.getUser };
        })
      );
      setFollowing(followingWithUserDetails);

      const followersResponse = await client.graphql({
        query: queries.listFriendRequests,
        variables: {
          filter: {
            userReceivedFriendRequestsId: { eq: userId },
            status: { eq: 'Following' },
          },
        },
      });
      const followersWithUserDetails = await Promise.all(
        followersResponse.data.listFriendRequests.items.map(async (item: any) => {
          const userDetails = await client.graphql({
            query: queries.getUser,
            variables: { id: item.userSentFriendRequestsId },
          });
          return { ...item, userDetails: userDetails.data.getUser };
        })
      );
      setFollowers(followersWithUserDetails);
    } catch (error) {
      console.error('Error fetching follow list:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const displayUsername = item.userDetails?.username || 'Unknown User';
    const userId = activeTab === 'following' ? item.userReceivedFriendRequestsId : item.userSentFriendRequestsId;

    const handleUserPress = () => {
      if (userId === currentUserId) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('UserSearchProfile', { userId });
      }
    };

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={handleUserPress}
      >
        <Text style={styles.username}>{displayUsername}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>
        {activeTab === 'following' ? "Not following anyone" : "No followers"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{username}</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.activeTab]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={[styles.tabText, activeTab === 'followers' && styles.activeTabText]}>Followers</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'following' ? following : followers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: gray,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: light,
  },
  tabText: {
    fontSize: 16,
    color: lgray,
  },
  activeTabText: {
    color: light,
  },
  userItem: {
    padding: 16,
  },
  username: {
    fontSize: 16,
    color: light,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: lgray,
  },
});

export default FollowListScreen;