import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light } from "../colorModes";

import { signOut, getCurrentUser } from 'aws-amplify/auth';

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

  const renderBackDrop = useCallback (
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
      // Assuming you have a Login screen in your navigation stack
      navigation.navigate('Login'); 
      console.log('User Signed Out');
    } catch (error) {
      console.log('error signing out: ', error);
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
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  containerHeadline: {
    fontSize: 24,
  },
});

export default SettingsBottomSheet

