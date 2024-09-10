import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, SafeAreaView, Dimensions, Animated, Easing, PanResponder } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../components/types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faEdit, faUserPlus, faBell } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, placeholder, dgray } from '../../components/colorModes';
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


type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const spotifyIcon = faSpotify as IconProp;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [followCounts, setFollowCounts] = useState({ following: 0, followers: 0 });
  const settingsBottomSheetRef = useRef<BottomSheetModal>(null);
  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { recentlyPlayed } = useSpotify();

  const handlePresentPostModalPress = (post: any) => {
    setSelectedPost(post);
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
    await fetchFollowCounts(); // Await the promise
  }, [fetchFollowCounts]);


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
              <View style={styles.stat}>
              
                <Text style={styles.statText}>Followers: {followCounts.followers}</Text>
              </View>
              <View style={styles.stat}>
              
                <Text style={styles.statText}>Following: {followCounts.following}</Text>
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
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.rpTitle}>Recently Played</Text>
                  <Text style={styles.recentlyPlayedText}>
                    {recentlyPlayed[0].track.name} -{' '}
                    {recentlyPlayed[0].track.artists[0].name} 
                  </Text>
                </View>
              </View>
            )}
            {/* {recentlyPlayed.length > 0 && ( 
              <View style={styles.recentlyPlayedBox}>
                <View style={styles.spotifyIcon}>
                  <FontAwesomeIcon icon={spotifyIcon} size={20} color={light}/>
                </View>
                <Text style={styles.recentlyPlayedText} numberOfLines={1} ellipsizeMode="tail">
                  {recentlyPlayed[0].track.name} -{' '}
                  {recentlyPlayed[0].track.artists[0].name} 
                </Text>
              </View>
            )} */}
            <UserPostList userId={userInfo?.userId} onPostPress={handlePresentPostModalPress} />
          </ScrollView>
          <SettingsBottomSheet ref={settingsBottomSheetRef} />
          <ProfilePostBottomSheetModal ref={postBottomSheetRef} post={selectedPost} onPostDelete={handlePostDeleted}/>

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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
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
    paddingRight: 2,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default ProfileScreen;