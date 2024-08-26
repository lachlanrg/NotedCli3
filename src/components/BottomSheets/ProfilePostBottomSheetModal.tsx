// ProfilePostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { dark, light, error } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { getPost } from "../../graphql/queries";

import { getCurrentUser } from 'aws-amplify/auth';

const trashIcon = faTrashCan as IconProp;
const musicIcon = faMusic as IconProp;


export type Ref = BottomSheetModal;

interface ProfilePostBottomSheetProps {
    post: any;
    onPostDelete: () => void;
}

const ProfilePostBottomSheetModal = forwardRef<BottomSheetModal, ProfilePostBottomSheetProps>(({ post, onPostDelete }, ref) => { 
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


  const handleDeletePost = async () => {
    try {
      const client = generateClient();
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post?',
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
                // Refetch the post data to ensure we have the latest version
                const response = await client.graphql({
                  query: getPost,
                  variables: { id: post.id },
                });
                const latestPost = response.data.getPost;
  
                if (latestPost) {
                  console.log('Deleting post with id', latestPost.id, 'and version', latestPost._version);
                  const deleteResponse = await client.graphql({
                    query: mutations.deletePost,
                    variables: { input: { id: latestPost.id, _version: latestPost._version } },
                  });
                  console.log('Delete post response:', deleteResponse);
                  onPostDelete();
                  dismiss();
                } else {
                  console.error('Post not found');
                  Alert.alert('Error', 'Post not found. Please try again.');
                }
              } catch (error) {
                console.error("Error deleting post:", error);
                Alert.alert('Error', 'Failed to delete post. Please try again.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error showing delete alert:", error);
    }
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
          {post && (
            <View>
              <Text style={styles.containerHeadline}>
                {post.spotifyAlbumName ? (
                  `Spotify Album: ${post.spotifyAlbumName}` 
                ) : post.spotifyTrackName ? (
                  `Spotify Track: ${post.spotifyTrackName}`
                ) : post.scTrackTitle ? ( 
                  `SoundCloud Track: ${post.scTrackTitle}`
                ) : (
                  'Post Title' 
                )}
              </Text>
            </View>
          )}
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <FontAwesomeIcon icon={musicIcon} size={24} color={dark} /> 
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesomeIcon icon={musicIcon} size={24} color={dark} /> 
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePost}> 
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 40, 
    paddingHorizontal: 20, 
  },
});

export default ProfilePostBottomSheetModal

