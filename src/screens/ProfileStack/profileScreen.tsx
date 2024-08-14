import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, Dimensions, PanResponder, Modal, ScrollView, ActivityIndicator, RefreshControl} from 'react-native';
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
import { handleScrollRefresh, showRefreshIcon, refreshing, setRefreshing } from '../../components/scrollRefresh';

import SettingsDropdown from '../../components/settingsDropdown';
import UserPostList from '../../components/userPostsList';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const searchBoxHeight = React.useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [overlayVisible, setOverlayVisible] = React.useState<boolean>(false);

  const menuWidth = Dimensions.get('window').width / 2.3;
  const menuPosition = useRef(new Animated.Value(-menuWidth)).current;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('start'); // 'start', 'codeSent', 'done'
  const [followCounts, setFollowCounts] = useState({ following: 0, followers: 0 });



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

  const panResponder = React.useRef(
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


  React.useEffect(() => {
    currentAuthenticatedUser();
    UserAttributes();
    fetchFollowCounts();
  }, []); 

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

  // React.useEffect(() => {
  //   Animated.timing(searchBoxHeight, {
  //     toValue: showSearchBox ? 50 : 0,
  //     duration: 300,
  //     easing: Easing.ease,
  //     useNativeDriver: false,
  //   }).start();
  // }, [showSearchBox]);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log('___________________________________')
      console.log(`Current Authenticated User Info:`);
      console.log(`The Username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
      console.log('___________________________________')
      setUserInfo({ username, userId, signInDetails });
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

  async function handleSignOut() {
    try {
      const { username } = await getCurrentUser();

      console.log('Attempting to sign out user: ', username);
      await signOut();
      navigation.navigate('Login');
      console.log('User Signed Out');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const handleSearchToggle = () => {
    setShowSearchBox(!showSearchBox);
  };

  const handleNavigateToUserSearch = () =>{
    navigation.navigate('UserSearch');
    console.log("Navigating to UserSearch Screen")
    };

  const handleSettingsMenu = () => {
    console.log("Opened settings")
    toggleMenu();
  };

  const handleNotificationPress = () => {
    console.log("Notification button pressed");
    navigation.navigate('Notifications');
    // Navigate to the notifications screen or handle notifications logic
  };

  const handleResetPassword = async (username: string) => {
    try {
      const output: ResetPasswordOutput = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
      setIsConfirmingReset(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPasswordNextSteps = (output: ResetPasswordOutput) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        console.log(`Confirmation code was sent to ${nextStep.codeDeliveryDetails.deliveryMedium}`);
        setCurrentPhase('codeSent');
        break;
      case 'DONE':
        console.log('Successfully reset password.');
        setCurrentPhase('done');
        break;
    }
  };

  const handleConfirmResetPassword = async ({ username, confirmationCode, newPassword }: ConfirmResetPasswordInput) => {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      console.log('Password reset successful.');
      setCurrentPhase('done');
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmReset = () => {
    if (newPassword !== confirmNewPassword) {
      setShowConfirmationError(true);
      return; 
    }

    setShowConfirmationError(false); // Reset error if passwords match
    handleConfirmResetPassword({ username: resetUsername, confirmationCode, newPassword });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setResetUsername('');
    setConfirmationCode('');
    setNewPassword('');
    setIsConfirmingReset(false);
    setCurrentPhase('start');
  };

  const handleResetCloseMenu = () => {
    setResetUsername(userInfo.username); // Set the initial username
    setIsModalVisible(true);
    toggleMenu();
  }


  return (
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
          <TouchableOpacity style={styles.createPostButton} onPress={(handleSettingsMenu)}>
            <FontAwesomeIcon icon={faCog} size={25} color={light} />
          </TouchableOpacity>
          {/* <SettingsDropdown /> */}
        </View>
      </View>

      <Animated.View 
        style={[
          styles.refreshIconContainer,
          { 
            opacity: showRefreshIcon, 
            transform: [
              {
                translateY: showRefreshIcon.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0], 
                }),
              },
            ],
          }
        ]}
      >
        <ActivityIndicator size="small" color={light} /> 
      </Animated.View>

      <ScrollView
          style={styles.scrollViewContent}
          onScroll={handleScrollRefresh}
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

        {userInfo && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfo}>Username: {userInfo.username}</Text>
            <Text style={styles.userInfo}>User ID: {userInfo.userId}</Text>
            <Text style={styles.userInfo}>Sign In Details: {JSON.stringify(userInfo.signInDetails)}</Text>
            {email && <Text style={styles.userInfo}>Email: {email}</Text>}
          </View>
        )}
        <UserPostList userId={userInfo?.userId} />
      </ScrollView>
  
  <Animated.View
      {...panResponder.panHandlers}
      style={[styles.settingsMenu, { right: menuPosition, width: menuWidth }]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
        <FontAwesomeIcon icon={faTimes} size={24} color={light} />
      </TouchableOpacity>
      <View style={styles.settingsContainer}> 
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResetCloseMenu}>
          <Text style={styles.settingsText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutButtonContainer}> 
        <Button 
          title="Logout" 
          onPress={handleSignOut}
          color={error} 
        /> 
      </View>
    </Animated.View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackgroundContainer}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, currentPhase === 'start' 
              ? styles.startPhaseHeight 
              : styles.codeSentPhaseHeight, 
              currentPhase === 'done' ? styles.donePhaseHeight : null]}
            >
              {currentPhase === 'start' && (
                <View>
                  <Text style={styles.userInfo}>
                  Reset Password for <Text style={{ fontWeight: 'bold', color: light }}>{resetUsername}</Text>
                </Text>
                  <Button title="Send Reset Code" onPress={() => handleResetPassword(resetUsername)} />
                  <Button title="Close" onPress={closeModal} color={error} />
                </View>
              )}
              {currentPhase === 'codeSent' && (
                <View>
                  <Text style={styles.modalText}>Enter Confirmation Code and New Password</Text>
                  <TextInput
                    placeholder="Confirmation Code"
                    value={confirmationCode}
                    onChangeText={setConfirmationCode}
                    style={styles.input}
                    placeholderTextColor={placeholder}
                  />
                  <TextInput
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor={placeholder}
                  />
                  <TextInput
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor={placeholder}
                  />
                  {showConfirmationError && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                  )}
                  <Button title="Confirm Reset" onPress={handleConfirmReset} />
                  <Button title="Close" onPress={closeModal} color={error} />
                </View>
              )}
              {currentPhase === 'done' && (
                <View>
                  <Text style={styles.doneModalText}>Password reset successful!</Text>
                  <Button title="Close" onPress={closeModal} />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
      </View>
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
    paddingTop: 20,
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
});

export default ProfileScreen;