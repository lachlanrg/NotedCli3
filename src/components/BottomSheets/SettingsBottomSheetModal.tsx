// SettingsBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState, useEffect, MutableRefObject } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faUser, faBell, faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { dark, gray, lgray, light, modalBackground } from "../colorModes";

export type Ref = BottomSheetModal;

const SettingsBottomSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['70%'], []);
  const [userInfo, setUserId] = useState<any>(null);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const modalRef = ref as MutableRefObject<BottomSheetModal | null>;
      if (shouldShowModal && modalRef.current) {
        modalRef.current.present();
        setShouldShowModal(false);
      }
    }, [shouldShowModal])
  );

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

  const handleNavigate = (screen: string) => {
    setShouldShowModal(true);
    dismiss();
    navigation.navigate(screen);
  };

  async function handleSignOut() {
    try {
      const { username } = await getCurrentUser();
      console.log('Attempting to sign out user: ', username);
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
      console.log('User Signed Out');
      dismiss();
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
      backgroundStyle={{ backgroundColor: modalBackground }}

    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Settings</Text>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('GeneralSettings')}>
          <FontAwesomeIcon icon={faGear as IconProp} size={24} color={dark}/>
          <Text style={styles.optionText}>General</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('AccountSettings')}>
          <FontAwesomeIcon icon={faUser as IconProp} size={24} color={dark}/>
          <Text style={styles.optionText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('NotificationsSettings')}>
          <FontAwesomeIcon icon={faBell as IconProp} size={24} color={dark}/>
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('SpotifyAccountSettings')}>
          <FontAwesomeIcon icon={faSpotify as IconProp} size={24} color={dark}/>
          <Text style={styles.optionText}>Spotify Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('AccessibilitySettings')}>
          <FontAwesomeIcon icon={faEye as IconProp} size={24}color={dark}/>
          <Text style={styles.optionText}>Accessibility</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionContainer} onPress={() => handleNavigate('PrivacySettings')}>
          <FontAwesomeIcon icon={faLock as IconProp} size={24} color={dark}/>
          <Text style={styles.optionText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutOptionContainer, styles.logoutButton]} onPress={handleSignOut}>
          <Text style={[styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: lgray,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
  },
  logoutOptionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  logoutButton: {
    marginTop: 20,
    paddingTop: 15,
  },
  logoutText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SettingsBottomSheet;
