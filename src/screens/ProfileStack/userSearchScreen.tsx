// userSearchScreen.tsx
import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, lgray, placeholder, dgray, error } from '../../components/colorModes';
import { ProfileStackParamList} from '../../components/types';

import { User } from '../../API';


import useSearchUsers from '../../components/userSearch';

type UserSearchProfileScreenProps = {
    navigation: NativeStackNavigationProp<ProfileStackParamList, 'UserSearch'>;
  };

const UserSearchScreen: React.FC<UserSearchProfileScreenProps> = ({ navigation }) => {
  const { searchUsers, searchTerm, setSearchTerm, searchResults, clearSearchResults } = useSearchUsers();

  const handleUserSearch = async () => {
    if (searchTerm.trim() === '') {
      clearSearchResults(); // Clear search results if the input is empty
    } else {
      await searchUsers();
    }
    console.log("User Search input: " + searchTerm);
  };

  const handleInputChange = (text: string) => {
    setSearchTerm(text);
  };
  useEffect(() => {
    if (searchTerm.trim() === '') {
      clearSearchResults(); // Clear search results if the input is empty
    } else {
      searchUsers(); // Trigger search when searchTerm changes
    }
  }, [searchTerm]);

  const handleUserPress = (user: User) => {
    navigation.navigate('UserSearchProfile', { userId: user.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faUserPlus} size={18} color={light} style={styles.userPlusIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find a friend..."
            value={searchTerm}
            onChangeText={handleInputChange}
            autoCapitalize="none"       // Disable auto-capitalization
            autoCorrect={false}         // Disable auto-correction
            placeholderTextColor={placeholder}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === 'Enter' || event.nativeEvent.key === 'Return') {
                handleUserSearch();
              }
            }}
            onSubmitEditing={handleUserSearch}
          />
          {searchTerm !== '' && (
            <TouchableOpacity style={styles.clearButton} onPress={() => handleInputChange('')}>
              <FontAwesomeIcon icon={faTimes} size={14} style={styles.clearButtonIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={searchResults || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)} style={styles.itemContainer}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>Search to find a friend</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 0,
    backgroundColor: dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 30,
  },
  backButton: {
    marginRight: 10,
  },
  userPlusIcon: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: gray,
    borderRadius: 12,
    paddingHorizontal: 10,
    width: '90%',
    marginRight: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 10,
    marginLeft: 1,
    color: light,
  },
  clearButton: {
    padding: 10,
  },
  clearButtonIcon: {
    color: lgray,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: gray,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  username: {
    color: light,
  },
  noResultsText: {
    textAlign: 'center',
    color: lgray,
    marginTop: 20,
  },
});

export default UserSearchScreen;
