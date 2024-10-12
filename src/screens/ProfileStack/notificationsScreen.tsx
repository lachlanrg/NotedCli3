import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, ActivityIndicator } from 'react-native';
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

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [currentAuthUserInfo, setCurrentAuthUserInfo] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deviceToken } = useNotification();
  const [notificationImages, setNotificationImages] = useState<{[key: string]: string}>({});

  const client = generateClient();

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      setCurrentAuthUserInfo({ userId });
      await fetchNotifications(userId);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const fetchNotifications = async (userId: string) => {
    try {
      const notificationsResponse = await client.graphql({
        query: listNotifications,
        variables: { 
          filter: { userId: { eq: userId } },
          limit: 100
        }
      });

      const newNotifications = notificationsResponse.data.listNotifications.items as Notification[];
      setNotifications(newNotifications);
      await fetchImages(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  const fetchImageUrl = async (type: string, targetId: string): Promise<string | undefined> => {
    try {
      if (type === 'LIKE' || type === 'COMMENT' || type === 'REPOST') {
        let postResponse = await client.graphql({
          query: getPost,
          variables: { id: targetId }
        });
        
        let post = postResponse.data.getPost as Post | null;
        
        if (!post) {
          const repostResponse = await client.graphql({
            query: getRepost,
            variables: { id: targetId }
          });
          
          const repost = repostResponse.data.getRepost as Repost | null;
          
          if (repost && repost.originalPost) {
            post = repost.originalPost;
          }
        }
        
        if (!post) {
          console.log(`Post or Repost not found for targetId: ${targetId}`);
          return undefined;
        }
        
        return post.scTrackArtworkUrl || post.spotifyTrackImageUrl || post.spotifyAlbumImageUrl || undefined;
      }
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
    return undefined;
  };

  const fetchImages = async (notificationsToFetch: Notification[]) => {
    const imagePromises = notificationsToFetch.map(async (notification) => {
      if (notification.targetId) {
        const imageUrl = await fetchImageUrl(notification.type, notification.targetId);
        return imageUrl ? { [notification.id]: imageUrl } : null;
      }
      return null;
    });

    const imageResults = await Promise.all(imagePromises);
    const newImages = imageResults.reduce((acc, result) => {
      if (result) {
        return { ...acc, ...result };
      }
      return acc;
    }, {} as { [key: string]: string });

    setNotificationImages(prevImages => ({ ...prevImages, ...newImages }));
    setIsLoading(false);
  };

  const renderNotificationItem = useCallback(({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      {item.targetId && notificationImages[item.id] && (
        <Image 
          source={{ uri: notificationImages[item.id] }} 
          style={styles.notificationImage} 
        />
      )}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.timestamp}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
    </View>
  ), [notificationImages]);

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const renderNotificationList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={light} />
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        renderItem={renderNotificationItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <Text style={styles.noNotifications}>No notifications</Text>
        }
      />
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
        <TouchableOpacity 
          style={styles.friendRequestsButton}
          onPress={() => navigation.navigate('FriendRequests')}
        >
          <Text style={styles.friendRequestsText}>Friend Requests</Text>
          <FontAwesomeIcon icon={faChevronRight} size={18} color={light} />
        </TouchableOpacity>
        <Text style={styles.activityTitle}>Activity</Text>
        {renderNotificationList()}
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
    paddingHorizontal: 20,
  },
  friendRequestsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: gray,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 20, // Add horizontal padding here
  },
});

export default NotificationsScreen;