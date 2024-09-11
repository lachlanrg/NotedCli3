// ProfilePostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light, error } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { getPost, getRepost } from "../../graphql/queries";

import { getCurrentUser } from 'aws-amplify/auth';

const trashIcon = faTrashCan as IconProp;
const musicIcon = faMusic as IconProp;
const repostIcon = faRetweet as IconProp;

export type Ref = BottomSheetModal;

interface ProfilePostBottomSheetProps {
    item: any;
    onPostDelete: () => void;
    onClose: () => void;
}

const ProfilePostBottomSheetModal = forwardRef<BottomSheetModal, ProfilePostBottomSheetProps>(({ item, onPostDelete, onClose }, ref) => { 
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

  const getItemTitle = () => {
    const postToRender = 'originalPost' in item ? item.originalPost : item;
    if (postToRender.spotifyAlbumName) {
      return `Spotify Album: ${postToRender.spotifyAlbumName}`;
    } else if (postToRender.spotifyTrackName) {
      return `Spotify Track: ${postToRender.spotifyTrackName}`;
    } else if (postToRender.scTrackTitle) {
      return `SoundCloud Track: ${postToRender.scTrackTitle}`;
    } else {
      return 'Post Title';
    }
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
    >
      <View style={styles.contentContainer}>
        {item ? (
          <View>
            <Text style={styles.containerHeadline}>
              {getItemTitle()}
            </Text>
            {'originalPost' in item && (
              <Text style={styles.repostText}>
                Reposted from <Text style={styles.boldUsername}>{item.originalPost.username || 'Unknown User'}</Text>
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.containerHeadline}>No item selected</Text>
        )}
        <View style={styles.iconRow}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={musicIcon} size={24} color={dark} /> 
          </TouchableOpacity>
          {item && 'originalPost' in item ? (
            <TouchableOpacity>
              <FontAwesomeIcon icon={repostIcon} size={24} color={dark} /> 
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <FontAwesomeIcon icon={musicIcon} size={24} color={dark} /> 
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDeleteItem}> 
            <FontAwesomeIcon icon={trashIcon} size={24} color={error} />
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
  repostText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
    paddingLeft: 10,
    marginTop: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 40, 
    paddingHorizontal: 20, 
  },
  boldUsername: {
    fontWeight: 'bold',
    color: '#888',
  },
});

export default ProfilePostBottomSheetModal;

