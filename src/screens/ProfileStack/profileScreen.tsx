import React, { useEffect, useCallback, useRef, useState} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, Dimensions, PanResponder, Modal, ScrollView, ActivityIndicator, RefreshControl, SafeAreaView} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../components/types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; 
import { faCog, faTimes, faEdit, faUserPlus } from '@fortawesome/free-solid-svg-icons'; 
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { dark, light, placeholder, lgray, dgray, gray, error } from '../../components/colorModes';

import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { resetPassword, confirmResetPassword, type ResetPasswordOutput, type ConfirmResetPasswordInput } from 'aws-amplify/auth';

import { getFollowCounts } from '../../components/currentUserFollowerFollowingCount';
import { refreshing, setRefreshing } from '../../components/scrollRefresh';

import UserPostList from '../../components/userPostsList';

import SettingsBottomSheet from '../../components/BottomSheets/SettingsBottomSheetModal';
import ProfilePostBottomSheetModal from '../../components/BottomSheets/ProfilePostBottomSheetModal';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

  const [userInfo, setUserInfo] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

  const menuWidth = Dimensions.get('window').width / 2.3;
  const menuPosition = useRef(new Animated.Value(-menuWidth)).current;
  const [followCounts, setFollowCounts] = useState({ following: 0, followers: 0 });
  const [posts, setPosts] = useState<any[]>([]);

  const settingsBottomSheetRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();

  const handlePresentSettingsModalPress = () => { 
    settingsBottomSheetRef.current?.present();
  };

  const postBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null); // Store the selected post

  const handlePresentPostModalPress = (post: any) => {
    setSelectedPost(post);
    postBottomSheetRef.current?.present();
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setOverlayVisible(!overlayVisible);
    Animated.timing(menuPosition, {
      toValue: menuVisible ? -menuWidth : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Check if touch starts from the left 50 pixels
        return gestureState.dx < 30;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 50) {
          toggleMenu();
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFollowCounts(); // Await the promise
  }, [fetchFollowCounts]); 


  const currentAuthenticatedUser = async () => {
    try {
      const user = await getCurrentUser();
      const { userId, username } = user;
      // console.log(`The User Id: ${userId}, Username: ${username}`);
      setUserInfo({ userId, username });
    } catch (err) {
      console.log(err);
    }
  }

  const UserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      if (userAttributes.email) {
        setEmail(userAttributes.email);
      } else {
        console.log('Email attribute is undefined');
      }
    } catch (err) {
      console.log(err);
    }
  }

  // async function handleSignOut() {
  //   try {
  //     const { username } = await getCurrentUser();

  //     console.log('Attempting to sign out user: ', username);
  //     await signOut();
  //     navigation.navigate('Login');
  //     console.log('User Signed Out');
  //   } catch (error) {
  //     console.log('error signing out: ', error);
  //   }
  // }

  const handleNavigateToUserSearch = () =>{
    navigation.navigate('UserSearch');
    console.log("Navigating to UserSearch Screen")
    };

  const handleNotificationPress = () => {
    console.log("Notification button pressed");
    navigation.navigate('Notifications');
    // Navigate to the notifications screen or handle notifications logic
  };

  const handlePostDeleted = () => {
    // Refetch posts or update the post list in state
    console.log("Post deleted from ProfileScreen");
    // Assuming you have a function to fetch posts
    // fetchUserPosts();
  };

  useEffect(() => {
    const fetchData = async () => {
      await currentAuthenticatedUser();
      await fetchUserAttributes();
      await fetchFollowCounts();
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={[styles.container]}>
        {overlayVisible && (
          <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
        )}
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
              // onScroll={handleScrollRefresh}
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: light,
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
  settingsMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: gray,
    elevation: 8,
    shadowColor: dark,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingHorizontal: 20, // Add some padding around the settings
    justifyContent: 'flex-start', // Space between settings and logout
  },
  settingsContainer: {
    alignItems: 'flex-end', // Align settings to the right
    marginTop: 20, // Add top margin to settings
    flex: 1, // Take up all remaining space
  },
  closeButton: {
    alignSelf: 'flex-end', 
    paddingTop: 10,
  },
  settingsText: {
    marginBottom: 10, // Add space between settings items
    color: light,
  },
  logoutButtonContainer: {
    marginBottom: 20, // Add space at the bottom
  },
  logoutButton: {
    backgroundColor: 'red', // Red background for logout button
    marginBottom: 20, // Add space at the bottom
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    },
  modalContainer: {
    position: 'absolute', 
    top: 0, 
    bottom: 50,
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
    shadowColor: gray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    // Adjust initial and final height as needed
    // The initial height should accommodate the content of the first phase
    height: 200, 
    bottom: '12%',  
  },
  startPhaseHeight: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150, 
  },
  codeSentPhaseHeight: {
    top: 0, 
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 320, 
  },
  donePhaseHeight: {
    height: 100, 
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: light,
  },
  doneModalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: light,
  },
  input: {
    borderWidth: 1,
    borderColor: placeholder,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 2,
    textAlign: 'center',
    fontSize: 12,
  },
  scrollViewContent: {
    flex: 1,
  },
  refreshIconContainer: {
    position: 'absolute',
    top: 70, 
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default ProfileScreen;