// ProfilePostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light, error, modalBackground } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPenToSquare, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { getPost, getRepost } from "../../graphql/queries";
import { Linking } from 'react-native';

import { getCurrentUser } from 'aws-amplify/auth';

import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { spotifyGreen, soundcloudOrange } from "../colorModes";

const musicIcon = faMusic as IconProp;
const editIcon = faPenToSquare as IconProp;
const repostIcon = faRetweet as IconProp;
const trashIcon = faTrashCan as IconProp;

const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

export type Ref = BottomSheetModal;

interface ProfilePostBottomSheetProps {
    item: any;
    onPostDelete: () => void;
    onClose: () => void;
}

const ProfilePostBottomSheetModal = forwardRef<BottomSheetModal, ProfilePostBottomSheetProps>(({ item, onPostDelete, onClose }, ref) => { 
  const snapPoints = useMemo(() => ['25%'], []);
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

  const handleDeleteItem = async () => {
    try {
      const client = generateClient();
      const isRepost = 'originalPost' in item;
      const deleteMessage = isRepost ? 'Are you sure you want to delete this repost?' : 'Are you sure you want to delete this post?';
      const deleteAction = isRepost ? 'Delete Repost' : 'Delete Post';

      Alert.alert(
        deleteAction,
        deleteMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                let latestItem;
                if (isRepost) {
                  const response = await client.graphql({
                    query: getRepost,
                    variables: { id: item.id },
                  });
                  latestItem = response.data.getRepost;
                } else {
                  const response = await client.graphql({
                    query: getPost,
                    variables: { id: item.id },
                  });
                  latestItem = response.data.getPost;
                }

                if (latestItem) {
                  console.log(`Deleting ${isRepost ? 'repost' : 'post'} with id`, latestItem.id, 'and version', latestItem._version);
                  const deleteResponse = await client.graphql({
                    query: isRepost ? mutations.deleteRepost : mutations.deletePost,
                    variables: { input: { id: latestItem.id, _version: latestItem._version } },
                  });
                  console.log(`Delete ${isRepost ? 'repost' : 'post'} response:`, deleteResponse);
                  onPostDelete();
                  dismiss();
                } else {
                  console.error(`${isRepost ? 'Repost' : 'Post'} not found`);
                  Alert.alert('Error', `${isRepost ? 'Repost' : 'Post'} not found. Please try again.`);
                }
              } catch (error) {
                console.error(`Error deleting ${isRepost ? 'repost' : 'post'}:`, error);
                Alert.alert('Error', `Failed to delete ${isRepost ? 'repost' : 'post'}. Please try again.`);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error showing delete alert:", error);
    }
  };

  const getPostToRender = useCallback(() => {
    if (item && typeof item === 'object' && 'originalPost' in item) {
      return item.originalPost;
    }
    return item;
  }, [item]);

  const handleOpenUri = useCallback(() => {
    const postToRender = getPostToRender();
    if (postToRender) {
      const url = postToRender.scTrackPermalinkUrl 
                  || postToRender.spotifyAlbumExternalUrl 
                  || postToRender.spotifyTrackExternalUrl;

      if (url) {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
        dismiss();
      } else {
        console.warn('No external URL found for the selected item');
      }
    }
  }, [item, dismiss, getPostToRender]);

  const handleEditItem = useCallback(() => {
    // Implement edit functionality here
    console.log('Edit item:', item.id);
    dismiss();
    // Navigate to edit screen or open edit modal
  }, [item, dismiss]);

  const getItemType = () => {
    const postToRender = getPostToRender();
    if (!postToRender) return "Unknown Type";
    if (postToRender.spotifyAlbumName) {
      return "Spotify Album";
    } else if (postToRender.spotifyTrackName) {
      return "Spotify Track";
    } else if (postToRender.scTrackTitle) {
      return "SoundCloud Track";
    } else {
      return "Unknown Type";
    }
  };

  const getItemTitle = () => {
    const postToRender = getPostToRender();
    return postToRender ? (postToRender.spotifyAlbumName || postToRender.spotifyTrackName || postToRender.scTrackTitle || "No Title Available") : "No Title Available";
  };

  const getListenIcon = () => {
    const postToRender = getPostToRender();
    if (!postToRender) return musicIcon;
    if (postToRender.spotifyTrackId || postToRender.spotifyAlbumId) {
      return spotifyIcon;
    } else if (postToRender.scTrackId) {
      return soundcloudIcon;
    }
    return musicIcon;
  };

  const getListenIconColor = () => {
    const postToRender = getPostToRender();
    if (!postToRender) return dark;
    if (postToRender.spotifyTrackId || postToRender.spotifyAlbumId) {
      return spotifyGreen;
    } else if (postToRender.scTrackId) {
      return soundcloudOrange;
    }
    return dark;
  };

  const handleDismiss = () => {
    onClose();
    dismiss();
  };

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
        {item ? (
          <View style={styles.itemInfoContainer}>
            <Text style={styles.itemType}>{getItemType()}</Text>
            <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
              {getItemTitle()}
            </Text>
            {item && typeof item === 'object' && 'originalPost' in item && (
              <Text style={styles.repostText}>
                Reposted from <Text style={styles.boldUsername}>{item.originalPost?.username || 'Unknown User'}</Text>
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noItemText}>No item selected</Text>
        )}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditItem}>
            <FontAwesomeIcon icon={editIcon} size={24} color={dark} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenUri}>
            <FontAwesomeIcon icon={getListenIcon()} size={24} color={getListenIconColor()} />
            <Text style={styles.actionText}>Listen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteItem}>
            <FontAwesomeIcon icon={trashIcon} size={24} color={error} />
            <Text style={styles.actionText}>Delete</Text>
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
    marginBottom: 10,
  },
  itemType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: dark,
  },
  repostText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 5,
  },
  boldUsername: {
    fontWeight: 'bold',
    color: '#888',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,  // Set a fixed width for each button
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: dark,
    textAlign: 'center',
  },
  noItemText: {
    fontSize: 16,
    color: error,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfilePostBottomSheetModal;