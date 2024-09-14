// HomePostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light, error, modalBackground } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';

import { getCurrentUser } from 'aws-amplify/auth';

const trashIcon = faTrashCan as IconProp;
const musicIcon = faMusic as IconProp;
const searchIcon = faMagnifyingGlass as IconProp;


export type Ref = BottomSheetModal;

interface HomePostBottomSheetProps {
    item: any | null; 
  }

const HomePostBottomSheetModal = forwardRef<BottomSheetModal, HomePostBottomSheetProps>(({ item }, ref) => {
  const snapPoints = useMemo(() => ['20%'], []);
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

  const handleListenPress = () => { 
    if (item) { // Access 'item' from the props
      const url = item.scTrackPermalinkUrl 
                  || item.spotifyAlbumExternalUrl 
                  || item.spotifyTrackExternalUrl; 

      if (url) {
        Linking.openURL(url);
        dismiss(); // Optionally close the modal after opening the link 
      } else {
        console.warn('No external URL found for the selected item');
      }
    }
  };

  const handleDetailsPress = () => {
    if (item) {
      let id: string;
      let type: string;

      if (item.spotifyTrackId) {
        id = item.spotifyTrackId;
        type = 'spotifyTrack';
      } else if (item.spotifyAlbumId) {
        id = item.spotifyAlbumId;
        type = 'spotifyAlbum';
      } else if (item.scTrackId) {
        id = item.scTrackId;
        type = 'scTrack';
      } else {
        console.warn('No valid ID found for the selected item');
        return;
      }

      navigation.navigate('ExploreTab', { screen: 'ExplorePost', params: { id, type } });
      dismiss(); // Close the bottom sheet after navigation
    } else {
      console.warn('No item selected');
    }
  };

  const { dismiss } = useBottomSheetModal();


  return (
    <BottomSheetModal
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
      backgroundStyle={{ backgroundColor: modalBackground }}
    >
        <View style={styles.contentContainer}>
        {item && ( // Conditionally render content if 'item' exists
          <View>
            <Text style={styles.containerHeadline}>
              {item.spotifyAlbumName ? (
                `Spotify Album: ${item.spotifyAlbumName}`
              ) : item.spotifyTrackName ? (
                `Spotify Track: ${item.spotifyTrackName}`
              ) : item.scTrackTitle ? (
                `SoundCloud Track: ${item.scTrackTitle}`
              ) : (
                'No Title Available' // Handle cases where no title is found
              )}
              </Text>
            </View>
          )}
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={handleDetailsPress}>
              <FontAwesomeIcon icon={searchIcon} size={24} color={dark} /> 
            </TouchableOpacity>
            <TouchableOpacity onPress={handleListenPress}> 
              <FontAwesomeIcon icon={musicIcon} size={24} color={dark} /> 
            </TouchableOpacity>
          </View>
        </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  containerHeadline: {
    fontSize: 16,
    paddingLeft: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 40, 
    paddingHorizontal: 20, 
  },
});

export default HomePostBottomSheetModal

