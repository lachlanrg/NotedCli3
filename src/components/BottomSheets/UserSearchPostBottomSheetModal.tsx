// UserSearchPostBottomSheetModal.tsx
import React, { useMemo, forwardRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { dark, light, modalBackground } from "../colorModes";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faShare, faHeart } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const musicIcon = faMusic as IconProp;
const shareIcon = faShare as IconProp;
const heartIcon = faHeart as IconProp;

export type Ref = BottomSheetModal;

interface UserSearchPostBottomSheetProps {
    post: any;
}

const UserSearchPostBottomSheetModal = forwardRef<BottomSheetModal, UserSearchPostBottomSheetProps>(({ post }, ref) => { 
  const snapPoints = useMemo(() => ['20%'], []);

  const renderBackDrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} />,
    []
  );

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
              <FontAwesomeIcon icon={shareIcon} size={24} color={dark} /> 
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesomeIcon icon={heartIcon} size={24} color={dark} />
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

export default UserSearchPostBottomSheetModal;
