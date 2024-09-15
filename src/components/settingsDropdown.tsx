import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import more icons as needed

const { width } = Dimensions.get('window');

const SettingsDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownPosition = React.useRef(new Animated.Value(width)).current;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    Animated.timing(dropdownPosition, {
      toValue: isDropdownOpen ? width : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.settingsButton}>
        <FontAwesomeIcon icon={faCog} size={25} color="black" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <Animated.View style={[styles.dropdownMenu, { right: dropdownPosition }]}>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesomeIcon icon={faUser} size={20} color="black" />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesomeIcon icon={faBell} size={20} color="black" />
            <Text style={styles.menuItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesomeIcon icon={faSignOutAlt} size={20} color="black" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    width: 200,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 10,
  },
  settingsButton: {
    // Your settings button styles
  },
});

export default SettingsDropdown;
