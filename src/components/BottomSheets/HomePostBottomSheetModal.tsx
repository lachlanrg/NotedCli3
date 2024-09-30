// HomePostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light, error, mediumgray, lgray, spotifyGreen, soundcloudOrange, gray } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';

import { getCurrentUser } from 'aws-amplify/auth';
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';

const trashIcon = faTrashCan as IconProp;
const musicIcon = faMusic as IconProp;
const searchIcon = faMagnifyingGlass as IconProp;
const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

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
    if (item) {
      const url = item.scTrackPermalinkUrl 
                  || item.spotifyAlbumExternalUrl 
                  || item.spotifyTrackExternalUrl; 

      if (url) {
        Linking.openURL(url);
        dismiss();
      } else {
        console.warn('No external URL found for the selected item');
      }
    } else {
      console.warn('No item selected');
    }
  };

  const handleDetailsPress = () => {
    if (item) {
      let id: string | undefined;
      let type: string | undefined;

      if (item.spotifyTrackId) {
        id = item.spotifyTrackId;
        type = 'spotifyTrack';
      } else if (item.spotifyAlbumId) {
        id = item.spotifyAlbumId;
        type = 'spotifyAlbum';
      } else if (item.scTrackId) {
        id = item.scTrackId;
        type = 'scTrack';
      }

      if (id && type) {
        navigation.navigate('ExplorePost', { id, type });
        dismiss();
      } else {
        console.warn('No valid ID found for the selected item');
      }
    } else {
      console.warn('No item selected');
    }
  };

  const getListenIcon = () => {
    if (item) {
      if (item.spotifyTrackId || item.spotifyAlbumId) {
        return spotifyIcon;
      } else if (item.scTrackId) {
        return soundcloudIcon;
      }
    }
    return musicIcon;
  };

  const getListenIconColor = () => {
    if (item) {
      if (item.spotifyTrackId || item.spotifyAlbumId) {
        return spotifyGreen;
      } else if (item.scTrackId) {
        return soundcloudOrange;
      }
    }
    return dark;
  };

  const { dismiss } = useBottomSheetModal();


  return (
    <BottomSheetModal
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
      backgroundStyle={{ backgroundColor: mediumgray }}
      handleIndicatorStyle={{ backgroundColor: light }}
    >
      <View style={styles.contentContainer}>
        {item ? (
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemType}>
              {item.spotifyAlbumName ? "Spotify Album" : 
               item.spotifyTrackName ? "Spotify Track" : 
               item.scTrackTitle ? "SoundCloud Track" : "Unknown Type"}
            </Text>
            <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.spotifyAlbumName || item.spotifyTrackName || item.scTrackTitle || "No Title Available"}
            </Text>
          </View>
        ) : (
          <Text style={styles.noItemText}>No item selected</Text>
        )}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDetailsPress}>
            <FontAwesomeIcon icon={searchIcon} size={24} color={light} />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleListenPress}>
            <FontAwesomeIcon icon={getListenIcon()} size={24} color={getListenIconColor()} />
            <Text style={styles.actionText}>Listen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
  },
  itemInfoContainer: {
    marginBottom: 8,
  },
  itemType: {
    fontSize: 14,
    color: lgray,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: light,
  },
  noItemText: {
    fontSize: 16,
    color: error,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomePostBottomSheetModal

