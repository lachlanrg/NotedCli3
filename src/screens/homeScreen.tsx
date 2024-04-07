// src/screens/HomeScreen.tsx
import * as React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CreatePostTab')}>
            <FontAwesomeIcon icon={faEdit} size={20} color="#007AFF" />
          </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default HomeScreen;
