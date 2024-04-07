// SearchScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching for:', searchQuery);
    // You can add code here to perform the search
    // For example, using AWS services like Amplify
    // You can also add validation logic here
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Add search results or other content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
  clearButton: {
    padding: 10,
  },
});

export default SearchScreen;
