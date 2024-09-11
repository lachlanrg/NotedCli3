import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, SafeAreaView, Dimensions, Animated, Easing, PanResponder } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../components/types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faEdit, faUserPlus, faBell } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, placeholder, dgray, lgray } from '../../components/colorModes';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { getCurrentUser } from 'aws-amplify/auth';
import { getFollowCounts } from '../../components/currentUserFollowerFollowingCount';
import { refreshing, setRefreshing } from '../../components/scrollRefresh';

import UserPostList from '../../components/userPostsList';
import SettingsBottomSheet from '../../components/BottomSheets/SettingsBottomSheetModal';
import ProfilePostBottomSheetModal from '../../components/BottomSheets/ProfilePostBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useSpotify } from '../../context/SpotifyContext';

import { formatNumber } from '../../utils/numberFormatter'; // Add this import
import { listPosts } from '../../graphql/queries'; // Add this import
import { generateClient } from 'aws-amplify/api';
import LiveWaveform from '../../components/LiveWaveform'; // Add this import

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const spotifyIcon = faSpotify as IconProp;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [followCounts, setFollowCounts] = useState({ following: 0, followers: 0 });
  const [postsCount, setPostsCount] = useState(0);
  const settingsBottomSheetRef = useRef<BottomSheetModal>(null);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { recentlyPlayed } = useSpotify();
  const client = generateClient();
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePresentPostModalPress = (item: any) => {
    setSelectedPost(item);
    postBottomSheetRef.current?.present();
  };

  const handlePresentSettingsModalPress = () => { 
    settingsBottomSheetRef.current?.present();
  };

  const fetchFollowCounts = useCallback(async () => {
    try {
      const counts = await getFollowCounts();
      setFollowCounts(counts);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const currentAuthenticatedUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const { userId, username } = user;
        console.log(`The User Id: ${userId}, Username: ${username}`);
        setUserInfo({ userId, username });
      
      } else {
        console.log('No user found');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        currentAuthenticatedUser(),
        fetchFollowCounts()
      ]);
    };
    fetchData();
  }, [currentAuthenticatedUser, fetchFollowCounts]);

  const handleNavigateToUserSearch = () => {
    navigation.navigate('UserSearch');
    console.log("Navigating to UserSearch Screen");
  };

  const handleNotificationPress = () => {
    console.log("Notification button pressed");
    navigation.navigate('Notifications');
  };

  const handlePostDeleted = () => {
    console.log("Post deleted from ProfileScreen");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFollowCounts();
      // Increment the refreshKey to force UserPostList to re-render
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFollowCounts]);

  const handleFollowListNavigation = (initialTab: 'following' | 'followers') => {
    navigation.navigate('FollowList', { userId: userInfo?.userId, initialTab });
  };

  const resetSelectedPost = () => {
    setSelectedPost(null);
  };

  const handlePostsCountUpdate = (count: number) => {
    setPostsCount(count);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={[styles.container]}>
          <View style={styles.header}>
            <Text style={styles.usernameWelcome}>{userInfo?.username}</Text>
            <View style={styles.icons}>
              <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate('CreatePostTab')}>
                <FontAwesomeIcon icon={faEdit} size={25} color={light} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bellIconButton} onPress={handleNotificationPress}>
                <FontAwesomeIcon icon={faBell} size={25} color={light} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.createPostButton} onPress={(handlePresentSettingsModalPress)}>
                <FontAwesomeIcon icon={faCog} size={25} color={light} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
              style={styles.scrollViewContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              scrollEventThrottle={16}
            >
              <View style={styles.statsContainer}>
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => handleFollowListNavigation('following')}
                >
                  <Text style={styles.statNumber}>{formatNumber(followCounts.following)}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => handleFollowListNavigation('followers')}
                >
                  <Text style={styles.statNumber}>{formatNumber(followCounts.followers)}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{formatNumber(postsCount)}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <TouchableOpacity onPress={handleNavigateToUserSearch}>
                  <FontAwesomeIcon icon={faUserPlus} size={20} color={light} />
                </TouchableOpacity>
              </View>
            {recentlyPlayed.length > 0 && ( 
              <View style={[styles.recentlyPlayedBox, { width: '95%', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }]}>
                <View style={styles.spotifyIcon}>
                  <FontAwesomeIcon icon={spotifyIcon} size={32} color={light}/>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.recentlyPlayedContent}>
                  <View>
                    <Text style={styles.rpTitle}>My Recently Played</Text>
                    <Text style={styles.recentlyPlayedText}>
                      {recentlyPlayed[0].track.name} -{' '}
                      {recentlyPlayed[0].track.artists[0].name} 
                    </Text>
                  </View>
                </ScrollView>
                <View style={styles.waveformContainer}>
                  <LiveWaveform />
                </View>
              </View>
            )}
            <UserPostList 
              key={refreshKey}
              userId={userInfo?.userId} 
              onPostPress={handlePresentPostModalPress} 
              onPostsCountUpdate={handlePostsCountUpdate}
            />
          </ScrollView>
          <SettingsBottomSheet ref={settingsBottomSheetRef} />
          <ProfilePostBottomSheetModal 
            ref={postBottomSheetRef} 
            item={selectedPost} 
            onPostDelete={handlePostDeleted}
            onClose={resetSelectedPost}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 8,
  },
  usernameWelcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    justifyContent: 'flex-start', // username far left
  },
  icons: {
    justifyContent: 'flex-end', // icons far right
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingsButton: {
    padding: 10,
    borderRadius: 50,
  },
  createPostButton: {
    padding: 10,
    borderRadius: 50,
  },
  bellIconButton: {
    padding: 10,
    borderRadius: 50,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    marginRight: 5,
    color: light,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: 'hidden',
  },
  userInfoContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
    marginHorizontal: 20,
    borderColor: gray,
  },
  userInfo: {
    marginBottom: 10,
    color: light,
  },
  scrollViewContent: {
    flex: 1,
    marginRight: 10,
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
    // marginBottom: 20,
    alignSelf: 'flex-start', // Align to the left
    // marginHorizontal: 20, 
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
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
  // profileContainer: {
  //   padding: 10,
  // },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
    alignItems: 'center', // Add this to align items vertically
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
  addUserButton: {
    padding: 10,
    backgroundColor: gray,
    borderRadius: 20,
  },
  recentlyPlayedContent: {
    flex: 1,
  },
  waveformContainer: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default ProfileScreen;