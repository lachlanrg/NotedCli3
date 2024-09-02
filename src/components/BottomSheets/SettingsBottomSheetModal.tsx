import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light } from "../colorModes";
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Ref = BottomSheetModal;

const SettingsBottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['60%'], []);
  const [userInfo, setUserId] = useState<any>(null);
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    currentAuthenticatedUser();
  }, []); 

  async function currentAuthenticatedUser() {
    try {
      const { userId, username } = await getCurrentUser();
      setUserId({ userId, username });
    } catch (err) {
      console.log(err);
    }
  }

  const renderBackDrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} />,
    []
  );

  const { dismiss } = useBottomSheetModal();

  const handleNavigateToResetPassword = () => {
    dismiss(); // Close the bottom sheet
    navigation.navigate('ResetPassword'); 
  };

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

  async function handleSpotifySignOut() {
    try {
      // Clear Spotify-related data from AsyncStorage
      await AsyncStorage.removeItem('spotifyAccessToken');
      await AsyncStorage.removeItem('spotifyRefreshToken');
      await AsyncStorage.removeItem('spotifyTokenExpiration');
      await AsyncStorage.removeItem('spotifyUser');
      
      console.log('Spotify user signed out');
      // Optionally, you can update your app's state or navigate to a different screen
      // For example: navigation.navigate('SpotifyLogin');
      Alert.alert("Success", "Signed out of Spotify Account.");
    } catch (error) {
      console.log('Error signing out Spotify user: ', error);
    }
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Settings</Text>

        <TouchableOpacity onPress={handleNavigateToResetPassword}>
          <Text>Reset Password</Text>
        </TouchableOpacity>
        <Button 
          title="Logout" 
          onPress={handleSignOut}
        />
        <Button 
          title="Spotify Logout" 
          onPress={handleSpotifySignOut}
        />
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  containerHeadline: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default SettingsBottomSheet;