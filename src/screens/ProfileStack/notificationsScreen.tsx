import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ProfileStackParamList } from '../../components/types';
import { listNotifications, getPost, getRepost } from '../../graphql/queries';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../../aws-exports';
import { getCurrentUser } from 'aws-amplify/auth';
import { Notification, Post, Repost } from '../../API';
import { formatRelativeTime } from '../../components/formatComponents';
import { dark, light, gray, lgray, dgray } from '../../components/colorModes';
import { useNotification } from '../../context/NotificationContext';

Amplify.configure(awsconfig);

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Notifications'>;
};

type GroupedNotification = {
  id: string;
  type: string;
  targetId: string | null;
  actors: string[];
  message: string;
  createdAt: string;
  imageUrl?: string;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);
  const [groupedNotifications, setGroupedNotifications] = useState<GroupedNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deviceToken } = useNotification();

  const client = generateClient();

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      setCurrentAuthUserInfo({ userId });
      fetchNotifications(userId);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const fetchNotifications = async (userId: string) => {
    try {
      setIsLoading(true);
      const notificationsResponse = await client.graphql({
        query: listNotifications,
        variables: { filter: { userId: { eq: userId } } }
      });

      const notifications = notificationsResponse.data.listNotifications.items as Notification[];
      const groupedNotifications = await groupNotifications(notifications);
      setGroupedNotifications(groupedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupNotifications = async (notifications: Notification[]): Promise<GroupedNotification[]> => {
    const grouped: { [key: string]: GroupedNotification } = {};

    for (const notification of notifications) {
      const key = `${notification.type}-${notification.targetId || 'null'}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: notification.id,
          type: notification.type,
          targetId: notification.targetId || null,
          actors: [notification.actorId],
          message: notification.message || '',
          createdAt: notification.createdAt,
        };

        // Fetch image URL for post or repost
        if (notification.targetId) {
          grouped[key].imageUrl = await fetchImageUrl(notification.type, notification.targetId);
        }
      } else {
        grouped[key].actors.push(notification.actorId);
        if (new Date(notification.createdAt) > new Date(grouped[key].createdAt)) {
          grouped[key].createdAt = notification.createdAt;
        }
      }
    }

    const groupedArray = Object.values(grouped).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return groupedArray;
  };

  const fetchImageUrl = async (type: string, targetId: string): Promise<string | undefined> => {
    try {
      if (type === 'LIKE' || type === 'COMMENT' || type === 'REPOST') {
        const postResponse = await client.graphql({
          query: getPost,
          variables: { id: targetId }
        });
        const post = postResponse.data.getPost as Post;
        return post.scTrackArtworkUrl || post.spotifyTrackImageUrl || post.spotifyAlbumImageUrl || undefined;
      }
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
    return undefined;
  };

  const renderNotificationItem = (item: GroupedNotification) => {
    let message = item.message;

    if (item.type === 'COMMENT' && item.actors.length > 1) {
      message = `${item.actors[0]} and ${item.actors.length - 1} others commented on your post`;
    } else if (item.type === 'LIKE' && item.actors.length > 1) {
      message = `${item.actors[0]} and ${item.actors.length - 1} others liked your post`;
    } else if (item.type === 'LIKE' && item.actors.length === 1) {
      message = `${item.actors[0]} liked your post`;
    }

    return (
      <View key={item.id} style={styles.notificationItem}>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.notificationImage} />
        )}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>{message}</Text>
          <Text style={styles.timestamp}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
      </View>
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.friendRequestsButton}
            onPress={() => navigation.navigate('FriendRequests')}
          >
            <Text style={styles.friendRequestsText}>Friend Requests</Text>
            <FontAwesomeIcon icon={faChevronRight} size={18} color={light} />
          </TouchableOpacity>
          
          <Text style={styles.activityTitle}>Activity</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={light} />
            </View>
          ) : groupedNotifications.length > 0 ? (
            groupedNotifications.map(renderNotificationItem)
          ) : (
            <Text style={styles.noNotifications}>No notifications</Text>
          )}
        </ScrollView>
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
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    textAlign: 'center',
  },
  placeholderView: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: light,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: dgray,
  },
  noNotifications: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: lgray,
  },
  friendRequestsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  friendRequestsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: light,
    marginTop: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 40,
  },
});

export default NotificationsScreen;