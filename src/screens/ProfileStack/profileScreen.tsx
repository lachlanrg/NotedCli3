import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, SafeAreaView, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../components/types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faEdit, faUserPlus, faBell } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, placeholder, dgray, lgray } from '../../components/colorModes';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { getCurrentUser } from 'aws-amplify/auth';
import { getFollowCounts } from '../../components/currentUserFollowerFollowingCount';

import UserPostList from '../../components/userPostsList';
import SettingsBottomSheet from '../../components/BottomSheets/SettingsBottomSheetModal';
import ProfilePostBottomSheetModal from '../../components/BottomSheets/ProfilePostBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useSpotify } from '../../context/SpotifyContext';

import { formatNumber } from '../../utils/numberFormatter'; // Add this import
import LiveWaveform from '../../components/LiveWaveform'; // Add this import
import RPBottomSheetModal from '../../components/BottomSheets/RPBottomSheetModal';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { mediumImpact } from '../../utils/hapticFeedback';
import { getUser, listSpotifyRecentlyPlayedTracks } from '../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { SpotifyRecentlyPlayedTrack } from '../../models';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const rpBottomSheetRef = useRef<BottomSheetModal>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [recentlyPlayedDisabled, setRecentlyPlayedDisabled] = useState(false);
  const [recentlyPlayedTrack, setRecentlyPlayedTrack] = useState<SpotifyRecentlyPlayedTrack | null>(null);
  const spotifyContext = useSpotify();
  const recentlyPlayed = spotifyContext?.recentlyPlayed || [];


  const fetchUserDataAndCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const client = generateClient();
    try {
      const userResponse = await getCurrentUser();
      if (userResponse) {
        const { userId, username } = userResponse;
        setUserInfo({ userId, username });
      }

      const counts = await getFollowCounts();
      if (counts) {
        setFollowCounts(counts);
      }

      const recentlyPlayedDisabledResponse = await client.graphql({
        query: getUser,
        variables: { id: userResponse.userId },
      });

      const recentlyPlayedDisabled = recentlyPlayedDisabledResponse.data.getUser?.recentlyPlayedDisabled ?? false;
      setRecentlyPlayedDisabled(recentlyPlayedDisabled);

      const recentlyPlayedResponse = await client.graphql({
        query: listSpotifyRecentlyPlayedTracks,
        variables: { 
          filter: { 
            userSpotifyRecentlyPlayedTrackId: { eq: userResponse.userId } 
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

    } catch (error) {
      console.error('Error fetching user data and counts:', error);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPostsAndFollowCounts = useCallback(async () => {
    const client = generateClient();
    try {
      const counts = await getFollowCounts();
      const { userId } = await getCurrentUser();
      if (counts) {
        setFollowCounts(counts);
      }
      // Increment the refreshKey to force UserPostList to re-render
      setRefreshKey(prevKey => prevKey + 1);

      // const recentlyPlayedDisabledResponse = await client.graphql({
      //   query: getUser,
      //   variables: { id: userId },
      // });

      // const recentlyPlayedDisabled = recentlyPlayedDisabledResponse.data.getUser?.recentlyPlayedDisabled ?? false;
      // setRecentlyPlayedDisabled(recentlyPlayedDisabled);

      // const recentlyPlayedResponse = await client.graphql({
      //   query: listSpotifyRecentlyPlayedTracks,
      //   variables: { 
      //     filter: { 
      //       userSpotifyRecentlyPlayedTrackId: { eq: userId } 
      //     } 
      //   },
      // });

      // const recentlyPlayedItems = recentlyPlayedResponse.data.listSpotifyRecentlyPlayedTracks.items;
      // if (recentlyPlayedItems && recentlyPlayedItems.length > 0) {
      //   const mostRecentTrack = recentlyPlayedItems.reduce((latest, current) => {
      //     return new Date(current._lastChangedAt) > new Date(latest._lastChangedAt) ? current : latest;
      //   });
      //   setRecentlyPlayedTrack(mostRecentTrack as any);
      // }
      
    } catch (error) {
      console.error('Error refreshing posts and follow counts:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserDataAndCounts();
  }, [recentlyPlayedDisabled]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshPostsAndFollowCounts().finally(() => setRefreshing(false));
  }, [refreshPostsAndFollowCounts]);

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

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

  const handleFollowListNavigation = (initialTab: 'following' | 'followers') => {
    navigation.navigate('FollowList', { userId: userInfo?.userId, initialTab });
  };

  const resetSelectedPost = () => {
    setSelectedPost(null);
  };

  const handlePostsCountUpdate = (count: number) => {
    setPostsCount(count);
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

  const handlePresentPostModalPress = (item: any) => {
    setSelectedPost(item);
    postBottomSheetRef.current?.present();
  };

  const handlePresentSettingsModalPress = () => { 
    settingsBottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={[styles.container]}>
          <View style={styles.header}>
            <Text style={styles.usernameWelcome}>{userInfo?.username}</Text>
            <View style={styles.icons}>
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
              showsVerticalScrollIndicator={false}
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

              {recentlyPlayed.length > 0 && !recentlyPlayedDisabled && recentlyPlayedTrack && ( 
                <GestureHandlerRootView>
                  <LongPressGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => {
                      if (nativeEvent.state === State.ACTIVE) {
                        handleLongPress();
                      }
                    }}
                    minDurationMs={500}
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
                      <Text style={styles.rpTitle}>My Recently Played</Text>
                        <ScrollView 
                          horizontal={true} 
                          showsHorizontalScrollIndicator={false} 
                          style={styles.recentlyPlayedContent}
                          contentContainerStyle={styles.recentlyPlayedContentContainer}
                        >
                          <View>
                            <Text style={styles.recentlyPlayedText}>
                              {recentlyPlayed[0].track.name} - {recentlyPlayed[0].track.artists[0].name}
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
        <RPBottomSheetModal ref={rpBottomSheetRef} userId={userInfo?.userId} />
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
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: 10,
    // marginBottom: 10,
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
  waveformContainer: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default ProfileScreen;