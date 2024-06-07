import * as React from 'react';
import { useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, Dimensions, PanResponder, PanResponderGestureState} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../components/types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; // Import IconProp type
import { faCog, faEdit, faUserPlus } from '@fortawesome/free-solid-svg-icons'; // Import faUserPlus
import { faBell } from '@fortawesome/free-solid-svg-icons';


import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import SettingsDropdown from '../components/settingsDropdown';


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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setOverlayVisible(!overlayVisible);
    Animated.timing(menuPosition, {
      toValue: menuVisible ? -menuWidth : 0,
      duration: 300,
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
  }, []);

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
  

  return (
    <View style={[styles.container]}>
      {overlayVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
      <View style={styles.header}>
        <Text style={styles.usernameWelcome}>{userInfo?.username}</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate('CreatePostTab')}>
            <FontAwesomeIcon icon={faEdit} size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellIconButton} onPress={handleNotificationPress}>
            <FontAwesomeIcon icon={faBell} size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.createPostButton} onPress={(handleSettingsMenu)}>
            <FontAwesomeIcon icon={faCog} size={25} color="black" />
          </TouchableOpacity>
          {/* <SettingsDropdown /> */}
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statText}>Followers: 120</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statText}>Following: 300</Text>
        </View>
        <TouchableOpacity onPress={handleNavigateToUserSearch}>
          <FontAwesomeIcon icon={faUserPlus} size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.searchContainer, { height: searchBoxHeight }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>
      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Username: {userInfo.username}</Text>
          <Text style={styles.userInfo}>User ID: {userInfo.userId}</Text>
          <Text style={styles.userInfo}>Sign In Details: {JSON.stringify(userInfo.signInDetails)}</Text>
          {email && <Text style={styles.userInfo}>Email: {email}</Text>}
        </View>
      )}
  
      <Animated.View {...panResponder.panHandlers} style={[styles.settingsMenu, { right: menuPosition, width: menuWidth }]}>
        {/* Your settings menu content here */}
        <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <Button title="Logout" onPress={handleSignOut} />
      </Animated.View>
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  usernameWelcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
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
  },
  userInfoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  userInfo: {
    marginBottom: 10,
  },
  settingsMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    paddingTop: 20, 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'flex-start',
  },
  closeButton: {
    alignSelf: 'flex-end', // Align the button to the right
    marginRight: 10, // Add some margin for better spacing
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ProfileScreen;